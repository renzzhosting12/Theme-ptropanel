# LYNXIEE CPANEL V3 — Pterodactyl 1.15.2

Dark purple / anime-inspired visual overlay and optional public global chat.

## Compatibility
Targets Pterodactyl Panel 1.15.2. Pterodactyl 1.x does not use the newer built-in theme-folder workflow. This package adds CSS and a small chat launcher to the existing Blade wrapper. It does not replace Laravel routes, React server controls, API handlers, Wings, or existing panel features.

The dashboard keeps the existing Pterodactyl layout and functions. The generated dashboard image is a visual concept, not a claim that every mockup widget is implemented.

## Install theme
Back up your VPS first. Upload/extract this folder on the panel VPS, then:

```bash
sudo bash scripts/install-theme.sh /var/www/pterodactyl
cd /var/www/pterodactyl
php artisan view:clear
```

Hard-refresh the browser. Installer makes a timestamped backup of `wrapper.blade.php` and refuses duplicate injection.

## Global chat service
Run `chat-service` on a separate Node.js 20+ host/container:

```bash
cd chat-service
cp .env.example .env
npm install
```

Edit `.env`; set `ALLOWED_ORIGIN` to your exact panel origin, e.g. `https://panel.example.com`. Then run `npm start`.

The chat client defaults to same-origin. If chat runs on another HTTPS hostname, edit `theme/lynxiee-chat.js` and set `window.LYNXIEE_CHAT_URL = 'https://chat.example.com';` before running the theme installer.

**Security limitation:** this first version uses public nicknames, not verified Pterodactyl identities. Nicknames can be impersonated, messages are public, and history is memory-only (cleared when the service restarts). Do not share personal or private information. Production deployment needs Laravel-session/API authentication, persistent storage, moderation, and HTTPS/WSS reverse proxy.

## Roll back
```bash
sudo bash scripts/rollback-theme.sh /var/www/pterodactyl
cd /var/www/pterodactyl
php artisan view:clear
```

## GitHub
Upload this folder's contents to a new repository. Never commit `.env`, credentials, API keys, database dumps, or session files.

## Not included yet
Music player/chat, verified online-user list, custom analytics, and authenticated profile badges are not included in this first release.
