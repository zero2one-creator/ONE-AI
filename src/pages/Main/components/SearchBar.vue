<template>
  <div class="search-bar">
    <!-- AI 应用图标列表 -->
    <div class="app-icons-container">
      <div
        class="app-icon-item"
        v-for="app in aiAppList"
        :key="app.id"
        @click="onClickApp(app)"
        @mouseenter="showTooltip(app, $event)"
        @mouseleave="hideTooltip"
      >
        <img :src="app.logo" :alt="app.name" />
      </div>
    </div>

    <div class="search-container-divider"></div>
    <!-- 搜索框 -->
    <div class="search-container">
      <SearchInput />
    </div>

    <!-- 设置 / 右侧工具栏 -->
    <div class="toolbar-spacer"></div>
    <div class="layout-controls">
      <button
        type="button"
        class="icon-button"
        @click="onSplitHorizontal"
        title="横向分屏"
      >
        <HorizontalSplitIcon />
      </button>
    </div>

    <!-- Tooltip - 使用 Teleport 渲染到 body -->
    <Teleport to="body">
      <div
        v-if="tooltip.show"
        class="tooltip"
        :style="{
          top: tooltip.top + 'px',
          left: tooltip.left + 'px',
        }"
      >
        {{ tooltip.text }}
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useMessage } from "naive-ui";
import { HorizontalSplitIcon } from "../../../components/Icon";
import { useAppStore } from "../../../store/appStore";
import { AIAppList, logoMap } from "../../../const/defaultConfig";
import SearchInput from "./SearchInput.vue";
import type { App } from "../../../store/appStore";

const appStore = useAppStore();
const message = useMessage();

// 为每个应用注入 logo
const aiAppList = ref(
  AIAppList.map((app: any) => ({
    ...app,
    logo: logoMap[app.id],
  }))
);

// 当前一维横向布局的 panel 数量
const paneCount = computed(() => {
  const layout = appStore.getSplitLayout;
  if (layout.type === "split" && layout.children) {
    return layout.children.length;
  }
  return 0;
});

const tooltip = reactive({
  show: false,
  text: "",
  top: 0,
  left: 0,
});

const onClickApp = (app: App) => {
  // 检查是否已有该应用的 tab 打开
  if (appStore.isTabOpen(app.id)) {
    // 如果已打开，找到对应的 tab 并激活 + 刷新
    const existingTab = appStore.getTabs.find(
      (tab: any) => tab.app.id === app.id
    );
    if (existingTab) {
      appStore.switchTab(existingTab.id);
      appStore.refreshTab(existingTab.id);
    }
  } else {
    // 如果未打开，添加新的 tab
    appStore.addTab(app);
  }
};

const showTooltip = (app: App, event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  tooltip.text = app.name;
  tooltip.top = rect.bottom + 8; // 在图标下方8px
  tooltip.left = rect.left + rect.width / 2; // 居中点位置，CSS transform 会处理偏移
  tooltip.show = true;
};

const hideTooltip = () => {
  tooltip.show = false;
};

// 右上角横向分屏按钮：在当前一维横向布局末尾新增一个 panel
const onSplitHorizontal = () => {
  const MAX_PANELS = 4;
  if (paneCount.value >= MAX_PANELS) {
    message.warning(`最多同时分屏 ${MAX_PANELS} 个应用`);
    return;
  }

  appStore.addPanel();
};
</script>

<style scoped lang="scss">
.search-bar {
  height: 60px;
  background-color: #ffffff;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  gap: 16px;

  .app-icons-container {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    flex-shrink: 0;
    padding: 4px 0;
    max-width: 50%;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #d0d0d0;
      border-radius: 2px;

      &:hover {
        background-color: #b0b0b0;
      }
    }

    .app-icon-item {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 8px;
      background-color: #ffffff;
      transition: all 0.2s;
      flex-shrink: 0;
      padding: 2px;

      &:hover {
        background-color: #f0f4f8;
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(74, 144, 226, 0.15);
      }

      &:active {
        transform: translateY(0);
      }

      img {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        transition: transform 0.2s;
      }
    }
  }

  .search-container-divider {
    width: 1px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  .search-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 1000px;
    max-width: 50%;
    flex-shrink: 0;
  }

  .toolbar-spacer {
    flex: 1;
  }

  .layout-controls {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon-button {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.6);
      transition: all 0.2s ease;

      &:hover {
        background-color: #f0f4f8;
        color: #007aff;
      }

      &:active {
        transform: translateY(1px);
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.tooltip {
  position: fixed;
  background-color: rgba(44, 62, 80, 0.95);
  color: #ffffff;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 999999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transform: translateX(-50%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: tooltipFadeIn 0.15s ease-out;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: -0.01em;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
