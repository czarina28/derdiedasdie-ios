# Local setup (Windows PowerShell)

From `C:\\Users\\maria\\derdiedasdie-ios`:

```powershell
cd C:\\Users\\maria\\derdiedasdie-ios
# If the folder is empty, clone the existing GitHub repository into it:
git clone https://github.com/czarina28/derdiedasdie-ios.git .
# Otherwise, if it is already a clone:
# git pull origin main
npm install
npm test
npm run dev
```

Open the localhost URL Vite prints (usually http://localhost:5173). Requires Node.js 20.19+ or 22.12+ for Vite 7.

This is a browser prototype with Capacitor dependencies in place, not an iOS build yet. The app identifier is provisional. Do not run an iOS build until app ID, signing, and Apple tooling are configured. Purchase functionality is **not** implemented yet.
