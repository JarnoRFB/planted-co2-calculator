<template>
  <div class="header">
    <h1 class="title">
      <a href="https://planted.green">
        <img src="@/assets/Planted_Logo_Sand.png" loading="eager" alt="" />
      </a>
      <span v-html="t('co2Calculator')" />
    </h1>
    <div id="introduction">
      <span v-html="t('introduction')"></span>
    </div>
  </div>
  <div class="total">
    <el-progress
      :text-inside="true"
      :show-text="true"
      :stroke-width="50"
      :percentage="percentageOfReferenceEmissions"
      :color="colorGradient"
    >
      <b> <span v-html="formatEmissions(totalEmissions)"> </span> </b>&nbsp;&nbsp;
    </el-progress>
  </div>

  <div id="questions">
    <div id="flying" class="topic">
      <el-divider>✈️</el-divider>
      <p class="question">{{ t("questionFlying") }}</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item :label="t('shortHauls')">
            <el-input-number
              id="nShortHauls-option"
              v-model="flying.nShortHauls"
              :min="0"
              :label="t('shortHauls')"
            ></el-input-number>
          </el-form-item>
          <el-form-item :label="t('mediumHauls')">
            <el-input-number
              id="nMediumHauls-option"
              v-model="flying.nMediumHauls"
              :min="0"
              :label="t('mediumHauls')"
            ></el-input-number>
          </el-form-item>
          <el-form-item :label="t('longHauls')">
            <el-input-number
              id="nLongHauls-option"
              v-model="flying.nLongHauls"
              :min="0"
              :label="t('mediumHauls')"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display
        ><span v-html="formatEmissions(flyingEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="flyingEmissions.sources" />
    </div>

    <div id="driving" class="topic">
      <el-divider>🚗</el-divider>
      <p class="question">{{ t("drivingQuestion") }}</p>
      <div class="options">
        <el-form :labelPosition="labelPosition" label-width="auto">
          <el-form-item :label="t('kilometersPerWeek')">
            <el-input-number
              v-model.number="driving.weeklyAverageDistance"
              id="driving-option"
              :min="0"
              :step="10"
              :label="t('kilometersPerWeek')"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display>
        <span v-html="formatEmissions(drivingEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="drivingEmissions.sources" />
    </div>

    <div id="housing" class="topic">
      <el-divider>🏠</el-divider>
      <p class="question">{{ t("housingQuestion") }}</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item :label="t('householdSize')">
            <el-input-number
              v-model.number="housing.householdSize"
              id="housing-household-size-option"
              :min="1"
              :label="t('householdSize')"
            />
          </el-form-item>
          <el-form-item :label="t('apartmentSize')">
            <el-input-number
              v-model.number="housing.apartmentSize"
              id="housing-apartment-size-option"
              :min="0"
              :step="10"
              :label="t('apartmentSize')"
            />
          </el-form-item>
          <el-form-item :label="t('apartmentAge')">
            <el-input-number
              v-model.number="housing.apartmentAge"
              id="housing-apartment-age-option"
              :min="1900"
              :max="2021"
              :step="10"
              :label="t('apartmentAge')"
            />
          </el-form-item>

          <el-form-item :label="t('housing.type')">
            <el-select v-model="housing.housing" id="housing-housing-option">
              <el-option
                v-for="item in housingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('energySource')">
            <el-select v-model="heating.energySource">
              <el-option
                v-for="item in energySourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('greenEnergy')">
            <el-switch v-model="electricity.greenEnergy" id="electricity-green-energy-option2">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <intermediate-emission-display>
        <span v-html="formatEmissions(housingEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="housingEmissions.sources" />
    </div>

    <div id="nutrition" class="topic">
      <el-divider>🍜</el-divider>

      <p class="question">{{ t("nutritionQuestion") }}</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item>
            <el-select v-model="nutrition.diet">
              <el-option
                v-for="item in nutritionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display>
        <span v-html="formatEmissions(nutritionEmissions.estimatedEmissions)"
      /></intermediate-emission-display>

      <source-citation-list :sources="nutritionEmissions.sources" />
    </div>

    <div id="consumerism" class="topic">
      <el-divider>🛍️</el-divider>
      <p class="question">{{ t("consumerismQuestion") }}</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item>
            <el-select v-model="consumerism.intensity">
              <el-option
                v-for="item in consumerismOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display>
        <span v-html="formatEmissions(consumerismEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="consumerismEmissions.sources" />
    </div>
  </div>
  <div id="result">
    <div
      id="summary"
      v-html="t('result', {totalEmissions: formatEmissions(totalEmissions), relationToAverage})"
    ></div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import {useI18n} from "vue-i18n"

import _ from "lodash"

import {EstimationResponse, Units} from "./lib/estimation"
// import * as base from "./estimation/base"
import * as flying from "./lib/estimation/flying"
import * as nutrition from "./lib/estimation/nutrition"
import * as driving from "./lib/estimation/driving"
import * as electricity from "./lib/estimation/electricity"
import * as heating from "./lib/estimation/heating"
import * as consumerism from "./lib/estimation/consumerism"

import SourceCitationList from "./components/SourceCitationList.vue"
import IntermediateEmissionDisplay from "./components/IntermediateEmissionDisplay.vue"

