<template>
  <div id="playerTradeEnd">
    <p>Trade Players:</p>
    <div v-for="p in tradePlayers" :key="p.id.id">
      <CommandButton command="playerTrade" :data="JSON.stringify( p.id )" :class="tradePlayerTextColorClass( p )">
        {{ p.name }}
      </CommandButton>
    </div>
    <CommandButton command="abortPlayerTrade">Abort</CommandButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/util/CommandButton.vue";
import {ClassicPlayer, JMap, PlayerID} from "@/model/game_data";
import {pTextColorClass} from "@/util/util";

export default defineComponent({
  name: "PlayerTradeEndAction",
  components: {
    CommandButton
  },
  data() {
    return {
      store
    }
  },
  computed: {
    decisions():JMap<PlayerID, boolean> {
      return this.store.gameData?.game.state.decisions
    },
    tradePlayers():ClassicPlayer[] {
      return this.decisions.filter( e => e.v ).map( e =>
          this.store.gameData?.game.players.find( p => p.k.id == e.k.id )?.v
      ).filter( p => p !== undefined ) as ClassicPlayer[]
    }
  },
  methods: {
    tradePlayerTextColorClass( p:ClassicPlayer ):string {
      return pTextColorClass( p.color )
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #playerTradeEnd {
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