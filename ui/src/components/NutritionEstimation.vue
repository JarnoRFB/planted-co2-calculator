<template>
  <div id="nutrition" class="topic">
    <h2>Ernährung</h2>
    <p class="question">Wie ernährst Du Dich?</p>
    <div class="options">
      <select v-model="params.diet">
        <option value="CARNIVORE">fleischhaltig</option>
        <option value="FLEXITARIAN">flexitarisch</option>
        <option value="VEGETARIAN">vegetarisch</option>
        <option value="VEGAN">vegan</option>
      </select>
      <div
        class="emissions"
        v-html="formatEmissions(emissions.estimatedEmissions)"
      ></div>
      <source-citation-list :sources="emissions.sources" />
    </div>
  </div>
</template>

<script lang="ts">
import { EstimationResponse } from "../lib/estimation"
import { formatEmissions } from "../lib/utils"
import { defineComponent } from "vue"
import * as nutrition from "../lib/estimation/nutrition"
import SourceCitationList from "./SourceCitationList.vue"

export default defineComponent({
  name: "NutritionEstimation",
  data() {
    return {
      params: {
        diet: "CARNIVORE",
      },
    }
  },
  computed: {
    emissions(): EstimationResponse {
      return nutrition.estimateEmissions(this.params)
    },
  },
  watch: {
    emissions: function(val) {
      this.$emit("nutrtion-emissons-updated", val.estimatedEmissons)
    },
  },
  methods: {
    formatEmissions,
  },
  components: { SourceCitationList },
})
</script>

<style scoped lang="sass"></style>
