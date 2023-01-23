<template>
  <p class="dialogText">{{ `Drawn ${devCard}` }}</p>
  <br />
  <p class="dialogText">{{ desc }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"

export default defineComponent({
  name: "DrawnDevCardInfoDialog",
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
    devCard():string {
      return this.i.devCard
    },
    desc():string {
      return this.store.gameData?.gameValues.devCards.find( e => e.k === this.devCard )?.v.desc ?? ""
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>