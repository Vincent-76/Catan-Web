<template>
  <div id="robberStealAction">
    <p>Select Player to steal from:</p>
    <div>
      <CommandButton v-for="p in adjacentPlayers" :key="p.id.id" command="robberSteal" :data="JSON.stringify( p.id )">
        {{ p.name }}
      </CommandButton>
    </div>
    <p></p>
  </div>
  <CommandButton command="robberSteal" data="PlayerID" />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/util/CommandButton.vue";
import {ClassicPlayer, PlayerID} from "@/model/game_data";

export default defineComponent({
  name: "RobberStealAction",
  components: {
    CommandButton
  },
  data() {
    return {
      store
    }
  },
  computed: {
    adjacentPlayerIDs():PlayerID[] {
      return this.store.gameData?.game.state.adjacentPlayers ?? []
    },
    adjacentPlayers():ClassicPlayer[] {
      return this.adjacentPlayerIDs.map( p =>
          this.store.gameData?.game.players.find( e => e.k.id == p.id )?.v
      ).filter( p => p !== undefined ) as ClassicPlayer[]
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #robberStealAction {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  p {
    font-weight: bold;
    font-size: 1.2em;
    color: white;
  }
</style>