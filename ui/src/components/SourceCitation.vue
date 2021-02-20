<template>
  <div class="source-citation">
    <el-divider v-if="index > 0"></el-divider>
    <p>
      {{ description.german.title }}
      <el-tooltip
        v-if="valid"
        class="item"
        content="Diese Quelle ist auf dem neusten Stand."
        placement="right"
        effect="light"
        ><span>✅</span>
      </el-tooltip>
      <el-tooltip
        v-else
        class="item"
        content="Diese Quelle ist nicht mehr auf dem neusten Stand."
        placement="right"
        effect="light"
        ><span>❌</span>
      </el-tooltip>
    </p>
    <p v-if="value">Wert: <span v-html="jsonValue"></span></p>
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
        return `<pre><code>${JSON.stringify(this.value, null, 2)}</code></pre>`
        // return JSON.stringify(this.value, null, 2)
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
