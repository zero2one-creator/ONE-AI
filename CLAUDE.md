# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ONEAI is an Electron-based desktop application that aggregates multiple AI chat interfaces into a single workspace. It allows users to interact with various AI services (ChatGPT, Claude, Gemini, DeepSeek, etc.) simultaneously through a split-screen interface with tab management.

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev  # Starts Vite dev server with hot reload
```

### Build
```bash
npm run build  # Builds both renderer and main process, then packages with electron-builder
```

Output is generated in the `release/` directory. The build produces a macOS application with the icon at `public/one.icns`.

### Icon Generation
```bash
npm run generate-icons  # Generates app icons from public/one.png
```

### Preview
```bash
npm run preview  # Preview production build
```

**Note**: This project does not have lint or typecheck scripts configured. If you need to add code quality checks, consider adding them to the package.json scripts.

## Architecture

### Tech Stack
- **Frontend**: Vue 3 (Composition API with `<script setup>`)
- **State Management**: Pinia
- **Build Tools**: Vite 5
- **Desktop Framework**: Electron 30
- **Styling**: Sass/SCSS with scoped styles
- **TypeScript**: Used throughout the codebase

### Directory Structure
```
electron/          # Electron main and preload processes
  main.ts          # Main process entry point (window creation, lifecycle)
  preload.ts       # Preload script for IPC communication
src/
  pages/Main/      # Main application page and components
    components/    # Core UI components (SideBar, TabBar, SearchBar, etc.)
    index.vue      # Main layout composition
  store/
    appStore.ts    # Pinia store for application state
  App.vue          # Root Vue component
  main.ts          # Vue app entry point
```

### Key Architecture Concepts

#### 1. Split-Screen Layout System
The app uses a recursive split pane system managed by Pinia store:
- **SplitPane**: Tree structure that can be either "single" (displays one tab) or "split" (contains children)
- Direction can be "horizontal" or "vertical" for split panes
- State is maintained in `appStore.splitLayout` (src/store/appStore.ts:38-42)

#### 2. Tab Management
- Each tab represents an AI app instance with its own webview
- Tabs are stored in `appStore.tabs` array
- Active tab is tracked via `appStore.activeTabId`
- Tab lifecycle methods: `addTab`, `removeTab`, `removeOtherTabs`, `switchTab` (src/store/appStore.ts:84-161)

#### 3. Webview Integration
- Each AI app is loaded in an Electron webview with `webviewTag: true` (electron/main.ts:38)
- The preload script (electron/preload.ts) exposes IPC methods to the renderer
- Search functionality injects text into AI app input fields using DOM manipulation

#### 4. AI App Configuration
- 70+ AI apps are configured in `src/pages/Main/components/const.js`
- Each app has: id, name, url, logo, and optional styling
- Search configurations per app are stored in `appStore.appSearchConfigs` (src/store/appStore.ts:44-72)
- Supports different input selectors and submit methods (click vs enter) for each AI service

#### 5. Global Search Feature
The SearchBar component can broadcast a search query to all open AI apps simultaneously:
- Uses custom DOM events (`search-pane`) for communication (src/store/appStore.ts:482-487)
- Each AppView listens for search events and injects text into its webview
- Search configs handle different AI platforms' DOM structures (src/store/appStore.ts:428-433)

### Vite Configuration
- Alias: `@` → `src/` (vite.config.ts:32-34)
- Electron plugin handles main and preload script bundling (vite.config.ts:10-28)
- Main process output: `dist-electron/main.js`
- Renderer output: `dist/`

### Electron Build Configuration
- App ID: `com.example.ONEAI`
- Product Name: `ONEAI`
- Output directory: `release/`
- macOS icon: `public/one.icns`

## Common Patterns

### Adding a New AI App
1. Add logo asset to `src/assets/apps/` or relevant directory
2. Import logo in `src/pages/Main/components/const.js`
3. Add app configuration to `AIAppList` array with id, name, url, logo
4. Optionally add search config to `appSearchConfigs` Map in `src/store/appStore.ts` if the app has unique input/submit selectors

### Working with Pinia Store
- Use `useAppStore()` in components to access state
- Getters: `getTabs`, `getActiveTab`, `getActiveTabId`, `getSplitLayout`
- Common actions: Tab management, split pane management, search functionality

### Component Communication
- Parent-child: Props and emits (standard Vue pattern)
- Global state: Pinia store
- Cross-webview: Custom DOM events (window.dispatchEvent/addEventListener)

### Styling
- All components use scoped SCSS
- Color scheme: Light theme with `#f5f5f5` background, `#ffffff` panels, `#e0e0e0` borders
- Flexbox-based layouts with explicit overflow handling
