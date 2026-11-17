#!/usr/bin/env bash
set -euo pipefail
PANEL_DIR="${1:-/var/www/pterodactyl}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WRAPPER="$PANEL_DIR/resources/views/templates/wrapper.blade.php"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$WRAPPER.lynxiee-backup-$STAMP"
[[ $EUID -eq 0 ]] || { echo "Run with sudo/root."; exit 1; }
[[ -f "$WRAPPER" ]] || { echo "wrapper.blade.php not found: $WRAPPER"; exit 1; }
grep -q 'LYNXIEE CPANEL V3' "$WRAPPER" && { echo "Already installed; no changes made."; exit 0; }
cp -a "$WRAPPER" "$BACKUP"
mkdir -p "$PANEL_DIR/public/lynxiee"
install -m 0644 "$ROOT_DIR/theme/lynxiee.css" "$PANEL_DIR/public/lynxiee/lynxiee.css"
install -m 0644 "$ROOT_DIR/theme/lynxiee-chat.js" "$PANEL_DIR/public/lynxiee/lynxiee-chat.js"
python3 - "$WRAPPER" <<'PY'
from pathlib import Path
import sys
p=Path(sys.argv[1]);s=p.read_text()
marker='<!-- LYNXIEE CPANEL V3 -->'
inject='    <!-- LYNXIEE CPANEL V3 -->\\n    <link rel="stylesheet" href="/lynxiee/lynxiee.css">\\n    <script defer src="/lynxiee/lynxiee-chat.js"></script>\\n'
if marker in s: raise SystemExit('Already injected; refusing duplicate.')
pos=s.rfind('</body>')
if pos<0: raise SystemExit('No closing body tag found; inspect wrapper and restore backup.')
p.write_text(s[:pos]+inject+s[pos:])
PY
chown www-data:www-data "$WRAPPER" "$PANEL_DIR/public/lynxiee/"* 2>/dev/null || true
echo "Installed. Backup: $BACKUP"
echo "Run: cd $PANEL_DIR && php artisan view:clear"
