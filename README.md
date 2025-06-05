# Wx App

A modern Discord app for weather lookups and scheduled weather reports.

---

## Features

- **/weather command**: Instantly look up the weather for any location, with optional units (C/F).
- **Scheduled weather reports**: Automatically post weather updates to specified Discord channels by editing `cron.json`.
- **Easy customization**: Add new commands or event handlers with simple file-based structure.

---

## Getting Started

### 1. Fork and Clone

Fork this repository to your own GitHub account, then clone it:

```sh
git clone https://github.com/<your-username>/wx.git
cd wx
```

### 2. Configure Environment

Copy the example environment file and edit it with your credentials:

```sh
cp .env.example .env
```

Edit `.env` and set your Discord app token, client ID, and API keys.

### 3. (Optional) Configure Scheduled Reports

To enable scheduled weather reports, copy the example cron file and edit as needed:

```sh
cp cron.json.example cron.json
```

Edit `cron.json` to specify the schedule, channel IDs, locations, units, and locales for your reports.

### 4. Install Dependencies

```sh
npm install
```

### 5. Run Tests (Optional)

```sh
npm test
```

### 6. Run the app

```sh
node wx.mjs
```

---

## Systemd Service Setup

To run Wx as a service on Linux, use the provided `wx.service` file.

1. Copy `wx.service` to your server and edit as needed:
   - Set `WorkingDirectory` and `ExecStart` to your app's location and main file (use absolute paths).
   - Set `EnvironmentFile` to your `.env` location.
   - Change `User` and `Group` to a non-root user for security.

2. Install and enable the service:

```sh
sudo cp wx.service /etc/systemd/system/wx.service
sudo systemctl daemon-reload
sudo systemctl enable wx.service
sudo systemctl start wx.service
sudo systemctl status wx.service
```

---

## Project Structure & Customization

- `src/commands/` — Add new slash commands here. Each command has a `.json` definition and a `.mjs` handler file.
- `src/events/` — Discord event handlers (e.g., `ready.mjs`, `messageCreate.mjs`). Add or customize event logic here.
- `src/locales/` — Locale JSON files for multi-language support.
- `src/custom/` — Weather logic, OpenAI helpers, and scheduling code.
- `cron.json` — Schedule automatic weather reports to Discord channels.
- `wx.mjs` — Main entry point.

To add a new command, create a `.json` definition and a `.mjs` handler in `src/commands/`. To customize event handling, edit or add files in `src/events/`.

---

## License

[MIT}(LICENSE)

---

## Support

Russell Purinton  
Email: <russell.purinton@gmail.com>  
Discord: laozi101
