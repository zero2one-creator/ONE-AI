/// <reference types="vite/client" />
import BaicuanAppLogo from "@/assets/apps/baixiaoying.webp?url";
import DoubaoAppLogo from "@/assets/apps/doubao.png?url";
import GeminiAppLogo from "@/assets/apps/gemini.png?url";
import GrokAppLogo from "@/assets/apps/grok.png?url";
import KimiAppLogo from "@/assets/apps/kimi.webp?url";
import LmArenaAppLogo from "@/assets/apps/lmarena.png?url";
import StepfunAppLogo from "@/assets/apps/stepfun.png?url";
import DeepSeekLogo from "@/assets/apps/deepseek.png?url";
import TencentYuanbaoLogo from "@/assets/apps/yuanbao.webp?url";
import OpenAiLogo from "@/assets/apps/openai.png?url";
import ZhipuLogo from "@/assets/apps/zhipu.png?url";
import HailuoLogo from "@/assets/apps/hailuo.png?url";
import QwenLogo from "@/assets/apps/qwen.png?url";

export const DEFAULT_SPLIT_LAYOUT = {
  id: "root",
  type: "split",
  direction: "horizontal",
  // 一维横向布局，所有 panel 都是同一层的 single 面板
  children: [
    {
      id: "pane-1",
      type: "single",
      tabId: "deepseek-1763100371335",
    },
    {
      id: "pane-2",
      type: "single",
      tabId: "tencent-yuanbao-1763100374334",
    },
    {
      id: "pane-3",
      type: "single",
      tabId: "moonshot-1763100396085",
    },
  ],
};

// logo 映射：应用 id -> logo 资源
export const logoMap: Record<string, string> = {
  deepseek: DeepSeekLogo,
  "tencent-yuanbao": TencentYuanbaoLogo,
  moonshot: KimiAppLogo,
  doubao: DoubaoAppLogo,
  dashscope: QwenLogo,
  minimax: HailuoLogo,
  zhipu: ZhipuLogo,
  baichuan: BaicuanAppLogo,
  stepfun: StepfunAppLogo,
  openai: OpenAiLogo,
  gemini: GeminiAppLogo,
  grok: GrokAppLogo,
  lmarena: LmArenaAppLogo,
};

// AI 应用列表（不直接带 logo，由 logoMap 管理）
export const AIAppList = [
  {
    id: "deepseek",
    name: "DeepSeek",
    url: "https://chat.deepseek.com/",
  },
  {
    id: "tencent-yuanbao",
    name: "Tencent Yuanbao",
    url: "https://yuanbao.tencent.com/chat",
    bodered: true,
  },

  {
    id: "moonshot",
    name: "Kimi",
    url: "https://kimi.moonshot.cn/",
  },
  {
    id: "doubao",
    name: "Doubao",
    url: "https://www.doubao.com/chat/",
  },
  {
    id: "dashscope",
    name: "Tongyi",
    url: "https://www.qianwen.com/chat",
  },
  {
    id: "minimax",
    name: "Minimax",
    url: "https://chat.minimaxi.com/",
    bodered: true,
  },

  {
    id: "zhipu",
    name: "Zhipu",
    url: "https://chatglm.cn/main/alltoolsdetail",
    bodered: true,
  },
  {
    id: "baichuan",
    name: "Baichuan",
    url: "https://ying.baichuan-ai.com/chat",
  },
  {
    id: "stepfun",
    name: "Stepfun",
    url: "https://stepfun.com",
    bodered: true,
  },
  {
    id: "openai",
    name: "ChatGPT",
    url: "https://chatgpt.com/",
    bodered: true,
  },
  {
    id: "gemini",
    name: "Gemini",
    url: "https://gemini.google.com/app",
  },
  {
    id: "grok",
    name: "Grok",
    url: "https://grok.com",
    bodered: true,
  },
  {
    id: "lmarena",
    name: "lmarena",
    url: "https://lmarena.ai",
    bodered: true,
  },
];

// 方便通过 id 直接拿到完整 app 配置（含 logo）
export const appMap: Record<string, any> = AIAppList.reduce(
  (map, app) => {
    map[app.id] = {
      ...app,
      logo: logoMap[app.id],
    };
    return map;
  },
  {} as Record<string, any>
);

// 默认打开的 tabs，只记录 tabId 和 appId，使用时通过 appMap 替换
export const DEFAULT_TABS = [
  {
    id: "deepseek-1763100371335",
    appId: "deepseek",
    title: "DeepSeek",
  },
  {
    id: "tencent-yuanbao-1763100374334",
    appId: "tencent-yuanbao",
    title: "Tencent Yuanbao",
  },
  {
    id: "moonshot-1763100396085",
    appId: "moonshot",
    title: "Kimi",
  },
];

