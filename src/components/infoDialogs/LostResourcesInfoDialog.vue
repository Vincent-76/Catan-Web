<template>
  <p>{{ `${playerName( pID )} ${resources}` }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import {JMap, PlayerID} from "@/model/game_data";
import {resourcesString} from "@/util/util";

export default defineComponent({
  name: "LostResourcesInfoDialog",
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
    pID():PlayerID {
      return this.i.pID
    },
    resources():string {
      return resourcesString( "-", this.i.cards )
    }
  },
  methods: {
    playerName( id:PlayerID ):string {
      return this.store.gameData?.game.players.find( e => e.k.id === id.id )?.v.name ?? "?"
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>