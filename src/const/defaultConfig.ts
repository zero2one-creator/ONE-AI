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
    url: "https://www.tongyi.com/",
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
