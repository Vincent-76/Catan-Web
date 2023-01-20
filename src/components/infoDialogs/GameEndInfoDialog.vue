<template>
  <p>{{ `${winnerName} won the game!` }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"

export default defineComponent({
  name: "GameEndInfoDialog",
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
    winnerName():string {
      return this.store.gameData?.game.players.find( e => e.k.id === this.i.winner.id )?.v.name ?? "?"
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>