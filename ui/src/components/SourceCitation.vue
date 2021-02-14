<template>
  <div class="source-citation">
    <el-divider v-if="index > 0"></el-divider>
    <p>{{ description.german.title }} <span v-if="valid">✅</span><span v-else>❌</span></p>
    <p>Wert <span v-html="jsonValue"></span></p>
    <p>
      Siehe <a :href="url">{{ url }}</a>
    </p>
  </div>
</template>

<script lang="ts">
import {LocalizedDescription} from "@/lib/estimation/sources"
import {defineComponent, PropType} from "vue"

export default defineComponent({
  name: "SourceCitation",
  props: {
    value: null,
    description: {type: Object as PropType<LocalizedDescription>},
    url: String,
    valid: Boolean,
    index: Number,
  },
  computed: {
    jsonValue(): any {
      if (typeof this.value === "object") {
        return `<code>${JSON.stringify(this.value, null, 2)}</code>`
      } else {
        return this.value
      }
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
.source-citation
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: left
</style>
