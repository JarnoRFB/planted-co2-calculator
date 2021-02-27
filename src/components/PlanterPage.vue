
<template>
    <main class="planterpage">
    <h1>Planted</h1>
    <p>Annika Muster, planter since January 2021</p>
  </main>
</template>

<script lang="ts">
import {LocalizedDescription} from "@/lib/estimation/sources"
import {defineComponent, PropType} from "vue"

export default defineComponent({
  name: "PlanterPage",
  props: {},
})
</script>

<style scoped lang="scss">
  /* TODO refactor redundant styles */
  $planted-background: #bfb8a3;
  $planted-yellow: #c9f967;
  $planted-cta: #ae35e1;
  $planted-pink: #fe61c9;
  $planted-amber: #8a231c;
  $planted-orange: #fe5902;
  $planted-brown: #926c3d;
  $planted-blue: #4a83f3;
  $planted-gray: #2b232f;

  .planterpage {
    background-color: $planted-background;
    color: $planted-gray;
  }
</style>