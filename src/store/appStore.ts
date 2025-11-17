// appStore 使用 pinia 管理
import { defineStore } from "pinia";

import {
  DEFAULT_SPLIT_LAYOUT,
  DEFAULT_TABS,
  APP_SEARCH_CONFIGS,
  appMap,
} from "../const/defaultConfig";
import { getItem, setItem } from "../utils/localStorage";

export interface App {
  id: string;
  name: string;
  url: string;
  logo: string;
  bodered?: boolean;
  // 是否不参与统一搜索（例如普通网站 WebView）
  noSearch?: boolean;
}

export interface Tab {
  id: string;
  app: App;
  title: string;
}

export interface SplitPane {
  id: string;
  type: "single" | "split";
  direction?: "horizontal" | "vertical";
  children?: SplitPane[];
  tabId?: string | null; // 如果是 single 类型，关联的 tab id
  size?: number; // 当前面板宽度百分比（仅一维横向布局使用）
}

// 用于持久化的 Tab 结构，只存 appId 等最小信息
export interface PersistedTab {
  id: string;
  appId: string;
  title: string;
}

// 应用搜索配置接口
export interface AppSearchConfig {
  inputSelector: string; // 输入框选择器
  submitSelector?: string; // 提交按钮选择器（可选）
  submitMethod?: "click" | "enter"; // 提交方式：点击按钮或按回车
}

