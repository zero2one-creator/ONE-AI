// 简单的 LocalStorage 工具，用于管理需要持久化存储的设置
// 在 Electron + Vue 环境下使用时，需要注意仅在 renderer 端（有 window 对象）调用

export interface StorageOptions<T> {
  /**
   * 默认值，当本地没有值或解析失败时返回
   */
  defaultValue: T;
}

const isBrowser = typeof window !== "undefined" && !!window.localStorage;

export function getItem<T>(key: string, options: StorageOptions<T>): T {
  if (!isBrowser) return options.defaultValue;

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return options.defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn("[localStorage] getItem 解析失败:", key, e);
    return options.defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (!isBrowser) return;

  try {
    const raw = JSON.stringify(value);
    window.localStorage.setItem(key, raw);
  } catch (e) {
    console.warn("[localStorage] setItem 写入失败:", key, e);
  }
}

export function removeItem(key: string): void {
  if (!isBrowser) return;

  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.warn("[localStorage] removeItem 删除失败:", key, e);
  }
}

export function clearAll(): void {
  if (!isBrowser) return;

  try {
    window.localStorage.clear();
  } catch (e) {
    console.warn("[localStorage] clearAll 失败:", e);
  }
}
