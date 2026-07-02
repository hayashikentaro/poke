use portable_pty::{native_pty_system, Child, CommandBuilder, MasterPty, PtySize};
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    env, fs,
    io::{Read, Write},
    path::PathBuf,
    sync::{Arc, Mutex},
    thread,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Emitter, Manager, State};

#[derive(Default)]
struct TerminalState {
    sessions: Mutex<HashMap<String, TerminalSession>>,
}

struct TerminalSession {
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
    master: Box<dyn MasterPty + Send>,
    child: Arc<Mutex<Box<dyn Child + Send + Sync>>>,
}

#[derive(Clone, Serialize)]
struct SessionOutput {
    id: String,
    data: Vec<u8>,
}

#[derive(Clone, Serialize)]
struct SessionExit {
    id: String,
    code: Option<i32>,
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppConfig {
    terminal: TerminalConfig,
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct TerminalConfig {
    font_size: u16,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct CharacterDefinitions {
    config_dir: String,
    characters_dir: String,
    characters: Vec<CharacterDefinition>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct CharacterDefinition {
    id: String,
    name: Option<String>,
    primary: Option<String>,
    terminal_background: Option<String>,
    load_error: Option<String>,
    icon_path: Option<String>,
    idle_path: Option<String>,
    needs_you_path: Option<String>,
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct CharacterDefinitionFile {
    id: Option<String>,
    name: Option<String>,
    primary: Option<String>,
    terminal_background: Option<String>,
}

struct BuiltInCharacter {
    id: &'static str,
    name: &'static str,
    primary: &'static str,
    terminal_background: &'static str,
    icon_file: &'static str,
    idle_file: &'static str,
    needs_you_file: &'static str,
}

const MIN_TERMINAL_FONT_SIZE: u16 = 10;
const MAX_TERMINAL_FONT_SIZE: u16 = 32;
const DEFAULT_CHARACTER_ICON_FILE: &str = "icon_32x32.png";
const DEFAULT_CHARACTER_IDLE_FILE: &str = "idle_32x32_6f.png";
const DEFAULT_CHARACTER_NEEDS_YOU_FILE: &str = "needs_you_32x32_8f.png";
const LOAD_FAILED_CHARACTER_DIR: &str = "_load_failed";
const LOAD_FAILED_CHARACTER_ID: &str = "void";
const LOAD_FAILED_CHARACTER_NAME: &str = "Void";
const LOAD_FAILED_CHARACTER_PRIMARY: &str = "#60D9F5";
const LOAD_FAILED_CHARACTER_BACKGROUND: &str = "#102027";
const BUILT_IN_CHARACTERS: [BuiltInCharacter; 8] = [
    BuiltInCharacter {
        id: "mugi",
        name: "Mugi",
        primary: "#D9F28B",
        terminal_background: "#1D2015",
        icon_file: DEFAULT_CHARACTER_ICON_FILE,
        idle_file: DEFAULT_CHARACTER_IDLE_FILE,
        needs_you_file: DEFAULT_CHARACTER_NEEDS_YOU_FILE,
    },
    BuiltInCharacter {
        id: "rune",
        name: "Rune",
        primary: "#9EE7FF",
        terminal_background: "#181D1F",
        icon_file: DEFAULT_CHARACTER_ICON_FILE,
        idle_file: DEFAULT_CHARACTER_IDLE_FILE,
        needs_you_file: DEFAULT_CHARACTER_NEEDS_YOU_FILE,
    },
    BuiltInCharacter {
        id: "kiku",
        name: "Kiku",
        primary: "#FFB4D6",
        terminal_background: "#21191C",
        icon_file: DEFAULT_CHARACTER_ICON_FILE,
        idle_file: DEFAULT_CHARACTER_IDLE_FILE,
        needs_you_file: DEFAULT_CHARACTER_NEEDS_YOU_FILE,
    },
    BuiltInCharacter {
        id: "sora",
        name: "Sora",
        primary: "#FFC979",
        terminal_background: "#2A2116",
        icon_file: DEFAULT_CHARACTER_ICON_FILE,
        idle_file: DEFAULT_CHARACTER_IDLE_FILE,
        needs_you_file: DEFAULT_CHARACTER_NEEDS_YOU_FILE,
    },
    BuiltInCharacter {
        id: "nagi",
        name: "Nagi",
        primary: "#BCA7FF",
        terminal_background: "#211E2A",
        icon_file: DEFAULT_CHARACTER_ICON_FILE,
        idle_file: DEFAULT_CHARACTER_IDLE_FILE,
        needs_you_file: DEFAULT_CHARACTER_NEEDS_YOU_FILE,
    },
    BuiltInCharacter {
        id: "yuzu",
        name: "Yuzu",
        primary: "#FFE066",
        terminal_background: "#2A2816",
        icon_file: DEFAULT_CHARACTER_ICON_FILE,
        idle_file: DEFAULT_CHARACTER_IDLE_FILE,
        needs_you_file: DEFAULT_CHARACTER_NEEDS_YOU_FILE,
    },
    BuiltInCharacter {
        id: "haru",
        name: "Haru",
        primary: "#98F5C4",
        terminal_background: "#16221B",
        icon_file: DEFAULT_CHARACTER_ICON_FILE,
        idle_file: DEFAULT_CHARACTER_IDLE_FILE,
        needs_you_file: DEFAULT_CHARACTER_NEEDS_YOU_FILE,
    },
    BuiltInCharacter {
        id: "kiri",
        name: "Kiri",
        primary: "#D49BFF",
        terminal_background: "#211827",
        icon_file: DEFAULT_CHARACTER_ICON_FILE,
        idle_file: DEFAULT_CHARACTER_IDLE_FILE,
        needs_you_file: DEFAULT_CHARACTER_NEEDS_YOU_FILE,
    },
];

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            terminal: TerminalConfig { font_size: 18 },
        }
    }
}

#[tauri::command]
fn get_app_config(app: AppHandle) -> Result<AppConfig, String> {
    read_app_config(&app)
}

#[tauri::command]
fn update_terminal_font_size(app: AppHandle, font_size: u16) -> Result<AppConfig, String> {
    let font_size = font_size.clamp(MIN_TERMINAL_FONT_SIZE, MAX_TERMINAL_FONT_SIZE);
    let mut config = read_app_config(&app)?;
    config.terminal.font_size = font_size;
    let config_path = app_config_path(&app)?;
    write_default_app_config(&config_path, &config)?;
    Ok(config)
}

#[tauri::command]
fn get_character_definitions(app: AppHandle) -> Result<CharacterDefinitions, String> {
    let config_dir = app_config_dir(&app)?;
    let characters_dir = config_dir.join("characters");
    fs::create_dir_all(&characters_dir).map_err(|error| error.to_string())?;

    let mut characters = Vec::new();
    let mut seen_ids = HashSet::new();
    let mut failed_definition_index = 1;
    let load_failed_definition = ensure_load_failed_character_definition(&characters_dir)?;

    for character in BUILT_IN_CHARACTERS {
        let character_dir = characters_dir.join(character.id);
        fs::create_dir_all(&character_dir).map_err(|error| error.to_string())?;
        ensure_default_character_definition(&character_dir, &character)?;

        if let Some(definition) = read_character_definition(
            &character_dir,
            character.id,
            character.icon_file,
            character.idle_file,
            character.needs_you_file,
            false,
        ) {
            seen_ids.insert(definition.id.clone());
            characters.push(definition);
        }
    }

    for entry in fs::read_dir(&characters_dir).map_err(|error| error.to_string())? {
        let entry = entry.map_err(|error| error.to_string())?;
        let character_dir = entry.path();

        if !character_dir.is_dir() {
            continue;
        }

        let folder_id = match character_dir.file_name().and_then(|name| name.to_str()) {
            Some(folder_id) => folder_id,
            None => continue,
        };

        if folder_id == LOAD_FAILED_CHARACTER_DIR {
            continue;
        }

        if BUILT_IN_CHARACTERS
            .iter()
            .any(|character| character.id == folder_id)
        {
            continue;
        }

        if let Some(definition) = read_character_definition(
            &character_dir,
            folder_id,
            DEFAULT_CHARACTER_ICON_FILE,
            DEFAULT_CHARACTER_IDLE_FILE,
            DEFAULT_CHARACTER_NEEDS_YOU_FILE,
            true,
        ) {
            if seen_ids.insert(definition.id.clone()) {
                characters.push(definition);
            }
        } else {
            loop {
                let definition = create_load_failed_character_definition(
                    folder_id,
                    failed_definition_index,
                    &load_failed_definition,
                );
                failed_definition_index += 1;

                if seen_ids.insert(definition.id.clone()) {
                    characters.push(definition);
                    break;
                }
            }
        }
    }

    Ok(CharacterDefinitions {
        config_dir: config_dir.to_string_lossy().into_owned(),
        characters_dir: characters_dir.to_string_lossy().into_owned(),
        characters,
    })
}

#[tauri::command]
fn stage_dropped_file(app: AppHandle, file_name: String, data: Vec<u8>) -> Result<String, String> {
    let drops_dir = app
        .path()
        .app_cache_dir()
        .map_err(|error| error.to_string())?
        .join("dropped-files");
    fs::create_dir_all(&drops_dir).map_err(|error| error.to_string())?;

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| error.to_string())?
        .as_millis();
    let file_path = drops_dir.join(format!("{timestamp}-{}", sanitize_file_name(&file_name)));

    fs::write(&file_path, data).map_err(|error| error.to_string())?;
    Ok(file_path.to_string_lossy().into_owned())
}

#[tauri::command]
fn create_session(
    app: AppHandle,
    state: State<'_, TerminalState>,
    id: String,
    cols: u16,
    rows: u16,
) -> Result<(), String> {
    let mut sessions_guard = state
        .sessions
        .lock()
        .map_err(|_| "terminal state lock poisoned".to_string())?;

    if sessions_guard.contains_key(&id) {
        return Ok(());
    }

    let pty_system = native_pty_system();
    let pair = pty_system
        .openpty(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|error| error.to_string())?;

    let mut command = default_shell_command();
    apply_utf8_locale_defaults(&mut command);
    command.env("TERM", "xterm-256color");
    command.env("COLORTERM", "truecolor");
    command.env("CLICOLOR", "1");
    let child = pair
        .slave
        .spawn_command(command)
        .map_err(|error| error.to_string())?;
    let mut reader = pair
        .master
        .try_clone_reader()
        .map_err(|error| error.to_string())?;
    let writer = pair
        .master
        .take_writer()
        .map_err(|error| error.to_string())?;
    let child = Arc::new(Mutex::new(child));
    let reader_child = Arc::clone(&child);
    let reader_app = app.clone();
    let reader_id = id.clone();

    thread::spawn(move || {
        let mut buffer = [0_u8; 8192];

        loop {
            match reader.read(&mut buffer) {
                Ok(0) => break,
                Ok(bytes_read) => {
                    let _ = reader_app.emit(
                        "session_output",
                        SessionOutput {
                            id: reader_id.clone(),
                            data: buffer[..bytes_read].to_vec(),
                        },
                    );
                }
                Err(_) => break,
            }
        }

        let code = reader_child
            .lock()
            .ok()
            .and_then(|mut child| child.wait().ok())
            .map(|status| status.exit_code() as i32);
        let _ = reader_app.emit(
            "session_exit",
            SessionExit {
                id: reader_id.clone(),
                code,
            },
        );

        if let Some(state) = reader_app.try_state::<TerminalState>() {
            if let Ok(mut sessions_guard) = state.sessions.lock() {
                sessions_guard.remove(&reader_id);
            }
        }
    });

    sessions_guard.insert(
        id,
        TerminalSession {
            writer: Arc::new(Mutex::new(writer)),
            master: pair.master,
            child,
        },
    );

    Ok(())
}

#[tauri::command]
fn write_to_session(
    state: State<'_, TerminalState>,
    id: String,
    data: Vec<u8>,
) -> Result<(), String> {
    let writer = {
        let sessions_guard = state
            .sessions
            .lock()
            .map_err(|_| "terminal state lock poisoned".to_string())?;
        sessions_guard
            .get(&id)
            .map(|session| Arc::clone(&session.writer))
            .ok_or_else(|| "no active terminal session".to_string())?
    };

    let mut writer = writer
        .lock()
        .map_err(|_| "terminal writer lock poisoned".to_string())?;
    writer.write_all(&data).map_err(|error| error.to_string())?;
    writer.flush().map_err(|error| error.to_string())
}

#[tauri::command]
fn resize_session(
    state: State<'_, TerminalState>,
    id: String,
    cols: u16,
    rows: u16,
) -> Result<(), String> {
    let sessions_guard = state
        .sessions
        .lock()
        .map_err(|_| "terminal state lock poisoned".to_string())?;

    if let Some(session) = sessions_guard.get(&id) {
        session
            .master
            .resize(PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(|error| error.to_string())?;
    }

    Ok(())
}

#[tauri::command]
fn close_session(state: State<'_, TerminalState>, id: String) -> Result<(), String> {
    let session = state
        .sessions
        .lock()
        .map_err(|_| "terminal state lock poisoned".to_string())?
        .remove(&id);

    if let Some(session) = session {
        if let Ok(mut child) = session.child.lock() {
            let _ = child.kill();
        }
    }

    Ok(())
}

fn close_all_sessions(state: State<'_, TerminalState>) {
    let sessions = state.sessions.lock().ok().map(|mut sessions| {
        sessions
            .drain()
            .map(|(_, session)| session)
            .collect::<Vec<_>>()
    });

    if let Some(sessions) = sessions {
        for session in sessions {
            if let Ok(mut child) = session.child.lock() {
                let _ = child.kill();
            }
        }
    }
}

pub fn run() {
    tauri::Builder::default()
        .manage(TerminalState::default())
        .invoke_handler(tauri::generate_handler![
            get_app_config,
            update_terminal_font_size,
            get_character_definitions,
            stage_dropped_file,
            create_session,
            write_to_session,
            resize_session,
            close_session
        ])
        .on_window_event(|window, event| {
            if matches!(event, tauri::WindowEvent::CloseRequested { .. }) {
                if let Some(state) = window.try_state::<TerminalState>() {
                    close_all_sessions(state);
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}

fn default_shell_command() -> CommandBuilder {
    if cfg!(windows) {
        CommandBuilder::new(env::var("SHELL").unwrap_or_else(|_| "powershell.exe".to_string()))
    } else {
        CommandBuilder::new_default_prog()
    }
}

fn apply_utf8_locale_defaults(command: &mut CommandBuilder) {
    if locale_needs_utf8_default("LANG") {
        command.env("LANG", "en_US.UTF-8");
    }

    if locale_needs_utf8_default("LC_CTYPE") {
        command.env("LC_CTYPE", "UTF-8");
    }

    if locale_needs_utf8_override("LC_ALL") {
        command.env("LC_ALL", "en_US.UTF-8");
    }
}

fn locale_needs_utf8_default(name: &str) -> bool {
    match env::var(name) {
        Ok(value) => is_basic_c_locale(&value),
        Err(_) => true,
    }
}

fn locale_needs_utf8_override(name: &str) -> bool {
    match env::var(name) {
        Ok(value) => is_basic_c_locale(&value),
        Err(_) => false,
    }
}

fn is_basic_c_locale(value: &str) -> bool {
    let normalized = value.trim();
    normalized.is_empty()
        || normalized.eq_ignore_ascii_case("C")
        || normalized.eq_ignore_ascii_case("POSIX")
}

fn sanitize_file_name(file_name: &str) -> String {
    let file_path = PathBuf::from(file_name);
    let base_name = file_path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("dropped-file");
    let sanitized = base_name
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || matches!(character, '.' | '-' | '_') {
                character
            } else {
                '_'
            }
        })
        .collect::<String>()
        .trim_matches('.')
        .to_string();

    if sanitized.is_empty() {
        "dropped-file".to_string()
    } else {
        sanitized
    }
}

fn app_config_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|error| error.to_string())?;
    fs::create_dir_all(&config_dir).map_err(|error| error.to_string())?;
    Ok(config_dir)
}

fn app_config_path(app: &AppHandle) -> Result<PathBuf, String> {
    let config_dir = app_config_dir(app)?;
    Ok(config_dir.join("config.json"))
}

fn existing_image_path(path: PathBuf) -> Option<String> {
    if path.is_file() {
        Some(path.to_string_lossy().into_owned())
    } else {
        None
    }
}

fn ensure_default_character_definition(
    character_dir: &PathBuf,
    character: &BuiltInCharacter,
) -> Result<(), String> {
    let definition_path = character_dir.join("character.json");

    if definition_path.exists() {
        return Ok(());
    }

    let definition = CharacterDefinitionFile {
        id: Some(character.id.to_string()),
        name: Some(character.name.to_string()),
        primary: Some(character.primary.to_string()),
        terminal_background: Some(character.terminal_background.to_string()),
    };
    let definition_text =
        serde_json::to_string_pretty(&definition).map_err(|error| error.to_string())?;
    fs::write(definition_path, format!("{definition_text}\n")).map_err(|error| error.to_string())
}

fn ensure_load_failed_character_definition(
    characters_dir: &PathBuf,
) -> Result<CharacterDefinitionFile, String> {
    let character_dir = characters_dir.join(LOAD_FAILED_CHARACTER_DIR);
    fs::create_dir_all(&character_dir).map_err(|error| error.to_string())?;

    let definition_path = character_dir.join("character.json");
    if !definition_path.exists() {
        let definition = CharacterDefinitionFile {
            id: Some(LOAD_FAILED_CHARACTER_ID.to_string()),
            name: Some(LOAD_FAILED_CHARACTER_NAME.to_string()),
            primary: Some(LOAD_FAILED_CHARACTER_PRIMARY.to_string()),
            terminal_background: Some(LOAD_FAILED_CHARACTER_BACKGROUND.to_string()),
        };
        write_character_definition_file(&definition_path, &definition)?;
    } else if let Some(definition) = read_character_definition_file(&definition_path) {
        if is_legacy_load_failed_definition(&definition) {
            let definition = CharacterDefinitionFile {
                id: Some(LOAD_FAILED_CHARACTER_ID.to_string()),
                name: Some(LOAD_FAILED_CHARACTER_NAME.to_string()),
                primary: Some(LOAD_FAILED_CHARACTER_PRIMARY.to_string()),
                terminal_background: Some(LOAD_FAILED_CHARACTER_BACKGROUND.to_string()),
            };
            write_character_definition_file(&definition_path, &definition)?;
        }
    }

    Ok(
        read_character_definition_file(&definition_path).unwrap_or(CharacterDefinitionFile {
            id: Some(LOAD_FAILED_CHARACTER_ID.to_string()),
            name: Some(LOAD_FAILED_CHARACTER_NAME.to_string()),
            primary: Some(LOAD_FAILED_CHARACTER_PRIMARY.to_string()),
            terminal_background: Some(LOAD_FAILED_CHARACTER_BACKGROUND.to_string()),
        }),
    )
}

fn write_character_definition_file(
    path: &PathBuf,
    definition: &CharacterDefinitionFile,
) -> Result<(), String> {
    let definition_text =
        serde_json::to_string_pretty(definition).map_err(|error| error.to_string())?;
    fs::write(path, format!("{definition_text}\n")).map_err(|error| error.to_string())
}

fn is_legacy_load_failed_definition(definition: &CharacterDefinitionFile) -> bool {
    definition.id.as_deref() == Some("load-failed")
        && definition.name.as_deref() == Some("Load Failed")
        && definition.primary.as_deref() == Some("#FF6B6B")
        && definition.terminal_background.as_deref() == Some("#281316")
}

fn create_load_failed_character_definition(
    folder_id: &str,
    index: usize,
    load_failed_definition: &CharacterDefinitionFile,
) -> CharacterDefinition {
    let fallback_id = clean_optional_string(&load_failed_definition.id)
        .filter(|id| is_valid_character_id(id))
        .unwrap_or_else(|| LOAD_FAILED_CHARACTER_ID.to_string());
    let suffix = alphabetic_suffix(index);
    let id = format!("{fallback_id}-{}", suffix.to_ascii_lowercase());
    let name = clean_optional_string(&load_failed_definition.name)
        .unwrap_or_else(|| LOAD_FAILED_CHARACTER_NAME.to_string());

    CharacterDefinition {
        id,
        name: Some(format!("{name} {suffix}")),
        primary: clean_hex_color(&load_failed_definition.primary)
            .or_else(|| Some(LOAD_FAILED_CHARACTER_PRIMARY.to_string())),
        terminal_background: clean_hex_color(&load_failed_definition.terminal_background)
            .or_else(|| Some(LOAD_FAILED_CHARACTER_BACKGROUND.to_string())),
        load_error: Some(format!("Failed to load character folder: {folder_id}")),
        icon_path: None,
        idle_path: None,
        needs_you_path: None,
    }
}

fn alphabetic_suffix(index: usize) -> String {
    let mut index = index.max(1);
    let mut suffix = String::new();

    while index > 0 {
        index -= 1;
        let character = (b'A' + (index % 26) as u8) as char;
        suffix.insert(0, character);
        index /= 26;
    }

    suffix
}

fn read_character_definition(
    character_dir: &PathBuf,
    fallback_id: &str,
    icon_file: &str,
    idle_file: &str,
    needs_you_file: &str,
    allow_metadata_id: bool,
) -> Option<CharacterDefinition> {
    let metadata = read_character_definition_file(&character_dir.join("character.json"));

    if allow_metadata_id && metadata.is_none() {
        return None;
    }

    let metadata_id = if allow_metadata_id {
        metadata
            .as_ref()
            .and_then(|metadata| metadata.id.as_deref())
            .filter(|id| is_valid_character_id(id))
    } else {
        None
    };
    let id = metadata_id
        .or_else(|| is_valid_character_id(fallback_id).then_some(fallback_id))?
        .to_string();

    Some(CharacterDefinition {
        id,
        name: metadata
            .as_ref()
            .and_then(|metadata| clean_optional_string(&metadata.name)),
        primary: metadata
            .as_ref()
            .and_then(|metadata| clean_hex_color(&metadata.primary)),
        terminal_background: metadata
            .as_ref()
            .and_then(|metadata| clean_hex_color(&metadata.terminal_background)),
        load_error: None,
        icon_path: existing_image_path(character_dir.join(icon_file)),
        idle_path: existing_image_path(character_dir.join(idle_file)),
        needs_you_path: existing_image_path(character_dir.join(needs_you_file)),
    })
}

fn read_character_definition_file(path: &PathBuf) -> Option<CharacterDefinitionFile> {
    let text = fs::read_to_string(path).ok()?;
    serde_json::from_str(&text).ok()
}

fn clean_optional_string(value: &Option<String>) -> Option<String> {
    let value = value.as_ref()?.trim();

    if value.is_empty() {
        None
    } else {
        Some(value.to_string())
    }
}

fn clean_hex_color(value: &Option<String>) -> Option<String> {
    let value = value.as_ref()?.trim();

    if is_hex_color(value) {
        Some(value.to_string())
    } else {
        None
    }
}

fn is_hex_color(value: &str) -> bool {
    value.len() == 7
        && value.starts_with('#')
        && value
            .chars()
            .skip(1)
            .all(|character| character.is_ascii_hexdigit())
}

fn is_valid_character_id(id: &str) -> bool {
    !id.is_empty()
        && id.len() <= 32
        && id.chars().all(|character| {
            character.is_ascii_lowercase()
                || character.is_ascii_digit()
                || character == '-'
                || character == '_'
        })
}

fn write_default_app_config(config_path: &PathBuf, config: &AppConfig) -> Result<(), String> {
    let config_text = serde_json::to_string_pretty(config).map_err(|error| error.to_string())?;
    fs::write(config_path, format!("{config_text}\n")).map_err(|error| error.to_string())
}

fn read_app_config(app: &AppHandle) -> Result<AppConfig, String> {
    let config_path = app_config_path(app)?;

    if !config_path.exists() {
        let config = AppConfig::default();
        write_default_app_config(&config_path, &config)?;
        return Ok(config);
    }

    let config_text = fs::read_to_string(&config_path).map_err(|error| error.to_string())?;
    serde_json::from_str(&config_text).map_err(|error| {
        format!(
            "failed to parse config at {}: {}",
            config_path.display(),
            error
        )
    })
}
