use portable_pty::{native_pty_system, Child, CommandBuilder, MasterPty, PtySize};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    env, fs,
    io::{Read, Write},
    path::PathBuf,
    sync::{Arc, Mutex},
    thread,
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
    data: String,
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

const MIN_TERMINAL_FONT_SIZE: u16 = 10;
const MAX_TERMINAL_FONT_SIZE: u16 = 32;

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

    let shell = default_shell();
    let command = CommandBuilder::new(shell);
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
                    let data = String::from_utf8_lossy(&buffer[..bytes_read]).to_string();
                    let _ = reader_app.emit(
                        "session_output",
                        SessionOutput {
                            id: reader_id.clone(),
                            data,
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
    data: String,
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
    writer
        .write_all(data.as_bytes())
        .map_err(|error| error.to_string())?;
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

fn default_shell() -> String {
    env::var("SHELL").unwrap_or_else(|_| {
        if cfg!(windows) {
            "powershell.exe".to_string()
        } else {
            "/bin/sh".to_string()
        }
    })
}

fn app_config_path(app: &AppHandle) -> Result<PathBuf, String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|error| error.to_string())?;
    fs::create_dir_all(&config_dir).map_err(|error| error.to_string())?;
    Ok(config_dir.join("config.json"))
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
