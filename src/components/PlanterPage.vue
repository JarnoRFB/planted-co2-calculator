<template>
  <section class="planterpage">
    <h1>
      <img src="../assets/planted-logo-braun.svg" title="Planted" width="250" height="50" />
    </h1>
    <img src="../assets/avatar.png" width="150" height="150" alt="Profilbild" />
    <h2>Annika Muster</h2>
    <p>Planter since January 2021</p>
    <div class="contributions">
      <div class="trees-numbers">
        <h3>25</h3>
        Trees
        <div class="details-container">
          <a @click="showTreesDetails = !showTreesDetails" class="openclose">
            <img
              src="../assets/add_circle_outline-black-18dp.svg"
              width="24"
              height="24"
              alt="open"
            />
          </a>
          <div v-if="showTreesDetails" class="details">
            <forest-map v-click-outside="closeTreesDetails" />
            <a @click="closeTreesDetails" class="openclose">
              <img
                src="../assets/remove_circle_outline-24px.svg"
                width="24"
                height="24"
                alt="close"
              />
            </a>
          </div>
        </div>
      </div>

      <div class="trees-mascots not-on-mobile">
        <img src="../assets/baum-bege.gif" width="300" height="323" alt="" loading="lazy" />
      </div>

      <div class="tons-numbers contains-details">
        <h3>8,3</h3>
        CO<sub>2</sub> t
        <div class="details-container">
          <a @click="showTonsDetails = !showTonsDetails" class="openclose">
            <img
              src="../assets/add_circle_outline-black-18dp.svg"
              width="24"
              height="24"
              alt="open"
            />
          </a>
          <div v-if="showTonsDetails" class="details">
            <wind-map v-click-outside="closeTonsDetails" />
            <a @click="closeTonsDetails" class="openclose">
              <img
                src="../assets/remove_circle_outline-24px.svg"
                width="24"
                height="24"
                alt="close"
              />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="donate-wrapper">
      <a href="https://planted.green/" class="btn cta">
        Increase impact
      </a>
    </div>

    <h2>Your Impact</h2>

    <div class="card-wrapper">
      <div class="card">
        <div>
          <h3>200</h3>
          cow farts
        </div>
        <div>
          <img src="../assets/kuh-gruen.gif" width="400" height="400" alt="farting cow" />
        </div>
      </div>
      <div class="card">
        <div>
          <h3>450</h3>
          hours of electric lighting
        </div>
        <div>
          <img src="../assets/icon-gluehbirne.svg" width="186" height="150" alt="light bulb" />
        </div>
      </div>
      <div class="card">
        <div>
          <h3>950</h3>
          km driven by car
        </div>
        <div>
          <img src="../assets/erde-auto-19.svg" width="420" height="339" alt="automobile" />
        </div>
      </div>
    </div>

    <h2 class="uppercase">Did you know?</h2>

    <p>Your daily CO<sub>2</sub> life hack</p>

    <div class="facts-container">
      <div class="earth">
        <img src="../assets/erde-facts.svg" alt="earth teaching" />
      </div>
      <div class="fact headfont">
        Showering 5 instead of 10 minutes will save an extra 20 cow farts.
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue"
import ForestMap from "./ForestMap.vue"
import WindMap from "./WindMap.vue"
import vClickOutside from "@/lib/v-click-outside"

export default defineComponent({
  name: "PlanterPage",
  props: {},
  data() {
    return {
      showTreesDetails: false,
      showTonsDetails: false,
    }
  },
  methods: {
    closeTreesDetails() {
      this.showTreesDetails = false
    },
    closeTonsDetails() {
      this.showTonsDetails = false
    },
  },
  components: {ForestMap, WindMap},
  directives: {clickOutside: vClickOutside},
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
$planted-green: #00904e;
$maxmobile: 640px;

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

  @media screen and (max-width: $maxmobile) {
    .not-on-mobile {
      display: none;
    }
  }

  a.openclose {
    display: block;
    margin: 0 auto;
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  /* card overlays */
  .details {
    position: fixed;
    transition: transform 1s ease-out;
    top: 5%;
    left: 5%;
    width: 90vw;
    height: 400px;
    background-color: $planted-blue;
    color: white;
    border-radius: 5px;
    z-index: 255;
  }

  .donate-wrapper {
    padding: 50px;
  }

  /* primary call to action button ("donate") */
  .btn.cta {
    background-color: $planted-cta;
    border-radius: 100px;
    color: #ffffff;
    text-decoration: none;
    padding: 20px;
    font-weight: bold;
  }

  /* cards "your impact" */
  /* grid overrides flex fallback in modern browsers */
  .card-wrapper {
    display: flex;
    display: grid;
    grid-template-columns: repeat(3, 30%);
    grid-gap: 20px;
    flex-direction: row;
    place-content: space-evenly;
    flex-basis: 30%;
  }

  @media screen and (max-width: $maxmobile) {
    .card-wrapper {
      grid-template-columns: 1fr;
    }
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    padding: 20px 20px 0 20px;
    border-radius: 25%;
    color: #ffffff;
    font-size: 25px;

    & h3 {
      font-size: 88px;
      margin: 0;
    }

    & img {
      max-width: 90%;
      width: 300px;
      height: auto;
    }

    & > div {
      position: relative;
    }

    &:nth-child(1) {
      background-color: $planted-green;
    }

    &:nth-child(2) {
      background-color: $planted-orange;
    }

    &:nth-child(3) {
      background-color: $planted-pink;
    }
  }

  /* grid / flex override float fallback in modern browsers */
  .facts-container {
    display: flex;
    margin: 0 auto;
    width: 80%;
    background-color: $planted-orange;
    border-radius: 50px;
    align-items: center;

    & .earth {
      float: left;
      padding: 20px;

      & img {
        width: 250px;
        height: auto;
      }
    }

    & .fact {
      color: #ffffff;
      font-size: 45px;
    }
  }

  /* self clearing after float fallback */
  &::after {
    content: "";
    display: block;
    clear: both;
  }
}
</style>
