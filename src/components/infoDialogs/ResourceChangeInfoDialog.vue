<template>
  <p v-for="(e, i) in playerAdd" :key="i" class="dialogText">
    {{ `${playerNameFormatted( e.k )} ${resources( "+", e.v )}` }}
  </p>
  <br />
  <p v-for="(e, i) in playerSub" :key="i" class="dialogText">
    {{ `${playerNameFormatted( e.k )} ${resources( "-", e.v )}` }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import {JMap, PlayerID} from "@/model/game_data";
import {resourcesString, toLength} from "@/util/util";

export default defineComponent({
  name: "ResourceChangeInfoDialog",
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
    playerAdd():JMap<PlayerID, JMap<string, number>> {
      return this.i.playerAdd
    },
    playerSub():JMap<PlayerID, JMap<string, number>> {
      return this.i.playerSub
    },
    nameLength():number {
      return Math.max(
          ...this.playerAdd.map( e => this.playerName( e.k ).length ),
          ...this.playerSub.map( e => this.playerName( e.k ).length )
      )
    }
  },
  methods: {
    playerName( id:PlayerID ):string {
      return this.store.gameData?.game.players.find( e => e.k.id === id.id )?.v.name ?? "?"
    },
    playerNameFormatted( id:PlayerID ):string {
      return toLength( this.playerName( id ), this.nameLength )
    },
    resources( prefix:string, r:JMap<string, number> ) {
      return resourcesString( prefix, r )
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>