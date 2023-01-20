<template>
  <p>{{ `${dices[0]} + ${dices[1]} = ${dices[0] + dices[1]}` }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "DiceInfoDialog",
  props: {
    info: {
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    i():any {
      return this.info
    },
    dices():[number, number] {
      return this.i.dices
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>