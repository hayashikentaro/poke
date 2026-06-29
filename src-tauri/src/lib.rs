use portable_pty::{native_pty_system, Child, CommandBuilder, MasterPty, PtySize};
use serde::Serialize;
use std::{
    env,
    io::{Read, Write},
    sync::{Arc, Mutex},
    thread,
};
use tauri::{AppHandle, Emitter, Manager, State};

#[derive(Default)]
struct TerminalState {
    session: Mutex<Option<TerminalSession>>,
}

struct TerminalSession {
    writer: Arc<Mutex<Box<dyn Write + Send>>>,
    master: Box<dyn MasterPty + Send>,
    child: Arc<Mutex<Box<dyn Child + Send + Sync>>>,
}

#[derive(Clone, Serialize)]
struct SessionOutput {
    data: String,
}

#[derive(Clone, Serialize)]
struct SessionExit {
    code: Option<i32>,
}

#[tauri::command]
fn create_session(
    app: AppHandle,
    state: State<'_, TerminalState>,
    cols: u16,
    rows: u16,
) -> Result<(), String> {
    let mut session_guard = state
        .session
        .lock()
        .map_err(|_| "terminal state lock poisoned".to_string())?;

    if session_guard.is_some() {
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

    thread::spawn(move || {
        let mut buffer = [0_u8; 8192];

        loop {
            match reader.read(&mut buffer) {
                Ok(0) => break,
                Ok(bytes_read) => {
                    let data = String::from_utf8_lossy(&buffer[..bytes_read]).to_string();
                    let _ = reader_app.emit("session_output", SessionOutput { data });
                }
                Err(_) => break,
            }
        }

        let code = reader_child
            .lock()
            .ok()
            .and_then(|mut child| child.wait().ok())
            .map(|status| status.exit_code() as i32);
        let _ = reader_app.emit("session_exit", SessionExit { code });

        if let Some(state) = reader_app.try_state::<TerminalState>() {
            if let Ok(mut session_guard) = state.session.lock() {
                *session_guard = None;
            }
        }
    });

    *session_guard = Some(TerminalSession {
        writer: Arc::new(Mutex::new(writer)),
        master: pair.master,
        child,
    });

    Ok(())
}

#[tauri::command]
fn write_to_session(state: State<'_, TerminalState>, data: String) -> Result<(), String> {
    let writer = {
        let session_guard = state
            .session
            .lock()
            .map_err(|_| "terminal state lock poisoned".to_string())?;
        session_guard
            .as_ref()
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
fn resize_session(state: State<'_, TerminalState>, cols: u16, rows: u16) -> Result<(), String> {
    let session_guard = state
        .session
        .lock()
        .map_err(|_| "terminal state lock poisoned".to_string())?;

    if let Some(session) = session_guard.as_ref() {
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
fn close_session(state: State<'_, TerminalState>) -> Result<(), String> {
    let session = state
        .session
        .lock()
        .map_err(|_| "terminal state lock poisoned".to_string())?
        .take();

    if let Some(session) = session {
        if let Ok(mut child) = session.child.lock() {
            let _ = child.kill();
        }
    }

    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .manage(TerminalState::default())
        .invoke_handler(tauri::generate_handler![
            create_session,
            write_to_session,
            resize_session,
            close_session
        ])
        .on_window_event(|window, event| {
            if matches!(event, tauri::WindowEvent::CloseRequested { .. }) {
                if let Some(state) = window.try_state::<TerminalState>() {
                    let _ = close_session(state);
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
