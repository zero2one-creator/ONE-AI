<template>
  <div class="split-layout">
    <PanelGroup
      direction="horizontal"
      class="panel-group"
      :layout="layout"
      @layout="handleLayout"
    >
      <template v-for="(pane, index) in panes" :key="pane.id">
        <Panel :defaultSize="100 / panes.length" :minSize="18" class="panel">
          <AppView
            :tabId="pane.tabId || null"
            :paneId="pane.id"
            :canClose="panes.length > 1"
          />
        </Panel>
        <PanelResizeHandle
          v-if="index < panes.length - 1"
          class="resize-handle"
        />
      </template>
    </PanelGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { PanelGroup, Panel, PanelResizeHandle } from "vue-resizable-panels";
import type { SplitPane } from "../../../store/appStore";
import { useAppStore } from "../../../store/appStore";
import AppView from "./AppView.vue";

interface Props {
  panes: SplitPane[];
}

const props = defineProps<Props>();
const appStore = useAppStore();

const panes = computed(() => props.panes || []);

// 计算当前布局（使用已保存的 size，否则均分）
const layout = computed(() => {
  const list = panes.value;
  if (!list.length) return [] as number[];

  const sizes = list.map((p) => p.size ?? 0);
  const sum = sizes.reduce((s, v) => s + v, 0);
  if (sum > 0) {
    return sizes;
  }

  const equal = 100 / list.length;
  return list.map(() => equal);
});

// 记录 PanelGroup 的 layout 到 store 中
const handleLayout = (sizes: number[]) => {
  appStore.setPaneSizes(sizes);
};
</script>

<style scoped lang="scss">
.split-layout {
  width: 100%;
  height: 100%;
  position: relative;
}

.panel-group {
  width: 100%;
  height: 100%;
}

.panel {
  position: relative;
  overflow: hidden;
}

.resize-handle {
  background-color: #e0e0e0;
  transition: background-color 0.2s;
  position: relative;
  z-index: 10;
  flex-shrink: 0;

  &[data-panel-group-direction="horizontal"] {
    width: 4px;
    min-width: 4px;
    cursor: col-resize;

    &:hover {
      background-color: #4a90e2;
    }
  }

  &[data-panel-group-direction="vertical"] {
    height: 4px;
    min-height: 4px;
    cursor: row-resize;

    &:hover {
      background-color: #4a90e2;
    }
  }

  &:active,
  &[data-resize-handle-state="dragging"] {
    background-color: #357abd;
  }
}
</style>
