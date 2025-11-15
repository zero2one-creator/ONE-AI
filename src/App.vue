<script setup lang="ts">
import { NMessageProvider } from "naive-ui";
import Main from "./pages/Main/index.vue";
</script>

<template>
  <n-message-provider>
    <Main />
  </n-message-provider>
</template>

<style scoped></style>
