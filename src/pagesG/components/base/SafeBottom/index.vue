<script setup lang="ts"></script>

<template>
  <div class="safe-bottom">
    <slot></slot>
  </div>
</template>

<style scoped>
.safe-bottom {
  background: #fff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
