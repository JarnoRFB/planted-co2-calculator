
<template>
    <main class="planterpage">
    <h1>Planted</h1>
    <p>Annika Muster, planter since January 2021</p>
  </main>
</template>

<script lang="ts">
import defineComponent from "vue"

export default defineComponent({
  name: "PlanterPage",
  props: {},
})
</script>

<style scoped lang="scss">
  .planterpage {
    background: $planted-background;
    color: $planted-gray;
  }
</style>