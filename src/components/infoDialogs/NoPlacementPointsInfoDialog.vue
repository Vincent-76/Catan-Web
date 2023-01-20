<template>
  <p>{{ `The aren't any more possible placement points for structure ${structure} to build more.` }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"

export default defineComponent({
  name: "NoPlacementPointsInfoDialog",
  props: {
    info: {
      required: true
    }
  },
  data() {
    return {
      store
    }
  },
  computed: {
    i():any {
      return this.info
    },
    structure():string {
      return this.i.structure
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>