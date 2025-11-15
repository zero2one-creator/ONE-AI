# ONE AI 🤖

English | [简体中文](./README.md)

> An AI aggregation application that submits questions to multiple AI assistants at once for comparative answers.

**Why do you need ONE AI?**

It's too cumbersome to find the AI app you need among numerous browser tabs to chat with! ==> You need ONE AI application. One-click access with cmd+tab.

Not satisfied with one AI's answer? ==> Use ONE AI to submit to multiple AI assistants and compare responses with one click.

This application is simple to use and simple to implement, yet practical enough.

We provide a development guide at the end. If there's an app you like that we don't support, feel free to submit an issue or PR ☺️

We hope you enjoy it!

---

[![Electron](https://img.shields.io/badge/Electron-30.5.1-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/) [![Vue 3](https://img.shields.io/badge/Vue-3.4.21-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

## ✨ Features

- 🚀 **Multi-AI Aggregation** - Use 10+ mainstream AIs including DeepSeek, Yuanbao, Kimi, Doubao, Tongyi, ChatGPT, Gemini in one application
- 🔄 **One-Click Split Screen** - Support vertical split screen with freely draggable window size adjustment
- 🎯 **One-Click Search** - Enter your question in the search box and send it to all opened AI applications with one click
- 💾 **Session Persistence** - Use independent sessions to maintain login status for each AI application
- ⚡ **Quick Switching** - Click top icons to quickly open or switch between different AI applications
- 🧠 **Layout Memory** - Restore previous layout on restart for convenient use

## 📸 Preview

![Preview](./doc/images/record.gif)

## 🎯 Supported AI Applications

| AI Application                                   | Status | Website                           |
| ------------------------------------------------ | ------ | --------------------------------- |
| DeepSeek                                         | ✅     | https://chat.deepseek.com/        |
| Kimi (Moonshot)                                  | ✅     | https://kimi.moonshot.cn/         |
| Doubao                                           | ✅     | https://www.doubao.com/chat/      |
| Tongyi Qianwen                                   | ✅     | https://www.tongyi.com/           |
| Tencent Yuanbao                                  | ✅     | https://yuanbao.tencent.com/chat  |
| Zhipu AI                                         | ✅     | https://chatglm.cn/               |
| Baichuan AI                                      | ✅     | https://ying.baichuan-ai.com/chat |
| Stepfun                                          | ✅     | https://stepfun.com               |
| Hailuo AI                                        | ✅     | https://chat.minimaxi.com/        |
| Gemini                                           | ✅     | https://gemini.google.com/app     |
| Grok                                             | ✅     | https://grok.com                  |
| ChatGPT                                          | ✅     | https://chatgpt.com/              |
| LmArena (Free access to Claude, Gemini models)   | ✅     | https://lmarena.ai                |

## 🛠️ Tech Stack

- **Framework**: Electron + Vue 3 + TypeScript
- **UI Components**: Naive UI
- **State Management**: Pinia
- **Styling**: SCSS + UnoCSS
- **Build Tools**: Vite + electron-builder
- **Package Manager**: Yarn

## 📦 Download

> 💡 Please visit the [Releases page](https://github.com/zero2one-creator/one-ai/releases) to download the latest version

## 🔧 Development

### Requirements

- **Node.js**: >= 18.0.0
- **Yarn**: >= 1.22.0
- **OS**: macOS / Windows / Linux

### Quick Start

```bash
# Clone the project
git clone https://github.com/zero2one-creator/one-ai.git
cd one-ai

# Install dependencies
yarn

# Start development mode (will automatically open the app and DevTools)
yarn dev

# Build application
yarn build              # Build for current platform
yarn build:mac          # Build for macOS
yarn build:win          # Build for Windows
yarn build:all          # Build for both macOS and Windows

# Clean cache
yarn cdev               # Clean development cache
yarn crelease           # Clean release cache
```

### Project Structure

```
one-ai/
├── electron/                   # Electron main process
│   ├── main.ts                 # Main process entry (window management, menu, shortcuts)
│   └── preload.ts              # Preload script (IPC communication bridge)
│
├── src/                       # Vue renderer process
│   ├── assets/                # Static resources
│   │   ├── apps/              # AI application logos
│   │   ├── models/            # AI model logos
│   │   └── providers/         # AI service provider logos
│   │
│   ├── components/           # Common components
│   │   └── Icon/             # Icon components
│   │       ├── SearchIcon.vue
│   │       └── HorizontalSplitIcon.vue
│   │
│   ├── const/                # Constants configuration
│   │   └── defaultConfig.ts  # AI app list, search config, default layout
│   │
│   ├── pages/                # Page components
│   │   └── Main/             # Main page
│   │       ├── components/
│   │       │   ├── AppView.vue       # AI application view (webview container)
│   │       │   ├── SearchBar.vue     # Top search bar (app icon list)
│   │       │   ├── SearchInput.vue   # Search input (multi-line, expandable)
│   │       │   └── SplitLayout.vue   # Split layout (draggable)
│   │       └── index.vue             # Main page entry
│   │
│   ├── store/                # Pinia state management
│   │   └── appStore.ts       # App state (tab, layout, search management)
│   │
│   ├── utils/                # Utility functions
│   │   ├── index.ts          # Common utilities
│   │   └── localStorage.ts   # localStorage wrapper
│   │
│   ├── App.vue               # Root component
│   ├── main.ts               # Entry file
│   └── style.css             # Global styles
│
├── public/                   # Public resources
│   ├── one.icns              # macOS app icon
│   ├── one.ico               # Windows app icon
│   └── one.png               # App icon source
│
├── build/                     # Build-generated icons
├── dist/                      # Renderer process build output
├── dist-electron/             # Main process build output
├── release/                   # Package output directory
├── scripts/                   # Script tools
│   ├── clean-dev.mjs         # Clean dev cache
│   └── clean-release.mjs     # Clean release cache
│
├── doc/                      # Documentation
├── package.json              # Project configuration
├── vite.config.ts            # Vite configuration
├── electron-builder.json5    # Electron Builder configuration
└── tsconfig.json             # TypeScript configuration
```

### Adding New AI Applications

#### Step 1: Prepare Resources

1. Prepare application logo (PNG/WebP format recommended)
2. Place it in the `src/assets/apps/` directory

```bash
# Example
src/assets/apps/your-ai.png
```

#### Step 2: Register Application

Edit `src/const/defaultConfig.ts`:

```typescript
// 1. Import logo
import YourAILogo from "@/assets/apps/your-ai.png?url";

// 2. Add to logoMap
export const logoMap: Record<string, string> = {
  // ... other logos
  "your-ai": YourAILogo,
};

// 3. Add to AIAppList
export const AIAppList = [
  // ... other apps
  {
    id: "your-ai",              // Unique identifier (lowercase letters, numbers, hyphens)
    name: "Your AI",            // Display name
    url: "https://your-ai.com", // Application URL
    bodered: false,             // Optional: whether to show border
  },
];
```

#### Step 3: Configure Search (Optional)

To support one-click search, add to `APP_SEARCH_CONFIGS`:

```typescript
export const APP_SEARCH_CONFIGS = [
  // ... other configs
  [
    "your-ai",  // Corresponds to id in AIAppList
    {
      // Input selector, supports multiple selectors (comma-separated), tried sequentially
      inputSelector: "textarea, input[type='text'], div[contenteditable='true']",
      
      // Submit button selector (required only for click method)
      submitSelector: "button[type='submit'], button.send-button",
      
      // Submit method:
      // - "enter": Submit via Enter key (recommended, more stable)
      // - "click": Submit via button click
      submitMethod: "enter",
    },
  ],
] as const;
```

#### Step 4: Test Configuration

1. **Start development mode**
```bash
yarn dev
```

2. **Open and test the application**
   - Click the top icon to open your AI application
   - Enter a question in the search box
   - Click the search button
   - Check console logs to confirm search script execution

3. **Debug search configuration**

### Performance Optimization Tips

1. **Limit concurrent applications**
   - Each webview is equivalent to an independent browser process
   - Recommend opening no more than 4-5 applications simultaneously

2. **Regular cache cleaning**
   ```bash
   yarn cdev
   ```

3. **Close unused split screens**

4. **Use production build**
   ```bash
   yarn build
   ```

## 🐛 FAQ

### Q: macOS says "cannot open because the developer cannot be verified"?

**A:** Right-click the app → Select "Open" → Click "Open" in the dialog

Or execute in terminal:

```bash
xattr -cr /Applications/ONEAI.app
```

### Q: Windows Defender reports malware?

**A:** This is a false positive, a common issue with electron-builder packaged apps. You can add it to trusted apps or build from source.

### Q: AI application won't login or displays abnormally?

**A:**

1. Try refreshing the page (click the refresh button)
2. Check network connection
3. Some AIs may require logging in once in a browser first

### Q: Search function not working?

**A:**

1. Ensure the corresponding AI application is open
2. Some AI page structures may change, requiring selector configuration updates
3. Check console logs for specific errors

### Q: Application consuming too much memory?

**A:** This is a common issue with Electron applications - each webview is equivalent to an independent browser. Recommendations:

- Don't open too many AI applications simultaneously
- Close unused split screens
- Restart the application regularly

## 🔒 Security Notes

- The application uses independent sessions to store login information for each AI
- Some security restrictions are disabled in development mode to support cross-origin requests (only affects webview)
- Recommended to use only in trusted network environments
- Does not collect or upload any user data

---

**[⬆ Back to top](#one-ai-)**