export const useAppStore = defineStore("app", {
  state: () => {
    // 从本地缓存恢复 tabs
    const persistedTabs = getItem<PersistedTab[]>("oneai_tabs", {
      defaultValue: DEFAULT_TABS as PersistedTab[],
    });

    const tabs: Tab[] = persistedTabs
      .map((t) => {
        const app = appMap[t.appId];
        if (!app) return null;
        return {
          id: t.id,
          app,
          title: t.title,
        } as Tab;
      })
      .filter((t): t is Tab => t !== null);

    // 如果恢复结果为空，则退回默认 tabs
    const finalTabs = tabs.length
      ? tabs
      : (DEFAULT_TABS.map((t: any) => ({
          id: t.id,
          app: appMap[t.appId],
          title: t.title,
        })) as Tab[]);

    // 从本地缓存恢复 splitLayout
    const splitLayout = getItem<SplitPane>("oneai_split_layout", {
      defaultValue: DEFAULT_SPLIT_LAYOUT as SplitPane,
    });

    // 默认激活第一个 single 类型的面板
    let initialActivePaneId: string | null = null;
    if (splitLayout.type === "split" && splitLayout.children?.length) {
      const firstSingle = splitLayout.children.find(
        (p) => p.type === "single"
      );
      initialActivePaneId = firstSingle ? firstSingle.id : null;
    }

    return {
      tabs: finalTabs,
      activeTabId: null as string | null,
      // 当前激活的分屏面板 id（最后一次点击的面板）
      activePaneId: initialActivePaneId as string | null,
      splitLayout,
      // 应用搜索配置映射
      appSearchConfigs: new Map<string, AppSearchConfig>(
        APP_SEARCH_CONFIGS as any
      ),
    };
  },
  getters: {
    getTabs: (state) => state.tabs,
    getSplitLayout: (state) => state.splitLayout,
    getActivePaneId: (state) => state.activePaneId,
  },
  actions: {
    // ---------- 面板激活管理 ----------

    setActivePane(paneId: string) {
      if (this.splitLayout.type !== "split" || !this.splitLayout.children) {
        return;
      }
      const exists = this.splitLayout.children.some(
        (p) => p.type === "single" && p.id === paneId
      );
      if (exists) {
        this.activePaneId = paneId;
      }
    },
    // ---------- Tab 管理 ----------

    // 持久化当前 tabs 和 splitLayout
    persistState() {
      const tabsForPersist: PersistedTab[] = this.tabs.map((t) => ({
        id: t.id,
        appId: t.app.id,
        title: t.title,
      }));
      setItem("oneai_tabs", tabsForPersist);
      setItem("oneai_split_layout", this.splitLayout);
    },

    addTab(app: App) {
      const tabId = `${app.id}-${Date.now()}`;
      const tab: Tab = {
        id: tabId,
        app,
        title: app.name,
      };

      // 如果 tab 已存在，直接激活
      const existingTab = this.tabs.find((t) => t.app.id === app.id);
      if (existingTab) {
        this.activeTabId = existingTab.id;
        // 仅激活已有 tab，不修改布局，因此这里不必持久化
        return existingTab.id;
      }

      this.tabs.push(tab);
      this.activeTabId = tabId;

      // 确保 tab 显示在面板中
      this.ensureTabInActivePane(tabId);

      // 立刻持久化 tabs 和布局，避免依赖 beforeunload
      this.persistState();

      return tabId;
    },

    removeTab(tabId: string) {
      this.removeTabFromLayout(tabId);

      // 如果该面板没有其他 tab，自动关闭面板
      // 单个面板（single）只能有一个 tab，删除后肯定为空
      if (pane && pane.type === "single") {
        if (pane.id !== "root") {
          // 如果不是根面板，关闭该面板
          this.closePane(pane.id);
        } else {
          // 如果是根面板，确保它是空的（removeTabFromLayout 已经处理了）
          // 这里不需要额外操作
        }
      }

      // 删除 tab / 面板 后立即持久化
      this.persistState();
    },
    switchTab(tabId: string) {
      if (this.tabs.find((t) => t.id === tabId)) {
        this.activeTabId = tabId;
        // 确保 tab 显示在面板中（如果已经在某个面板中，不移动）
        this.ensureTabInActivePane(tabId, true);
      }
    },

    // 确保 tab 显示在某个面板中（扁平横向布局版本）
    ensureTabInActivePane(tabId: string, preferActivePane: boolean = false) {
      // 如果 preferActivePane 为 true，尝试找到当前显示该 tab 的面板
      if (preferActivePane) {
        const currentPane = this.findPaneByTabId(tabId);
        if (currentPane) {
          // tab 已经在某个面板中显示，不需要移动
          return;
        }
      }

      // 当前只维护一层横向 children
      if (this.splitLayout.type === "split") {
        const children = this.splitLayout.children || [];

        // 1. 优先找第一个空面板
        const empty = children.find((p) => p.type === "single" && !p.tabId);
        if (empty) {
          empty.tabId = tabId;
          return;
        }

        // 2. 如果没有 panel，则创建一个
        if (children.length === 0) {
          this.splitLayout.children = [
            {
              id: `pane-1`,
              type: "single",
              tabId,
            },
          ];
          return;
        }

        // 3. 没有空面板但已有面板，则使用第一个面板
        const first = children[0];
        if (first && first.type === "single") {
          first.tabId = tabId;
        }
      }
    },

    // 查找包含指定 tab 的面板（扁平布局）
    findPaneByTabId(tabId: string): SplitPane | null {
      if (this.splitLayout.type !== "split" || !this.splitLayout.children) {
        return null;
      }
      return (
        this.splitLayout.children.find(
          (p) => p.type === "single" && p.tabId === tabId
        ) || null
      );
    },

    isTabOpen(appId: string) {
      return this.tabs.some((tab) => tab.app.id === appId);
    },

    // 根据应用 id 或 URL 查找已存在的 tab（用于点击时去重）
    findExistingTabByApp(app: App): Tab | undefined {
      return this.tabs.find(
        (tab) => tab.app.id === app.id || tab.app.url === app.url
      );
    },

    /**
     * 在一维横向分屏中打开应用（AI 应用 & 其他网站通用逻辑）
     * 1. 如果已打开：激活 + 刷新
     * 2. 如果未打开：
     *    - 先找空面板（single 且 tabId 为空）
     *    - 没有空面板则尝试新增一个；若达到上限则返回 "limit"
     * @param app 要打开的应用
     * @param maxPanels 分屏上限
     * @returns "ok" | "limit"（到达上限时为 "limit"）
     */
    openAppWithSplit(app: App, maxPanels: number): "ok" | "limit" {
      // 1. 已打开：刷新 + 激活对应 tab 和 pane
      const existingTab = this.findExistingTabByApp(app);
      if (existingTab) {
        // 确保这个 tab 挂在某个面板上（可能之前被移出布局）
        this.ensureTabInActivePane(existingTab.id, true);

        this.activeTabId = existingTab.id;
        const pane = this.findPaneByTabId(existingTab.id);
        if (pane) {
          this.activePaneId = pane.id;
        }
        this.refreshTab(existingTab.id);
        return "ok";
      }

      // 2. 未打开：需要一个新的分屏 panel
      const layout = this.getSplitLayout as SplitPane;
      let hasEmptyPane = false;
      let paneLen = 0;
      if (layout.type === "split" && layout.children) {
        paneLen = layout.children.length;
        hasEmptyPane = layout.children.some(
          (p: SplitPane) => p.type === "single" && !p.tabId
        );
      }

      // 如果没有空面板，则尝试新增一个；超出上限则告知调用方
      if (!hasEmptyPane) {
        if (paneLen >= maxPanels) {
          return "limit";
        }
        this.addPanel();
      }

      // 新增 tab，会被挂载到空面板上
      this.addTab(app);
      return "ok";
    },

    /**
     * 打开“常用网站”应用：
     * 1. 有空白面板时优先占用空白面板
     * 2. 否则覆盖当前激活面板（activePaneId），若无则使用第一个面板
     * 3. 覆盖面板中原有的 tab（如果存在）
     */
    openWebsiteWithSplit(app: App): "ok" {
      // 如果相同网站已打开（按 id 或 URL 去重）：刷新 + 激活对应 tab 和 pane
      const existingTab = this.findExistingTabByApp(app);
      if (existingTab) {
        // 同样确保 tab 绑定到某个面板
        this.ensureTabInActivePane(existingTab.id, true);

        this.activeTabId = existingTab.id;
        const pane = this.findPaneByTabId(existingTab.id);
        if (pane) {
          this.activePaneId = pane.id;
        }
        this.refreshTab(existingTab.id);
        return "ok";
      }

      const layout = this.getSplitLayout as SplitPane;
      if (layout.type !== "split" || !layout.children || !layout.children.length) {
        return "ok";
      }

      const children = layout.children;

      // 1. 优先找空白面板
      let targetPane = children.find(
        (p) => p.type === "single" && !p.tabId
      ) as SplitPane | undefined;

      // 2. 没有空白面板时，使用当前激活面板
      if (!targetPane) {
        const activeId = this.activePaneId;
        if (activeId) {
          const activePane = children.find(
            (p) => p.type === "single" && p.id === activeId
          );
          if (activePane) {
            targetPane = activePane as SplitPane;
          }
        }
      }

      // 3. 兜底：如果还没有，使用第一个 single 面板
      if (!targetPane) {
        targetPane = children.find((p) => p.type === "single") as
          | SplitPane
          | undefined;
      }

      if (!targetPane) {
        return "ok";
      }

      let tabId = targetPane.tabId || null;

      if (tabId) {
        // 覆盖原有 tab 的应用配置
        const existingTab = this.tabs.find((t) => t.id === tabId);
        if (existingTab) {
          existingTab.app = app;
          existingTab.title = app.name;
        } else {
          // 找不到对应 tab，则新建一个
          tabId = `${app.id}-${Date.now()}`;
          targetPane.tabId = tabId;
          this.tabs.push({
            id: tabId,
            app,
            title: app.name,
          });
        }
      } else {
        // 空白面板，创建新 tab
        tabId = `${app.id}-${Date.now()}`;
        targetPane.tabId = tabId;
        this.tabs.push({
          id: tabId,
          app,
          title: app.name,
        });
      }

      this.activeTabId = tabId;
      this.activePaneId = targetPane.id;

      // 持久化 tabs 和布局
      this.persistState();

      return "ok";
    },

    // 刷新指定 tab 对应的面板（用于点击已有应用时触发刷新）
    refreshTab(tabId: string) {
      const pane = this.findPaneByTabId(tabId);
      if (!pane) return;
      window.dispatchEvent(
        new CustomEvent("refresh-pane", {
          detail: { paneId: pane.id },
        })
      );
    },

    // ---------- 一维横向分屏管理 ----------
    // 顶部 SearchBar 的分屏按钮：在当前一维布局末尾追加一个空 panel
    // 上限与提示逻辑在 SearchBar 组件内处理，这里只负责真正新增 panel
    addPanel() {
      if (this.splitLayout.type !== "split") return;
      const newId = `pane-${Date.now()}`;
      const newPane: SplitPane = {
        id: newId,
        type: "single",
        tabId: null,
      };

      if (!this.splitLayout.children) {
        this.splitLayout.children = [newPane];
      } else {
        this.splitLayout.children.push(newPane);
      }

      // 新建的空白面板设为当前激活面板
      this.activePaneId = newId;

      // 新增 panel 后持久化
      this.persistState();
    },

    // 关闭指定 panel（仅一维 children）
    closePane(paneId: string) {
      if (this.splitLayout.type !== "split" || !this.splitLayout.children) {
        return;
      }

      const index = this.splitLayout.children.findIndex((p) => p.id === paneId);
      if (index === -1) return;

      const pane = this.splitLayout.children[index];
      const tabId = pane.type === "single" ? pane.tabId : null;

      // 从布局中移除该 panel
      this.splitLayout.children.splice(index, 1);

      // 至少保留一个空面板，避免整个区域为空
      if (this.splitLayout.children.length === 0) {
        this.splitLayout.children.push({
          id: "pane-empty",
          type: "single",
          tabId: null,
        });
      }

      // 如果关闭的是当前激活面板，选中第一个 single 面板作为新的激活面板
      if (this.activePaneId === paneId) {
        const firstSingle = this.splitLayout.children.find(
          (p) => p.type === "single"
        );
        this.activePaneId = firstSingle ? firstSingle.id : null;
      }

      // 删除对应的 tab
      if (tabId) {
        const tabIndex = this.tabs.findIndex((t) => t.id === tabId);
        if (tabIndex !== -1) {
          const removed = this.tabs[tabIndex];
          this.tabs.splice(tabIndex, 1);

          // 如果删的是当前激活 tab，切到第一个 tab
          if (this.activeTabId === removed.id) {
            this.activeTabId = this.tabs[0]?.id || null;
          }
        }
      }

      // 关闭 panel 后持久化
      this.persistState();
    },

    // 在一维数组中移动 panel（用于 header 拖拽排序）
    movePane(sourcePaneId: string, targetPaneId: string) {
      if (this.splitLayout.type !== "split" || !this.splitLayout.children) {
        return;
      }

      const children = this.splitLayout.children;
      const fromIndex = children.findIndex((p) => p.id === sourcePaneId);
      const toIndex = children.findIndex((p) => p.id === targetPaneId);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      const [moved] = children.splice(fromIndex, 1);
      children.splice(toIndex, 0, moved);

      // 拖拽排序后持久化
      this.persistState();
    },

    // 记录当前所有 panel 的宽度（百分比）到 splitLayout 中
    // 实际持久化在应用关闭时统一进行（见 persistState）
    setPaneSizes(sizes: number[]) {
      if (this.splitLayout.type !== "split" || !this.splitLayout.children) {
        return;
      }
      const children = this.splitLayout.children;
      const len = Math.min(children.length, sizes.length);
      for (let i = 0; i < len; i++) {
        const pane = children[i];
        if (pane.type === "single") {
          pane.size = sizes[i];
        }
      }
    },

    removeTabFromLayout(tabId: string) {
      if (this.splitLayout.type !== "split" || !this.splitLayout.children) {
        return;
      }

      this.splitLayout.children.forEach((pane) => {
        if (pane.type === "single" && pane.tabId === tabId) {
          pane.tabId = null;
        }
      });
    },

    // 获取应用的搜索配置
    getAppSearchConfig(appId: string): AppSearchConfig {
      const lowerAppId = appId.toLowerCase();
      console.log("🔍 [appStore] 查找配置，appId:", lowerAppId);
      console.log(
        "📋 [appStore] 所有可用配置:",
        Array.from(this.appSearchConfigs.keys())
      );
      
      // 优先使用应用特定配置，否则使用默认配置
      let config = this.appSearchConfigs.get(lowerAppId);
      if (!config) {
        config = this.appSearchConfigs.get("default");
      }
      
      // 如果连默认配置都没有，返回一个基本配置
      if (!config) {
        console.warn("⚠️ [appStore] 未找到配置，使用回退配置");
        config = {
          inputSelector: "textarea, input[type='text'], div[contenteditable='true']",
          submitMethod: "enter"
        };
      }
      
      console.log("✅ [appStore] 找到的配置:", config);
      return config;
    },

    // 收集所有包含 tab 的面板（扁平布局：根节点 children 即所有 panel）
    getAllPanesWithTabs(): SplitPane[] {
      if (this.splitLayout.type !== "split" || !this.splitLayout.children) {
        return [];
      }
      return this.splitLayout.children.filter(
        (p) => p.type === "single" && !!p.tabId
      );
    },

    // 搜索所有应用
    async searchAllApps(searchText: string): Promise<void> {
      console.log("🔍 [appStore] searchAllApps 被调用，搜索内容:", searchText);
      const panesWithTabs = this.getAllPanesWithTabs();

      console.log(
        "📊 [appStore] 找到的面板数量:",
        panesWithTabs.length,
        "所有 tabs:",
        this.tabs.map((t) => ({ id: t.id, name: t.app.name }))
      );

      if (panesWithTabs.length === 0) {
        console.warn("⚠️ [appStore] 没有打开的应用");
        return;
      }

      // 为每个面板发送搜索请求
      const searchPromises = panesWithTabs.map((pane) => {
        const tab = this.tabs.find((t) => t.id === pane.tabId);
        if (!tab) {
          console.warn("⚠️ [appStore] 未找到 tab，paneId:", pane.id);
          return Promise.resolve();
        }

        // 标记为不支持统一搜索的应用（例如普通网站）直接跳过
        if (tab.app.noSearch) {
          console.log(
            "⏭️ [appStore] 应用不支持统一搜索，跳过:",
            tab.app.name,
            "appId:",
            tab.app.id
          );
          return Promise.resolve();
        }

        console.log(
          "📤 [appStore] 向面板发送搜索:",
          pane.id,
          "应用:",
          tab.app.name,
          "appId:",
          tab.app.id
        );
        const config = this.getAppSearchConfig(tab.app.id);
        console.log("⚙️ [appStore] 使用的配置:", config);
        return this.sendSearchToPane(pane.id, searchText, config);
      });

      await Promise.allSettled(searchPromises);
      console.log("✅ [appStore] 所有搜索请求已发送");
    },

    // 向指定面板发送搜索（这个方法会被 AppView 调用）
    async sendSearchToPane(
      paneId: string,
      searchText: string,
      config: AppSearchConfig
    ): Promise<void> {
      console.log("📡 [appStore] 发送 search-pane 事件:", {
        paneId,
        searchText,
        config,
      });
      // 这个方法会通过事件或直接调用 AppView 的方法来实现
      // 由于需要在组件中访问 webview，我们通过事件来触发
      window.dispatchEvent(
        new CustomEvent("search-pane", {
          detail: { paneId, searchText, config },
        })
      );
    },
  },
});
