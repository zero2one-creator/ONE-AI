# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ONEAI is an Electron-based desktop application that aggregates multiple AI chat interfaces into a single workspace. It allows users to interact with various AI services (ChatGPT, Claude, Gemini, DeepSeek, etc.) simultaneously through a split-screen interface with tab management.

## Development Commands

### Setup
```bash
yarn install
```

### Development
```bash
yarn dev  # Starts Vite dev server with hot reload
```

### Build
```bash
yarn build       # Builds for current platform
yarn build:mac   # Builds macOS version (DMG + ZIP for x64/arm64)
yarn build:win   # Builds Windows version (NSIS installer for x64/ia32/arm64)
yarn build:all   # Builds both macOS and Windows
```

Output is generated in the `release/` directory. The build produces a macOS application with the icon at `public/one.icns`.

### Clean Cache
```bash
yarn cdev       # Clean development environment cache
yarn crelease   # Clean release environment cache
```

### Icon Generation
```bash
yarn generate-icons  # Generates app icons from public/one.png
```

### Preview
```bash
yarn preview  # Preview production build
```

**Note**: This project does not have lint or typecheck scripts configured. If you need to add code quality checks, consider adding them to the package.json scripts.

## Architecture

### Tech Stack
- **Frontend**: Vue 3 (Composition API with `<script setup>`)
- **State Management**: Pinia
- **Build Tools**: Vite 5
- **Desktop Framework**: Electron 30
- **UI Library**: Naive UI
- **Styling**: Sass/SCSS + UnoCSS with scoped styles
- **TypeScript**: Used throughout the codebase
- **Package Manager**: Yarn

### Directory Structure
```
electron/          # Electron main and preload processes
  main.ts          # Main process entry point (window creation, lifecycle)
  preload.ts       # Preload script for IPC communication
src/
  pages/Main/      # Main application page and components
    components/    # Core UI components (AppView, SearchBar, SearchInput, SplitLayout)
    index.vue      # Main layout composition
  store/
    appStore.ts    # Pinia store for application state
  const/
    defaultConfig.ts  # AI app list, search configs, default layout
  App.vue          # Root Vue component
  main.ts          # Vue app entry point
```

### Key Architecture Concepts

#### 1. Split-Screen Layout System
The app uses a flat horizontal split pane system managed by Pinia store:
- **SplitPane**: Tree structure that can be either "single" (displays one tab) or "split" (contains children)
- The current implementation uses a **one-dimensional horizontal layout** where all panels are siblings in a flat array
- Direction is always "horizontal" at the root level (`src/store/appStore.ts:15-37`)
- State is maintained in `appStore.splitLayout` and persisted to localStorage
- Panels can be dragged to reorder via the header (`AppView.vue` drag handlers)

#### 2. Tab Management
- Each tab represents an AI app instance with its own webview
- Tabs are stored in `appStore.tabs` array with structure: `{ id, app, title }`
- Active tab is tracked via `appStore.activeTabId`
- Tab lifecycle methods: `addTab`, `removeTab`, `switchTab` (`src/store/appStore.ts:110-180`)
- When adding a tab for an already-open app, the existing tab is activated instead of creating a duplicate
- Tabs and layout state are persisted to localStorage via `persistState()` method

#### 3. Webview Integration
- Each AI app is loaded in an Electron webview with `webviewTag: true` (`electron/main.ts:64`)
- Uses persistent partition `persist:webview` to maintain login sessions across restarts
- Security settings: `nodeintegration=false`, `contextIsolation=yes`, `enableRemoteModule=no`
- The preload script (`electron/preload.ts`) exposes IPC methods to the renderer
- Search functionality injects text into AI app input fields using DOM manipulation

#### 4. AI App Configuration
- AI apps are configured in `src/const/defaultConfig.ts`
- Each app has: `id`, `name`, `url`, and optional `bodered` flag for styling
- App logos are managed separately in `logoMap` and combined via `appMap` for easier access
- Search configurations per app are stored in `APP_SEARCH_CONFIGS` (`src/const/defaultConfig.ts:166-260`)
- Supports different input selectors and submit methods (click vs enter) for each AI service

#### 5. Global Search Feature
The SearchBar component can broadcast a search query to all open AI apps simultaneously:
- Uses custom DOM events (`search-pane`) for communication (`src/store/appStore.ts:455-459`)
- Each `AppView` listens for search events and injects text into its webview
- Search configs handle different AI platforms' DOM structures with flexible selectors
- Configuration includes:
  - `inputSelector`: CSS selector(s) to find the input field (comma-separated for fallback)
  - `submitSelector`: CSS selector for submit button (only needed for `click` method)
  - `submitMethod`: Either "enter" (preferred) or "click" to submit the query

#### 6. State Persistence
- Tabs and split layout are automatically persisted to localStorage
- Uses utility functions from `src/utils/localStorage.ts`
- Persistence happens immediately after state changes (not just on app close)
- Storage keys: `oneai_tabs`, `oneai_split_layout`
- On startup, state is restored from localStorage with fallback to defaults

### Vite Configuration
- Alias: `@` → `src/` (`vite.config.ts:38-40`)
- Electron plugin handles main and preload script bundling (`vite.config.ts:17-35`)
- Main process output: `dist-electron/main.js`
- Renderer output: `dist/`
- Dev server runs on port 5177 (fixed for stable localStorage origin)
- Webview tag registered as custom element for Vue compiler

### Electron Build Configuration
- App ID: `com.example.ONEAI`
- Product Name: `ONEAI`
- Output directory: `release/`
- macOS: DMG + ZIP for x64 and arm64
- Windows: NSIS installer for x64, ia32, and arm64
- macOS icon: `public/one.icns`
- Windows icon: `public/one.ico`

## Common Patterns

### Adding a New AI App
1. Add logo asset to `src/assets/apps/` (PNG/WebP recommended)
2. Import logo in `src/const/defaultConfig.ts` with `?url` suffix
3. Add entry to `logoMap` object
4. Add app configuration to `AIAppList` array with `id`, `name`, `url`, optional `bodered`
5. Optionally add search config to `APP_SEARCH_CONFIGS` if the app has unique input/submit selectors

### Working with Pinia Store
- Use `useAppStore()` in components to access state
- Getters: `getTabs`, `getActiveTab`, `getActiveTabId`, `getSplitLayout`
- Common actions: Tab management, split pane management, search functionality
- All state mutations that should persist call `persistState()` internally

### Component Communication
- Parent-child: Props and emits (standard Vue pattern)
- Global state: Pinia store
- Cross-webview: Custom DOM events (`window.dispatchEvent`/`addEventListener`)
- Search events: `search-pane` event with `{ paneId, searchText, config }` detail
- Refresh events: `refresh-pane` event with `{ paneId }` detail

### Styling
- All components use scoped SCSS
- Color scheme: Light theme with `#f5f5f5` background, `#ffffff` panels, `#e0e0e0` borders
- Flexbox-based layouts with explicit overflow handling
- UnoCSS utilities available for rapid styling
