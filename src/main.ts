import { createApp } from "vue";
import { createPinia, setActivePinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import { useAppStore } from "./store/appStore";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
setActivePinia(pinia);

const appStore = useAppStore();

// 关闭应用时将布局和 tabs 缓存到 localStorage
window.addEventListener("beforeunload", () => {
  appStore.persistState();
});

if (import.meta.env.DEV) {
  app.config.devtools = true;
}

app.mount("#app").$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
  });
});
