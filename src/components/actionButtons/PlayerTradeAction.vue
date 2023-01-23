<template>
  <div id="playerTradeAction">
    <div>
      <p :class="playerColorClass">{{ playerName }}</p>
      <p>{{ "wants to trade:" }}</p>
    </div>
    <div>
      <p>Give:</p>
      <p>{{ giveString }}</p>
    </div>
    <div>
      <p>Get:</p>
      <p>{{ getString }}</p>
    </div>
    <div>
      <CommandButton command="playerTradeDecision" data="true" class="submitButton">Accept</CommandButton>
      <CommandButton command="playerTradeDecision" data="false" class="submitButton">Decline</CommandButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/util/CommandButton.vue";
import {pTextColorClass, resourcesString} from "@/util/util";
import {ClassicPlayer} from "@/model/game_data";

export default defineComponent({
  name: "PlayerTradeAction",
  components: {
    CommandButton
  },
  data() {
    return {
      store
    }
  },
  computed: {
    state():any {
      return this.store.gameData?.game.state
    },
    giveString():string {
      return resourcesString( "", this.state.give )
    },
    getString():string {
      return resourcesString( "", this.state.get )
    },
    tradePlayer():ClassicPlayer | null {
      return this.store.gameData?.game.players.find( e =>
          e.k.id === this.store.gameData?.game.turn.playerID.id
      )?.v ?? null
    },
    playerName():string {
      console.log( this.state.pID.id )
      return this.tradePlayer?.name ?? "?"
    },
    playerColorClass():string {
      return pTextColorClass( this.tradePlayer?.color ?? "" )
    }
  },
  methods: {
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #playerTradeAction {
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

  .submitButton:not(:first-child) {
    margin-top: 0.5rem;
  }
</style>