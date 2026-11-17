#!/usr/bin/env bash
set -euo pipefail
PANEL_DIR="${1:-/var/www/pterodactyl}"
WRAPPER="$PANEL_DIR/resources/views/templates/wrapper.blade.php"
[[ $EUID -eq 0 ]] || { echo "Run with sudo/root."; exit 1; }
BACKUP="$(ls -1t "$WRAPPER".lynxiee-backup-* 2>/dev/null | head -n1 || true)"
[[ -n "$BACKUP" && -f "$BACKUP" ]] || { echo "No LYNXIEE backup found."; exit 1; }
cp -a "$BACKUP" "$WRAPPER";rm -rf "$PANEL_DIR/public/lynxiee"
echo "Restored $BACKUP. Run: cd $PANEL_DIR && php artisan view:clear"
