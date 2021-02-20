<template>
  <div>
    <el-collapse>
      <el-collapse-item title="Quellen">
        <ol>
          <source-citation
            v-for="(s, index) in sources"
            :value="s.value"
            :description="s.description"
            :url="s.url.toString()"
            :valid="s.valid"
            :key="s.id"
            :index="index"
            :publicationMetadata="s.publicationMetadata"
          />
        </ol>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue"
import {SourceSchema} from "../lib/estimation/sources"
import SourceCitation from "./SourceCitation.vue"
export default defineComponent({
  name: "SourceCitationList",
  props: {
    sources: {
      type: Object as PropType<Array<SourceSchema<any>>>,
      required: true,
    },
  },
  components: {SourceCitation},
})
</script>

<style scoped lang="sass"></style>
