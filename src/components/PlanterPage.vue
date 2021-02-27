
<template>
  <section class="planterpage">
    <h1>
      <img
        src="../assets/planted-logo-braun.svg"
        title="Planted"
        width="250"
        height="50"
      >
      </h1>
      <img src="../assets/avatar.png" width="150" height="150" alt="Profilbild">
      <h2>Annika Muster</h2>
      <p>Planter since January 2021</p>
      <div class="contributions">
        <div class="trees-numbers">
          <h3>25</h3>
          Trees
        </div>
        <div class="trees-mascots">
          <img src="../assets/tree-toons.svg" width="388" height="313" alt="" loading="lazy">
        </div>
        <div class="tons-numbers">
          <h3>8,3</h3>
          CO<sub>2</sub> t
        </div>
      </div>
  </section>
</template>

<script lang="ts">
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
    text-align: center;

    h2 {
      font-size: 30px;
    }

    .contributions {
      font-size: 33px;
      h3 {
        font-size: 68px;
        margin-bottom: 0;
      }
    }

    p {
      font-size: 24px;
    }

    .contributions {
      display: flex;
      flex-direction: row;
      place-content: space-around;
      max-width: 600px;
      margin: 0 auto;
    }
  }
</style>