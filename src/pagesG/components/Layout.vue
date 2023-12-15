<script setup lang="ts">
// import useLayoutStart from "@/hooks/useLayoutStart"

// const { layoutStart } = useLayoutStart()
const props = defineProps<{
  bg: string
}>()
</script>

<template>
  <div class="page">
    <div class="top">
      <img class="image" :src="props.bg" alt="" />
      <div
        class="header-content"
      >
        <slot name="header"></slot>
      </div>
    </div>

    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top {
  width: 100%;
  // #ifdef H5
  height: 120px;
  // #endif
  // #ifndef H5
  height: 212px;
  // #endif
  position: relative;
}
.image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #ccc;
}
.header-content {
  position: relative;
  z-index: 2;
  color: #fff;
  height: 100%;
  box-sizing: border-box;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.12) 100%
  );
}
.content {
  flex: 1;
  overflow: auto;
}
</style>
