# Configuration

Poke reads editable runtime settings from the app config directory.

On macOS, the directory is:

```sh
~/Library/Application Support/com.poke.terminal/
```

The app creates default files in this directory when it starts. The data bundled inside the app is treated as a fallback.

Restart Poke after manually editing configuration files.

## App Settings

The main app settings file is:

```sh
~/Library/Application Support/com.poke.terminal/config.json
```

Current schema:

```json
{
  "terminal": {
    "fontSize": 18
  }
}
```

`terminal.fontSize` controls the terminal font size in pixels.

Valid range:

- minimum: `10`
- maximum: `32`

While Poke is running, `Command + +` and `Command + -` also change this value and save it back to `config.json`.

## Characters

Character settings live under:

```sh
~/Library/Application Support/com.poke.terminal/characters/
```

Each character uses one folder:

```text
characters/
  kiri/
    character.json
    icon_32x32.png
    idle_32x32_6f.png
    needs_you_32x32_8f.png
```

### character.json

`character.json` can define the character identity and colors:

```json
{
  "id": "kiri",
  "name": "Kiri",
  "primary": "#b36df2",
  "terminalBackground": "#201326"
}
```

Fields:

- `id`: stable character id. For built-in characters, the folder name is used even if this is omitted.
- `name`: display name shown on the tab and character picker.
- `primary`: main character accent color.
- `terminalBackground`: terminal and active tab background color.

Color values must be hex colors such as `#201326`.

For built-in character folders, fields can be omitted. Missing values fall back to the built-in defaults.

For newly added character folders, `character.json` is required.

### Images

Poke looks for these image files in each character folder:

```text
icon_32x32.png
idle_32x32_6f.png
needs_you_32x32_8f.png
```

Expected format:

- PNG
- 32 x 32 px sprite source
- `idle_32x32_6f.png`: 6 animation frames
- `needs_you_32x32_8f.png`: 8 animation frames

For built-in characters, image files are optional. If an image is missing, Poke uses the bundled fallback image for that character.

For newly added characters, missing images fall back to the built-in fallback character images.

## Adding A Character

Create a new folder under `characters/`:

```text
characters/
  tomo/
    character.json
    icon_32x32.png
    idle_32x32_6f.png
    needs_you_32x32_8f.png
```

Example `character.json`:

```json
{
  "id": "tomo",
  "name": "Tomo",
  "primary": "#8fd7ff",
  "terminalBackground": "#14222a"
}
```

Restart Poke. The new character becomes available for new tabs and in the character picker.

Poke currently limits the number of open tabs to the number of loaded characters.

## Load-Failure Character

Poke creates a special fallback setting:

```text
characters/
  _load_failed/
    character.json
```

This setting is used when an external character folder cannot be loaded as a normal character. The default failed-load character is `Void`.

If multiple folders fail to load, Poke creates separate runtime entries such as `Void A` and `Void B` so each failed folder remains visible.

You can edit `_load_failed/character.json` to change the fallback name and colors.

## Notes

- Do not edit files inside the installed app bundle for customization.
- Edit files under `~/Library/Application Support/com.poke.terminal/`.
- Manual file edits require an app restart.
- Runtime font size changes through keyboard shortcuts are saved automatically.
