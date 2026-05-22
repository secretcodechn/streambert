# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Streambert is a privacy-focused Electron desktop app for streaming and downloading Movies, TV Series, and Anime. It uses React for the frontend with no external state management or routing libraries.

## Commands

```bash
# Install dependencies
npm ci

# Development (Vite watch mode for renderer)
npm run dev

# Build and launch Electron app
npm run start

# Build distributable packages
npm run dist          # All platforms
npm run dist:mac      # macOS DMG (x64 + arm64)
npm run dist:win      # Windows NSIS installer
npm run dist:linux    # Linux .deb, AppImage, pacman
```

There are no tests, linter, or formatter configured.

## Architecture

### Two-Process Model

**Main process** (`index.js`, CommonJS):
- Creates BrowserWindow, manages app lifecycle, registers IPC handlers
- Configures Electron sessions for ad/tracker blocking and header stripping
- All IPC modules in `src/ipc/` export a `register()` function called from `index.js`

**Renderer process** (`src/`, ES modules):
- React SPA with lazy-loaded pages, communicates with main process exclusively through `window.electron` API exposed via `preload.js`
- No `nodeIntegration`; all Node/Electron APIs go through context bridge

### Key Directories

- `src/pages/` — Page components (HomePage, MoviePage, TVPage, LibraryPage, SettingsPage, DownloadsPage)
- `src/components/` — Reusable UI (Sidebar, SearchModal, MediaCard, ErrorBoundary, Icons)
- `src/utils/` — Shared utilities and hooks (api.js, storage.js, backup.js)
- `src/ipc/` — Main process IPC handlers (storage, downloads, subtitles, allmanga, player, blockStats)
- `src/styles/global.css` — Single CSS file with custom properties

### Navigation

No router library. Page navigation uses a manual stack via `useState` in App.jsx (`page` + `navStack` for back-navigation). Pages are lazy-loaded with `React.lazy()`.

### State Management

All global state lives in App.jsx as `useState` hooks and is passed down via props. No Redux/Zustand/Context. Use functional updates (`setState(prev => ...)`) to avoid stale closures.

### Data Storage

- **localStorage** — User preferences, watch history, watchlist, progress. Keys prefixed with `streambert_`, centralized in `STORAGE_KEYS` constant (`src/utils/storage.js`)
- **OS-encrypted secure storage** — API keys (TMDB, SubDL, Wyzie) via Electron's `safeStorage` (macOS Keychain, Windows DPAPI, Linux libsecret)
- **JSON files** in `userData` — Download queue state (`downloads.json`), backup settings

### External Services

- **TMDB** — Primary metadata source, requires user-provided API key. Client in `src/utils/api.js` with 5-min in-memory cache and 4-concurrent-request queue
- **AniList** — Anime-specific metadata via GraphQL, 7-day localStorage cache
- **SubDL/Wyzie** — Subtitle APIs
- **Streaming sources** — Defined in `PLAYER_SOURCES` array in `api.js` (Videasy, VidSrc, 2Embed, AllManga for anime)

### Session Partitioning

Three Electron sessions with independent caches and request interception:
- `default` — Main browsing
- `persist:player` — Video streaming (m3u8 interception, ad blocking)
- `persist:trailer` — Trailers (ad blocking only)

## Conventions

### Module System

- Main process (`index.js`, `preload.js`, `src/ipc/`): CommonJS with `require()`/`module.exports`
- Renderer (`src/`): ES modules with `import`/`export`

### Naming

- Components: PascalCase `.jsx`, default exports (`export default function ComponentName`)
- Pages: PascalCase with `Page` suffix
- Utilities/hooks: camelCase `.js`, named exports. Hooks live in `src/utils/` (not a separate `hooks/` dir)
- Constants: UPPER_SNAKE_CASE (`STORAGE_KEYS`, `BLOCKED_HOSTS`, `PLAYER_SOURCES`)
- Private module state: underscore prefix (`_tmdbCache`, `_getMainWindow`)
- IPC channels: kebab-case strings (`"secure-store-get"`, `"check-downloader"`)

### CSS

- Single `global.css` with CSS custom properties on `:root`
- kebab-case class names, BEM-like `--` modifiers (`.card--unreleased`)
- Inline `style={{}}` for one-off component styling

### Error Handling

- IPC handlers return `{ ok: true, ...data }` or `{ ok: false, error: e.message }`
- Silent `catch {}` for non-critical ops (localStorage, file I/O)
- `AbortController` with manual timeout for fetch (not `AbortSignal.timeout()`)
- `mounted`/`cancelled` flags in async effects to prevent state updates after unmount

### Code Style

- Double quotes, semicolons, 2-space indentation, trailing commas in multi-line constructs
- `useCallback`/`useMemo` used extensively; `React.memo` on frequently-rendered components like MediaCard
