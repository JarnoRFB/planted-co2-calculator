<template>
  <div class="source-citation">
    <el-divider v-if="index > 0"></el-divider>
    <p v-if="publicationMetadata">
      <b>{{ publicationMetadata.author }} ({{ publicationMetadata.year }})</b>
    </p>
    <p>
      {{ description.english.title }}
      <el-tooltip
        class="item"
        :content="tooltipContent"
        placement="right"
        effect="light"
        :popper-options="popperOptions"
        :auto-close="1500"
        ><span v-if="valid">✅</span><span v-else>❌</span>
      </el-tooltip>
    </p>
    <p v-if="value">{{ t("value") }}: <span v-html="jsonValue"></span></p>
    <p>
      <a :href="url">{{ url }}</a>
    </p>
  </div>
</template>

<script lang="ts">
import {LocalizedDescription, PublicationMetadata} from "@/lib/estimation/sources"
import {defineComponent, PropType} from "vue"
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: "SourceCitation",
      setup() {
    const { t } = useI18n({
      inheritLocale: true,
      useScope: 'local'
    })
    return { t }
  },
  props: {
    value: null,
    description: {type: Object as PropType<LocalizedDescription>, required: true},
    url: String,
    valid: Boolean,
    index: Number,
    publicationMetadata: {type: Object as PropType<PublicationMetadata>},
  },
  data() {
    return {
      popperOptions: {boundariesElement: "scrollParent"},
    }
  },
  computed: {
    jsonValue(): any {
      if (typeof this.value === "object") {
        return `<pre><code>${JSON.stringify(this.value, null, 2)}</code></pre>`
      } else {
        return this.value
      }
    },
    tooltipContent(): string {
      return this.valid
        ? this.t("thisSourceIsValid")
        : this.t("thisSourceIsInvalid")
    },
  },
})
</script>

<style scoped lang="scss">
.source-citation {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
}
</style>

<i18n>
{
    "en": {
          "value": "Value",
          "thisSourceIsValid": "This source is up to date.",
          "thisSourceIsInvalid": "This source is no longer up to date.",
    },
    "de": {
          "value": "Wert",
          "thisSourceIsValid": "Diese Quelle ist auf dem neusten Stand.",
          "thisSourceIsInvalid": "Diese Quelle ist nicht mehr auf dem neusten Stand.",
    }
}
</i18n>