<template>
  <div>
    <p>Quellen</p>
    <ol>
      <source-citation
        v-for="s in sources"
        :value="s.value"
        :description="s.description"
        :url="s.url"
        :key="s.id"
      />
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { SourceSchema } from "../lib/estimation/sources"
import SourceCitation from "./SourceCitation.vue"
export default defineComponent({
  name: "SourceCitationList",
  props: {
    sources: {
      type: Object as PropType<Array<SourceSchema<any>>>,
      required: true,
    },
  },
  components: { SourceCitation },
})
</script>

<style scoped lang="sass"></style>
