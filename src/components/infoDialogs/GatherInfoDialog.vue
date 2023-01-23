<template>
  <p class="dialogText">{{ `${dices[0]} + ${dices[1]} = ${dices[0] + dices[1]}` }}</p>
  <br />
  <p v-for="(e, i) in playerResources" :key="i" class="dialogText">
    {{ `${playerName(e.k)} ${resources(e.v)}` }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import {JMap, PlayerID} from "@/model/game_data";
import {resourcesString} from "@/util/util";

export default defineComponent({
  name: "GatherInfoDialog",
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
    dices():[number, number] {
      return this.i.dices
    },
    playerResources():JMap<PlayerID, JMap<string, number>> {
      return this.i.playerResources
    }
  },
  methods: {
    playerName( id:PlayerID ):string {
      return this.store.gameData?.game.players.find( e => e.k.id === id.id )?.v.name ?? "?"
    },
    resources( r:JMap<string, number> ):string {
      return resourcesString( "+", r )
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>