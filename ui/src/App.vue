<template>
  <div class="header">
    <h1>
      <img
        src="https://uploads-ssl.webflow.com/5fc25896c145ac50c7d2af7b/5fd092f58ae2717a5d82e8a7_PLANTED_LOGO_WORTBILDMARKE.svg"
        loading="eager"
        alt=""
      />
      C0<sub>2</sub> Recher
    </h1>
  </div>

  <div id="total-emissions">
    Gesamt <span v-html="formatEmissions(totalEmissions)"></span>
  </div>

  <div id="flying" class="topic">
    <h2>Flüge</h2>
    <p class="question">Wie oft bist du letztes Jahr geflogen?</p>
    <div class="options">
      <input
        v-model.number="flying.nShortHauls"
        type="number"
        name="nShortHauls"
        id="nShortHauls-option"
      />
      <label for="nShortHauls-option">Kurzstreckenflüge</label>
      <br />
      <input
        v-model.number="flying.nMediumHauls"
        type="number"
        name="nMediumHauls"
        id="nMediumHauls-option"
      />
      <label for="nMediumHauls-option">Mittelstreckenflüge</label>
      <br />
      <input
        v-model.number="flying.nLongHauls"
        type="number"
        name="nLongHauls"
        id="nLongHauls-option"
      />
      <label for="nLongHauls-option">Langstreckenflüge</label>
    </div>
    <div
      class="emissions"
      v-html="formatEmissions(flyingEmissions.estimatedEmissions)"
    ></div>
    <source-citation-list :sources="flyingEmissions.sources" />
  </div>

  <div id="nutrition" class="topic">
    <h2>Ernährung</h2>
    <p class="question">Wie ernährst Du Dich?</p>
    <div class="options">
      <select v-model="nutrition.diet">
        <option value="CARNIVORE">fleischhaltig</option>
        <option value="FLEXITARIAN">flexitarisch</option>
        <option value="VEGETARIAN">vegetarisch</option>
        <option value="VEGAN">vegan</option>
      </select>
      <div
        class="emissions"
        v-html="formatEmissions(nutritionEmissions.estimatedEmissions)"
      ></div>
      <source-citation-list :sources="nutritionEmissions.sources" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { EstimationResponse } from "./lib/estimation"
// import * as base from "./estimation/base"
import * as flying from "./lib/estimation/flying"
import * as nutrition from "./lib/estimation/nutrition"
// import * as driving from "./estimation/driving"
// import * as electricity from "./estimation/electricity"
// import * as heating from "./estimation/heating"
// import * as consumerism from "./estimation/consumerism"

import SourceCitationList from "./components/SourceCitationList.vue"
import NutritionEstimation from "./components/NutritionEstimation.vue"
import { formatEmissions } from "./lib/utils"

export default defineComponent({
  name: "App",
  data() {
    return {
      flying: {
        nShortHauls: 1,
        nMediumHauls: 2,
        nLongHauls: 3,
      },
      nutrition: {
        diet: "CARNIVORE",
      },
    }
  },
  computed: {
    totalEmissions(): number {
      return (
        this.flyingEmissions.estimatedEmissions +
        this.nutritionEmissions.estimatedEmissions
      )
    },
    flyingEmissions(): EstimationResponse {
      return flying.estimateEmissions(this.flying)
    },
    nutritionEmissions(): EstimationResponse {
      return nutrition.estimateEmissions(this.nutrition)
    },
  },
  methods: {
    formatEmissions,
  },
  components: {
    SourceCitationList,
  },
})
</script>

<style lang="sass">
#app
  $color: #2c3e50
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: $color
  margin-top: 60px
.header
  img
  h1
    display: inline-block
</style>
