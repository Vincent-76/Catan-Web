<template>
  <p class="dialogText">{{ "You have built " + info.structure }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "BuiltInfoDialog",
  props: {
    info: {
      required: true
    }
  },
  data() {
    return {
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>