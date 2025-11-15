<template>
  <!-- 类似 VS Code 横向分屏的图标：一个窗口中间一条竖线 -->
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 外框 -->
    <rect
      x="1.5"
      y="2.5"
      width="13"
      height="11"
      rx="2"
      stroke="currentColor"
      stroke-width="1.3"
    />
    <!-- 垂直分割线，表示左右分屏 -->
    <line
      x1="8"
      y1="3"
      x2="8"
      y2="13"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
