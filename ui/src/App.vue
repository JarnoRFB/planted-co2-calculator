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

  <div id="total-emissions">Gesamt <span v-html="formatEmissions(totalEmissions)"></span></div>
  <div id="questions">
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
      <div class="emissions" v-html="formatEmissions(flyingEmissions.estimatedEmissions)"></div>
      <source-citation-list :sources="flyingEmissions.sources" />
    </div>

    <div id="nutrition" class="topic">
      <h2>Ernährung</h2>
      <p class="question">Wie ernährst Du Dich?</p>
      <div class="options">
        <select v-model="nutrition.diet">
          <option value="CARNIVORE">fleischreich</option>
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

    <div id="driving" class="topic">
      <h2>Mobilität</h2>
      <p class="question">Wie viele Kilometer fährst Du im Durchschnitt pro Woche?</p>
      <div class="options">
        <input v-model.number="driving.weeklyAverageDistance" type="number" id="driving-option" />
        <label for="driving-option">Kilometer in der Woche</label>
        <div class="emissions" v-html="formatEmissions(drivingEmissions.estimatedEmissions)"></div>
        <source-citation-list :sources="drivingEmissions.sources" />
      </div>
    </div>

    <div id="heating" class="topic">
      <h2>Heizung</h2>
      <p class="question">Wie heizt du?</p>
      <div class="options">
        <input
          v-model.number="heating.householdSize"
          type="number"
          id="heating-household-size-option"
        />
        <label for="heating-household-size-option">Personen im Haushalt</label>
        <br />

        <input
          v-model.number="heating.apartmentSize"
          type="number"
          id="heating-apartment-size-option"
        />
        <label for="heating-apartment-age-option">Wohnfläche</label>
        <br />

        <input
          v-model.number="heating.apartmentAge"
          type="number"
          id="heating-apartment-age-option"
          min="1900"
          max="2021"
        />
        <label for="heating-apartment-age-option">Baujahr</label>
        <br />

        <select v-model="heating.energySource">
          <option value="oil">Heizöl</option>
          <option value="naturalGas">Gas</option>
          <option value="longDistanceHeating">Fernwärme</option>
          <option value="heatingPump">Heizpumpe</option>
          <option value="woodPellets">Holzpellets</option>
        </select>
      </div>
      <div class="emissions" v-html="formatEmissions(heatingEmissions.estimatedEmissions)"></div>
      <source-citation-list :sources="heatingEmissions.sources" />
    </div>

    <div id="electricity" class="topic">
      <h2>Strom</h2>
      <p class="question">Wie beziehst du Elektrizität?</p>
      <div class="options">
        <input
          v-model.number="electricity.householdSize"
          type="number"
          id="electricity-household-size-option"
        />
        <label for="electricity-household-size-option">Personen im Haushalt</label>
        <br />

        <input
          v-model="electricity.greenEnergy"
          type="checkbox"
          id="electricity-green-energy-option"
        />
        <label for="electricity-green-energy-option">Ökostrom</label>
        <br />

        <select v-model="electricity.housing" id="electricity-housing-option">
          <option value="house">Haus</option>
          <option value="apartment">Wohnung</option>
        </select>
        <label for="electricity-green-energy-option">Haushalt</label>
      </div>
      <div
        class="emissions"
        v-html="formatEmissions(electricityEmissions.estimatedEmissions)"
      ></div>
      <source-citation-list :sources="electricityEmissions.sources" />
    </div>

    <div id="consumerism" class="topic">
      <h2>Konsum</h2>
      <p class="question">Wie viel konsumierst du?</p>
      <div class="options">
        <select v-model="consumerism.intensity">
          <option value="frugal">sparsam</option>
          <option value="normal">normal</option>
          <option value="lush">viel</option>
        </select>
        <div
          class="emissions"
          v-html="formatEmissions(consumerismEmissions.estimatedEmissions)"
        ></div>
        <source-citation-list :sources="consumerismEmissions.sources" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import _ from "lodash"

import {EstimationResponse} from "./lib/estimation"
// import * as base from "./estimation/base"
import * as flying from "./lib/estimation/flying"
import * as nutrition from "./lib/estimation/nutrition"
import * as driving from "./lib/estimation/driving"
import * as electricity from "./lib/estimation/electricity"
import * as heating from "./lib/estimation/heating"
import * as consumerism from "./lib/estimation/consumerism"

import SourceCitationList from "./components/SourceCitationList.vue"
import {formatEmissions} from "./lib/utils"

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
      driving: {
        weeklyAverageDistance: 200,
      },
      heating: {
        householdSize: 1,
        apartmentSize: 200,
        apartmentAge: 1960,
        energySource: "oil",
      } as heating.HeatingEstimationParams,
      electricity: {
        householdSize: 1,
        greenEnergy: false,
        housing: "house",
      } as electricity.ElectricityEstimationParams,
      consumerism: {
        country: "Germany",
        intensity: "lush",
      } as consumerism.ConsumerismEstimationParams,
    }
  },
  computed: {
    totalEmissions(): number {
      return _.sum([
        this.flyingEmissions.estimatedEmissions,
        this.nutritionEmissions.estimatedEmissions,
        this.drivingEmissions.estimatedEmissions,
        this.heatingEmissions.estimatedEmissions,
        this.electricityEmissions.estimatedEmissions,
        this.consumerismEmissions.estimatedEmissions,
      ])
    },
    flyingEmissions(): EstimationResponse {
      return flying.estimateEmissions(this.flying)
    },
    nutritionEmissions(): EstimationResponse {
      return nutrition.estimateEmissions(this.nutrition)
    },
    drivingEmissions(): EstimationResponse {
      return driving.estimateEmissions(this.driving)
    },
    heatingEmissions(): EstimationResponse {
      return heating.estimateEmissions(this.heating)
    },
    electricityEmissions(): EstimationResponse {
      return electricity.estimateEmissions(this.electricity)
    },
    consumerismEmissions(): EstimationResponse {
      return consumerism.estimateEmissions(this.consumerism)
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
  h1
    display: inline-block
</style>
