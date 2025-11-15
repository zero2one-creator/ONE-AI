<template>
  <div class="search-input-container">
    <div class="search-input-wrapper">
      <SearchIcon class="search-icon" />
      <textarea
        ref="searchInputRef"
        v-model="searchText"
        class="search-input"
        :placeholder="placeholder"
        @keydown.enter="handleKeyDown"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
        @input="checkMultiline"
        rows="1"
      />
      <button
        v-if="isMultiline"
        class="expand-button"
        @click="openExpandModal"
        title="展开编辑"
      >
        ⤢
      </button>
    </div>
    <button
      class="search-button"
      :disabled="!searchText.trim() || isSearching"
      @click="handleSearch"
      title="搜索"
    >
      搜索
    </button>

    <!-- 展开编辑模态框 -->
    <Teleport to="body">
      <div
        v-if="showExpandModal"
        class="expand-modal-backdrop"
        @click="closeExpandModal"
      >
        <div class="expand-modal" @click.stop>
          <div class="modal-header">
            <span class="modal-title">编辑搜索内容</span>
            <button class="close-button" @click="closeExpandModal">×</button>
          </div>
          <textarea
            ref="expandTextareaRef"
            v-model="expandText"
            class="expand-textarea"
            placeholder="输入问题，支持多行..."
          />
          <div class="modal-actions">
            <button class="btn cancel" @click="closeExpandModal">取消</button>
            <button 
              class="btn primary" 
              :disabled="!expandText.trim() || isSearching"
              @click="confirmAndSearch"
            >
              搜索
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { SearchIcon } from "../../../components/Icon";
import { useAppStore } from "../../../store/appStore";

interface Props {
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  placeholder: "输入问题，一键搜索所有 AI 应用...",
});

const appStore = useAppStore();

const searchText = ref("");
const isSearching = ref(false);
const isComposing = ref(false);
const searchInputRef = ref<HTMLTextAreaElement | null>(null);
const isMultiline = ref(false);

// 展开模态框相关
const showExpandModal = ref(false);
const expandText = ref("");
const expandTextareaRef = ref<HTMLTextAreaElement | null>(null);

// 检查是否多行
const checkMultiline = () => {
  if (searchInputRef.value) {
    const lineCount = searchText.value.split("\n").length;
    isMultiline.value = lineCount > 1;
  }
};

// 打开展开模态框
const openExpandModal = () => {
  expandText.value = searchText.value;
  showExpandModal.value = true;
  nextTick(() => {
    expandTextareaRef.value?.focus();
  });
};

// 关闭展开模态框
const closeExpandModal = () => {
  showExpandModal.value = false;
};

// 确认展开编辑并搜索
const confirmAndSearch = async () => {
  const trimmedText = expandText.value.trim();
  if (!trimmedText) {
    // 如果文本为空，只关闭弹窗
    showExpandModal.value = false;
    return;
  }
  
  searchText.value = expandText.value;
  showExpandModal.value = false;
  checkMultiline();
  // 直接触发搜索
  await handleSearch();
};

const handleKeyDown = (e: KeyboardEvent) => {
  // 避免输入法候选词确认时触发搜索
  if (isComposing.value) return;
  
  // 如果按下 Shift+Enter，允许换行（不做任何处理）
  if (e.shiftKey) {
    return;
  }
  
  // 如果只按 Enter（没有 Shift），触发搜索
  e.preventDefault();
  handleSearch();
};

const handleSearch = async () => {
  const text = searchText.value.trim();
  if (!text || isSearching.value) return;

  isSearching.value = true;
  try {
    await appStore.searchAllApps(text);
  } catch (error) {
    console.error("搜索失败:", error);
  } finally {
    isSearching.value = false;
  }
};
</script>

<style scoped lang="scss">
.search-input-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(142, 142, 147, 0.12);
  border-radius: 10px;
  border: 0.5px solid transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }

  &:focus-within {
    background-color: rgba(255, 255, 255, 1);
    border-color: rgba(0, 122, 255, 0.5);
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 14px;
    color: rgba(142, 142, 147, 0.8);
    pointer-events: none;
    transition: color 0.2s ease;
  }

  .search-input {
    flex: 1;
    min-height: 44px;
    max-height: 200px;
    padding: 12px 40px 12px 40px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 400;
    color: #000000;
    background-color: transparent;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
      "Helvetica Neue", Helvetica, Arial, sans-serif;
    letter-spacing: -0.01em;
    resize: none;
    line-height: 1.5;
    overflow-y: auto;

    &::placeholder {
      color: rgba(142, 142, 147, 0.6);
      font-weight: 400;
    }

    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(142, 142, 147, 0.3);
      border-radius: 3px;

      &:hover {
        background-color: rgba(142, 142, 147, 0.5);
      }
    }
  }

  .expand-button {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background-color: rgba(0, 122, 255, 0.1);
    color: rgba(0, 122, 255, 0.8);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background-color: rgba(0, 122, 255, 0.2);
      color: rgba(0, 122, 255, 1);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.search-button {
  padding: 0 20px;
  height: 44px;
  border: none;
  border-radius: 10px;
  background-color: rgba(0, 122, 255, 0.9);
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Helvetica Neue", Helvetica, Arial, sans-serif;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background-color: rgba(0, 122, 255, 1);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background-color: rgba(142, 142, 147, 0.3);
    cursor: not-allowed;
  }
}

/* 展开模态框样式 */
.expand-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  backdrop-filter: blur(4px);
}

.expand-modal {
  width: 680px;
  max-width: 90vw;
  max-height: 85vh;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .close-button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background-color: transparent;
    color: #6b7280;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      color: #374151;
    }
  }
}

.expand-textarea {
  flex: 1;
  min-height: 300px;
  max-height: 650px;
  padding: 20px 24px;
  border: none;
  font-size: 15px;
  line-height: 1.6;
  color: #1f2937;
  resize: none;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Helvetica Neue", Helvetica, Arial, sans-serif;
  overflow-y: auto;

  &::placeholder {
    color: rgba(107, 114, 128, 0.6);
  }

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  .btn {
    min-width: 80px;
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
      "Helvetica Neue", Helvetica, Arial, sans-serif;

    &.cancel {
      background-color: transparent;
      color: #6b7280;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: #374151;
      }
    }

    &.primary {
      background-color: rgba(0, 122, 255, 0.9);
      color: #ffffff;

      &:hover:not(:disabled) {
        background-color: rgba(0, 122, 255, 1);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        background-color: rgba(142, 142, 147, 0.3);
        cursor: not-allowed;
        opacity: 0.6;
      }
    }
  }
}
</style>
