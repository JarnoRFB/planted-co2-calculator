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

  <el-progress :percentage="100" status="warning"></el-progress>

  <div id="total-emissions">Gesamt <span v-html="formatEmissions(totalEmissions)"></span></div>
  <div id="questions">
    <div id="flying" class="topic">
      <h2>Flüge</h2>
      <p class="question">Wie oft bist du letztes Jahr geflogen?</p>
      <div class="options">
        <el-input-number
          id="nShortHauls-option"
          v-model="flying.nShortHauls"
          :min="0"
          :label="'Kurzstreckenflüge'"
        ></el-input-number>
        <span>Kurzstreckenflüge</span>
        <br />

        <el-input-number
          id="nMediumHauls-option"
          v-model="flying.nMediumHauls"
          :min="0"
          :label="'Mittelstreckenflüge'"
        ></el-input-number>

        <span>Mittelstreckenflüge</span>

        <br />
        <el-input-number
          id="nLongHauls-option"
          v-model="flying.nLongHauls"
          :min="0"
          :label="'Langstreckenflüge'"
        ></el-input-number>

        <span>Langstreckenflüge</span>
      </div>
      <div class="emissions" v-html="formatEmissions(flyingEmissions.estimatedEmissions)"></div>
      <source-citation-list :sources="flyingEmissions.sources" />
    </div>

    <div id="nutrition" class="topic">
      <h2>Ernährung</h2>
      <p class="question">Wie ernährst Du Dich?</p>
      <div class="options">
        <el-select v-model="nutrition.diet">
          <el-option
            v-for="item in nutritionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

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
        <el-input-number
          v-model.number="driving.weeklyAverageDistance"
          id="driving-option"
          :min="0"
          :label="'Kilometer in der Woche'"
        ></el-input-number>

        <span>Kilometer in der Woche</span>
        <div class="emissions" v-html="formatEmissions(drivingEmissions.estimatedEmissions)"></div>
        <source-citation-list :sources="drivingEmissions.sources" />
      </div>
    </div>

    <div id="heating" class="topic">
      <h2>Heizung</h2>
      <p class="question">Wie heizt du?</p>
      <div class="options">
        <el-input-number
          v-model.number="housing.householdSize"
          id="housing-household-size-option"
          :min="1"
          :label="'Personen im Haushalt'"
        />
        <span>Personen im Haushalt</span>
        <br />

        <el-input-number
          v-model.number="housing.apartmentSize"
          id="housing-apartment-size-option"
          :min="0"
          :label="'Wohnfläche'"
        />
        <span>Wohnfläche</span>
        <br />

        <el-input-number
          v-model.number="housing.apartmentAge"
          id="housing-apartment-age-option"
          :min="1900"
          :max="2021"
          :label="'Baujahr'"
        />
        <span>Baujahr</span>
        <br />

        <el-select v-model="heating.energySource">
          <el-option
            v-for="item in energySourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="emissions" v-html="formatEmissions(heatingEmissions.estimatedEmissions)"></div>
      <source-citation-list :sources="heatingEmissions.sources" />
    </div>

    <div id="electricity" class="topic">
      <h2>Strom</h2>
      <p class="question">Wie beziehst du Elektrizität?</p>
      <div class="options">
        <br />

        <el-checkbox v-model="electricity.greenEnergy" id="electricity-green-energy-option"
          >Ökostrom</el-checkbox
        >
        <br />

        <el-select v-model="housing.housing" id="housing-housing-option">
          <el-option
            v-for="item in housingOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
        <el-select v-model="consumerism.intensity">
          <el-option
            v-for="item in consumerismOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      energySourceOptions: [
        {
          value: "oil",
          label: "Heizöl",
        },
        {
          value: "naturalGas",
          label: "Gas",
        },
        {
          value: "longDistanceHeating",
          label: "Fernwärme",
        },
        {
          value: "heatingPump",
          label: "Heizpumpe",
        },
        {
          value: "woodPellets",
          label: "Holzpellets",
        },
      ],
      housingOptions: [
        {
          value: "house",
          label: "Haus",
        },
        {
          value: "apartment",
          label: "Wohnung",
        },
      ],
      consumerismOptions: [
        {
          value: "frugal",
          label: "sparsam",
        },
        {
          value: "normal",
          label: "normal",
        },
        {
          value: "lush",
          label: "viel",
        },
      ],
      nutritionOptions: [
        {
          value: "CARNIVORE",
          label: "fleischreich",
        },
        {
          value: "FLEXITARIAN",
          label: "flexitarisch",
        },
        {
          value: "VEGETARIAN",
          label: "vegetarisch",
        },
        {
          value: "VEGAN",
          label: "vegan",
        },
      ],

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
      housing: {
        householdSize: 1,
        apartmentSize: 200,
        apartmentAge: 1960,
        housing: "house",
      },
      heating: {
        energySource: "oil",
      } as heating.HeatingEstimationParams,
      electricity: {
        greenEnergy: false,
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
      return heating.estimateEmissions({...this.housing, ...this.heating})
    },
    electricityEmissions(): EstimationResponse {
      return electricity.estimateEmissions({...this.housing, ...this.electricity})
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
