# ONE AI 🤖

[English](./README_EN.md) | 简体中文

> 一个 AI 聚合应用，提问一次，自动提交多个 AI 助手回答。

**为什么需要 ONE AI？**

在浏览器众多标签页中，找到你需要的 AI 应用跟他 chat ，这也太麻烦了！ ==> 你需要一个 AI 应用。cmd+tab 一键直达。

这个 AI 回答的不满意，怎么办？ ==> 用 ONE AI，一键提交多个 AI 助手对比回答。

这个应用使用很简单，实现也很简单，但足够实用。

我们在最后提供了开发指南，如果有你喜欢的应用我们没有支持，欢迎提 issue，或者 PR

希望大家喜欢☺️

---

[![Electron](https://img.shields.io/badge/Electron-30.5.1-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/) [![Vue 3](https://img.shields.io/badge/Vue-3.4.21-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

## ✨ 特性

- 🚀 **多 AI 聚合** - 在一个应用内同时使用 DeepSeek、Yuanbao、Kimi、豆包、通义, ChatGPT, Gemini 等 10+ 个主流 AI
- 🔄 **一键分屏** - 支持纵向分屏，可自由拖拽调整窗口大小
- 🎯 **一键搜索** - 在搜索框输入问题，一键发送到所有已打开的 AI 应用
- 💾 **会话持久化** - 使用独立 session，保持各 AI 应用的登录状态
- ⚡ **快速切换** - 点击顶部图标快速打开或切换不同的 AI 应用
- 🧠 **布局记忆** - 重启应用还原上次布局，使用更方便

## 📸 预览

![预览图](./doc/images/record.gif)

## 🎯 支持的 AI 应用

| AI 应用                                     | 支持状态 | 官网                              |
| ------------------------------------------ | -------- | --------------------------------- |
| DeepSeek                                   | ✅       | https://chat.deepseek.com/        |
| Kimi (月之暗面)                             | ✅       | https://kimi.moonshot.cn/         |
| 豆包                                       | ✅       | https://www.doubao.com/chat/      |
| 通义千问                                    | ✅       | https://www.tongyi.com/           |
| 腾讯元宝                                    | ✅       | https://yuanbao.tencent.com/chat  |
| 智谱清言                                    | ✅       | https://chatglm.cn/               |
| 百川智能                                    | ✅       | https://ying.baichuan-ai.com/chat |
| 阶跃星辰                                    | ✅       | https://stepfun.com               |
| 海螺 AI                                    | ✅       | https://chat.minimaxi.com/        |
| Gemini                                    | ✅       | https://gemini.google.com/app     |
| Grok                                      | ✅       | https://grok.com                  |
| ChatGPT                                   | ✅       | https://chatgpt.com/              |
| LmArena ( 可以免费使用 Claude, Gemini 等模型)| ✅       | https://lmarena.ai                |

## 🛠️ 技术栈

- **框架**: Electron + Vue 3 + TypeScript
- **UI 组件**: Naive UI
- **状态管理**: Pinia
- **样式**: SCSS + UnoCSS
- **构建工具**: Vite + electron-builder
- **包管理**: Yarn

## 📦 下载

> 💡 请前往 [Releases 页面](https://github.com/zero2one-creator/one-ai/releases) 下载最新版本

## 🔧 开发

### 环境要求

- **Node.js**: >= 18.0.0
- **Yarn**: >= 1.22.0
- **操作系统**: macOS / Windows / Linux

### 快速开始

```bash
# 克隆项目
git clone https://github.com/zero2one-creator/one-ai.git
cd one-ai

# 安装依赖
yarn

# 启动开发模式（会自动打开应用和 DevTools）
yarn dev

# 打包应用
yarn build              # 根据当前平台打包
yarn build:mac          # 打包 macOS 版本
yarn build:win          # 打包 Windows 版本
yarn build:all          # 同时打包 macOS 和 Windows

# 清理缓存
yarn cdev               # 清理开发环境缓存
yarn crelease           # 清理发布环境缓存
```

### 项目结构

```
one-ai/
├── electron/                   # Electron 主进程
│   ├── main.ts                 # 主进程入口（窗口管理、菜单、快捷键）
│   └── preload.ts              # 预加载脚本（IPC 通信桥接）
│
├── src/                       # Vue 渲染进程
│   ├── assets/                # 静态资源
│   │   ├── apps/              # AI 应用 logo
│   │   ├── models/            # AI 模型 logo
│   │   └── providers/         # AI 服务商 logo
│   │
│   ├── components/           # 公共组件
│   │   └── Icon/             # 图标组件
│   │       ├── SearchIcon.vue
│   │       └── HorizontalSplitIcon.vue
│   │
│   ├── const/                # 常量配置
│   │   └── defaultConfig.ts  # AI 应用列表、搜索配置、默认布局
│   │
│   ├── pages/                # 页面组件
│   │   └── Main/             # 主页面
│   │       ├── components/
│   │       │   ├── AppView.vue       # AI 应用视图（webview 容器）
│   │       │   ├── SearchBar.vue     # 顶部搜索栏（应用图标列表）
│   │       │   ├── SearchInput.vue   # 搜索输入框（支持多行、展开编辑）
│   │       │   └── SplitLayout.vue   # 分屏布局（支持拖拽调整）
│   │       └── index.vue             # 主页面入口
│   │
│   ├── store/                # Pinia 状态管理
│   │   └── appStore.ts       # 应用状态（标签管理、布局管理、搜索配置）
│   │
│   ├── utils/                # 工具函数
│   │   ├── index.ts          # 通用工具函数
│   │   └── localStorage.ts   # localStorage 封装
│   │
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件
│   └── style.css             # 全局样式
│
├── public/                   # 公共资源
│   ├── one.icns              # macOS 应用图标
│   ├── one.ico               # Windows 应用图标
│   └── one.png               # 应用图标源文件
│
├── build/                     # 构建生成的图标
├── dist/                      # 渲染进程构建输出
├── dist-electron/             # 主进程构建输出
├── release/                   # 打包输出目录
├── scripts/                   # 脚本工具
│   ├── clean-dev.mjs         # 清理开发缓存
│   └── clean-release.mjs     # 清理发布缓存
│
├── doc/                      # 文档
├── package.json              # 项目配置
├── vite.config.ts            # Vite 配置
├── electron-builder.json5    # Electron Builder 配置
└── tsconfig.json             # TypeScript 配置
```

### 添加新的 AI 应用

#### 步骤 1：准备应用资源

1. 准备应用 logo（推荐 PNG/WebP 格式）
2. 放入 `src/assets/apps/` 目录

```bash
# 示例
src/assets/apps/your-ai.png
```

#### 步骤 2：注册应用

编辑 `src/const/defaultConfig.ts`：

```typescript
// 1. 导入 logo
import YourAILogo from "@/assets/apps/your-ai.png?url";

// 2. 添加到 logoMap
export const logoMap: Record<string, string> = {
  // ... 其他 logo
  "your-ai": YourAILogo,
};

// 3. 添加到 AIAppList
export const AIAppList = [
  // ... 其他应用
  {
    id: "your-ai",              // 唯一标识（小写字母、数字、连字符）
    name: "Your AI",            // 显示名称
    url: "https://your-ai.com", // 应用 URL
    bodered: false,             // 可选：是否显示边框
  },
];
```

#### 步骤 3：配置搜索（可选）

如果要支持一键搜索功能，在 `APP_SEARCH_CONFIGS` 中添加：

```typescript
export const APP_SEARCH_CONFIGS = [
  // ... 其他配置
  [
    "your-ai",  // 对应 AIAppList 中的 id
    {
      // 输入框选择器，支持多个选择器（逗号分隔），会依次尝试
      inputSelector: "textarea, input[type='text'], div[contenteditable='true']",
      
      // 提交按钮选择器（仅 click 方式需要）
      submitSelector: "button[type='submit'], button.send-button",
      
      // 提交方式：
      // - "enter": 按回车键提交（推荐，更稳定）
      // - "click": 点击按钮提交
      submitMethod: "enter",
    },
  ],
] as const;
```

#### 步骤 4：测试配置

1. **启动开发模式**
```bash
yarn dev
```

2. **打开应用并测试**
   - 点击顶部图标打开你的 AI 应用
   - 在搜索框输入问题
   - 点击搜索按钮
   - 检查控制台日志确认搜索脚本执行

3. **调试搜索配置**


### 性能优化建议

1. **限制同时打开的应用数量**
   - 每个 webview 相当于一个独立浏览器进程
   - 建议同时打开不超过 4-5 个应用

2. **定期清理缓存**
   ```bash
   yarn cdev
   ```

3. **关闭不使用的分屏**

4. **使用生产模式打包**
   ```bash
   yarn build
   ```

## 🐛 常见问题

### Q: macOS 提示"无法打开，因为无法验证开发者"？

**A:** 右键点击应用 → 选择"打开" → 在弹出的对话框中点击"打开"

或在终端执行：

```bash
xattr -cr /Applications/ONEAI.app
```

### Q: Windows Defender 报毒？

**A:** 这是误报，electron-builder 打包的应用常见问题。可以添加信任或从源码构建。

### Q: AI 应用无法登录或显示异常？

**A:**

1. 尝试刷新页面（点击刷新按钮）
2. 检查网络连接
3. 某些 AI 可能需要在浏览器中先登录一次

### Q: 搜索功能不工作？

**A:**

1. 确保已打开对应的 AI 应用
2. 某些 AI 的页面结构可能变化，需要更新选择器配置
3. 查看控制台日志了解具体错误

### Q: 应用占用内存过大？

**A:** 这是 Electron 应用的通病，每个 webview 都相当于一个独立浏览器。建议：

- 不要同时打开过多 AI 应用
- 关闭不使用的分屏
- 定期重启应用

## 🔒 安全说明

- 应用使用独立的 session 存储各 AI 的登录信息
- 开发模式下禁用了部分安全限制以支持跨域请求（仅影响 webview）
- 建议只在信任的网络环境下使用
- 不会收集或上传任何用户数据

---

**[⬆ 回到顶部](#one-ai-)**