// 应用搜索配置常量，供 appStore 使用
export const APP_SEARCH_CONFIGS = [
  // ChatGPT 配置（chatgpt.com）
  [
    "openai",
    {
      // ChatGPT 输入区通常是 contenteditable 的 div
      inputSelector: "div[contenteditable='true']",
      // 使用回车提交（Shift+Enter 换行），避免依赖不稳定的按钮 DOM
      submitMethod: "enter",
    },
  ],
  // Claude 配置
  [
    "claude",
    {
      inputSelector: 'div[contenteditable="true"], textarea',
      submitMethod: "enter",
    },
  ],
  // Kimi 配置
  [
    "moonshot",
    {
      inputSelector: '.chat-input-editor, div[role="textbox"]',
      submitMethod: "enter",
    },
  ],
  // 豆包配置
  [
    "doubao",
    {
      inputSelector:
        'textarea.semi-input-textarea, textarea[placeholder*="发消息"]',
      submitMethod: "enter", // 使用回车键提交
    },
  ],
  // 通义千问配置
  [
    "qianwen",
    {
      inputSelector: 'textarea, textarea[placeholder*="通义"]',
      submitMethod: "enter", // 使用回车键提交
    },
  ],
  // DeepSeek 配置
  [
    "deepseek",
    {
      inputSelector:
        'textarea, textarea[placeholder*="DeepSeek"], input[type="text"]',
      submitMethod: "enter", // 使用回车键提交
    },
  ],
  // Gemini 配置
  [
    "gemini",
    {
      // Gemini 聊天输入通常是 contenteditable 或 role="textbox" 的区域
      inputSelector:
        'div[contenteditable="true"], div[role="textbox"], textarea',
      // Gemini 通常回车即可发送，Shift+Enter 换行
      submitSelector:
        'button[aria-label*="Send"], button[aria-label*="发送"], button[aria-label*="提交"], div[role="button"][aria-label*="Send"]',
      submitMethod: "enter",
    },
  ],
  // MiniMax 配置
  [
    "minimax",
    {
      inputSelector: 'textarea, textarea[placeholder*="MiniMax"]',
      submitMethod: "enter", // 使用回车键提交
    },
  ],
  // Stepfun 配置
  [
    "stepfun",
    {
      inputSelector:
        'textarea.Publisher_textarea__pMX9t:not([disabled]), textarea[placeholder*="可以问我"]',
      submitSelector:
        "button.w-8.h-8.rounded-lg:has(svg.custom-icon-send-outline), button.w-8.h-8.rounded-lg.bg-content-primary",
      submitMethod: "click", // 使用点击按钮提交
    },
  ],
  // 通用配置（默认）
  [
    "default",
    {
      inputSelector:
        "textarea, input[type='text'], div[contenteditable='true']",
      submitMethod: "enter",
    },
  ],
] as const;

/**
 * 新建会话按钮选择器配置
 * 
 * 支持的选择器类型：
 * 1. 标准 CSS 选择器：如 'button.class', '#id', '[attr="value"]'
 * 2. :scope-text("文本")：查找包含指定文本的元素及其可点击父元素
 * 3. :has(选择器)：手动实现的 :has 伪选择器（用于不支持的浏览器）
 * 4. :navigate-to("路径")：直接导航到指定路径（用于某些应用）
 * 
 * 选择器按优先级排列，找到第一个匹配的即停止
 */
export const APP_NEW_SESSION_SELECTORS: Record<string, string[]> = {
  // DeepSeek - 通过文本查找"新对话"按钮
  deepseek: [
    ':scope-text("开启新对话")',
    ':scope-text("新对话")',
    ':scope-text("New Chat")',
  ],

  // 腾讯元宝 - 通过图标类名查找
  "tencent-yuanbao": [
    '.icon-yb-ic_newchat_20',
    'div.yb-common-nav__trigger:has(.icon-yb-ic_newchat_20)',
  ],

  // Kimi - 通过类名和文本查找
  moonshot: [
    '.new-chat-btn',
    ':scope-text("新建会话")',
    ':scope-text("新会话")',
    ':scope-text("New Chat")',
  ],

  // 豆包 - 通过文本查找
  doubao: [
    ':scope-text("新对话")',
    'div[class*="new-chat-btn"]',
  ],

  // 通义千问 - 优先使用顶部工具栏按钮（始终可见）
  dashscope: [
    '[data-icon-type="pcicon-addDialogue-line"]',
    'button:has([data-icon-type="pcicon-addDialogue-line"])',
    'button.new-chat-btn',
    ':scope-text("新对话")',
  ],

  // Minimax（海螺） - 新建任务按钮
  minimax: [
    'div.new-task-text-div',
    ':scope-text("新建任务")',
  ],

  // 智谱 - 通过文本查找
  zhipu: [
    ':scope-text("新建对话")',
    ':scope-text("新建")',
  ],

  // 百川 - 左上角第一个按钮
  baichuan: [
    'button:first-of-type',
    ':scope-text("新建对话")',
  ],

  // Stepfun - 直接导航到新建页面
  stepfun: [
    ':navigate-to("/chats/new")',
  ],

  // OpenAI - 通过 aria-label 和 data-testid 查找
  openai: [
    'button[aria-label*="New chat"]',
    '[data-testid="new-chat-button"]',
  ],

  // 默认配置 - 通用的查找方式
  default: [
    ':scope-text("新建对话")',
    ':scope-text("新对话")',
    ':scope-text("New Chat")',
    ':scope-text("新建")',
    'button[aria-label*="新建"]',
    'button[aria-label*="New"]',
  ],
};