export default defineComponent({
  name: "App",
  setup() {
    const {t, n, locale} = useI18n({
      inheritLocale: true,
      useScope: "global",
      numberFormats: {
        en: {
          co2e: {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
        de: {
          co2e: {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        },
      },
    })

    locale.value = window.location.pathname.replace("/", "")
    return {t, n, locale}
  },
  mounted() {
    this.windowWidth = window.innerWidth
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth
    })
  },
  data() {
    return {
      windowWidth: 0,
      energySourceOptions: this.i18nOptions([
        "housing.options.oil",
        "housing.options.naturalGas",
        "housing.options.longDistanceHeating",
        "housing.options.heatingPump",
        "housing.options.woodPellets",
      ]),

      housingOptions: this.i18nOptions(["housing.options.house", "housing.options.apartment"]),
      consumerismOptions: this.i18nOptions([
        "consumerism.options.frugal",
        "consumerism.options.normal",
        "consumerism.options.lush",
      ]),
      nutritionOptions: this.i18nOptions([
        "nutrition.options.CARNIVORE",
        "nutrition.options.FLEXITARIAN",
        "nutrition.options.VEGETARIAN",
        "nutrition.options.VEGAN",
      ]),
      flying: {
        nShortHauls: 4,
        nMediumHauls: 2,
        nLongHauls: 2,
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
        apartmentAge: 1990,
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
      referenceEmissions: 22_211,
      referenceAverageEmissions: 11_170,
      // Styling.
      colorGradient: [
        "#B4FA64",
        "#B8F260",
        "#BCEA5C",
        "#C0E258",
        "#C4DA54",
        "#C8D350",
        "#CCCB4C",
        "#D0C348",
        "#D4BB44",
        "#D8B340",
        "#DBAB3D",
        "#DFA339",
        "#E39B35",
        "#E79331",
        "#EB8B2D",
        "#EF8429",
        "#F37C25",
        "#F77421",
        "#FB6C1D",
        "#FF6419",
      ],
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
    housingEmissions(): EstimationResponse {
      return {
        estimatedEmissions:
          this.heatingEmissions.estimatedEmissions + this.electricityEmissions.estimatedEmissions,
        unit: Units.KG_CO2E_PER_YEAR,
        sources: this.heatingEmissions.sources.concat(this.electricityEmissions.sources),
      }
    },
    consumerismEmissions(): EstimationResponse {
      return consumerism.estimateEmissions(this.consumerism)
    },
    percentageOfReferenceEmissions(): number {
      return _.clamp((this.totalEmissions / this.referenceEmissions) * 100, 0, 100)
    },
    percentageOfReferenceAverageEmissions(): number {
      return (this.totalEmissions / this.referenceAverageEmissions) * 100
    },
    relationToAverage(): string {
      if (this.percentageOfReferenceAverageEmissions < 65) {
        return this.t("relation.farBelow")
      } else if (this.percentageOfReferenceAverageEmissions < 100) {
        return this.t("relation.below")
      } else if (
        this.percentageOfReferenceAverageEmissions >= 100 &&
        this.percentageOfReferenceAverageEmissions < 150
      ) {
        return this.t("relation.above")
      } else {
        return this.t("relation.farAbove")
      }
    },
    labelPosition(): string {
      return this.windowWidth > 800 ? "right" : "top"
    },
  },
  methods: {
    formatEmissions(emissions) {
      return `${this.n(emissions / 1000, "co2e")} ${this.t("tonsCarbon")}`
    },
    i18nOptions(options) {
      return options.map(opt => ({value: opt.split(".").pop(), label: this.t(opt)}))
    },
  },
  components: {
    SourceCitationList,
    IntermediateEmissionDisplay,
  },
})
</script>

<style lang="scss">
$font-size-1: 2em;
$font-size-2: 1.4em;
$font-size-3: 1.1em;
$color: #2c3e50;
$background-color: rgb(35, 45, 50);
$font-color: #d2c8be;
$planted-lime: #b4fa64;

body {
  background-color: $background-color;
}

a {
  color: $planted-lime;
  text-decoration: none;
}

@mixin center {
  margin: auto;
  width: 75%;
}
html {
  box-sizing: border-box;
}
* {
  box-sizing: inherit;
}
*:before {
  box-sizing: inherit;
}
*:after {
  box-sizing: inherit;
}
body {
  margin-top: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $font-color;
  margin: 0 10px;
}

@media screen and (min-width: 1100px) {
  #app {
    width: 1100px;
    margin: 10px auto;
  }
}

.title {
  div {
    display: inline;
  }
}
.header {
  h1 {
    display: inline;
    vertical-align: middle;
  }
  img {
    display: inline;
    height: 4ex;
    vertical-align: middle;
  }
  text-align: center;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 2%;
  padding-bottom: 0;

  background-color: $background-color;

  // top left corner should start at topmost spot
  top: 0;

  // take up the full browser width
  width: 100%;
}
.question {
  font-size: $font-size-1;
  font-weight: 700;
  margin-left: 2%;
  margin-right: 2%;

  margin-top: 4%;
  margin-bottom: 4%;
}
.el-collapse {
  margin-left: 2%;
  margin-right: 2%;
}
.total {
  background-color: $background-color;
  padding-top: 5%;
  padding-bottom: 2%;

  position: sticky;
  // take up the full browser width
  width: 100%;

  // high z index so other content scrolls underneath
  z-index: 200;
  top: 0;
}
.options {
  @include center;
  text-align: center;
}

@mixin text-block {
  text-align: justify;
  font-size: $font-size-2;
  margin: 1% auto;
}
#introduction {
  @include text-block;
}
#result {
  @include text-block;
  margin: 5% auto;
}
</style>
