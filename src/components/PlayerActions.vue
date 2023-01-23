<template>
  <div id="playerActions">
    <div v-if="isStateTurn( 'ActionState' )">
      <BuildButtonAction />
      <BankTradeButtonAction />
      <SetPlayerTradeButtonAction />
      <CommandButton command="buyDevCard">Buy Development Card</CommandButton>
      <CommandButton command="endTurn">End Turn</CommandButton>
    </div>
    <div v-else-if="isStateTurn( 'BuildState' )">
      <CommandButton command="undo">Cancel</CommandButton>
    </div>
    <div v-else-if="isStateTurn( 'DiceState' )">
      <CommandButton id="rollTheDices" command="rollTheDices">
        <img :src="require( '@/assets/images/dices.png' )" alt="Roll The Dices" />
      </CommandButton>
    </div>
    <DropHandCardsAction v-else-if="dropHandCardsState" />
    <MonopolyAction v-else-if="isStateTurn( 'MonopolyState' )" />
    <PlayerTradeEndAction v-else-if="isStateTurn( 'PlayerTradeEndState' )" />
    <PlayerTradeAction v-else-if="playerTradeState" />
    <RobberStealAction v-else-if="isStateTurn( 'RobberStealState' )" />
    <YearOfPlentyAction v-else-if="isStateTurn( 'YearOfPlentyState' )" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/util/CommandButton.vue";
import BuildButtonAction from "@/components/actionButtons/BuildButtonAction.vue";
import BankTradeButtonAction from "@/components/actionButtons/BankTradeButtonAction.vue";
import SetPlayerTradeButtonAction from "@/components/actionButtons/SetPlayerTradeButtonAction.vue";
import DropHandCardsAction from "@/components/actionButtons/DropHandCardsAction.vue";
import MonopolyAction from "@/components/actionButtons/MonopolyAction.vue";
import PlayerTradeEndAction from "@/components/actionButtons/PlayerTradeEndAction.vue";
import PlayerTradeAction from "@/components/actionButtons/PlayerTradeAction.vue";
import RobberStealAction from "@/components/actionButtons/RobberStealAction.vue";
import YearOfPlentyAction from "@/components/actionButtons/YearOfPlentyAction.vue";

export default defineComponent({
  name: "PlayerActions",
  components: {
    YearOfPlentyAction,
    RobberStealAction,
    PlayerTradeAction,
    PlayerTradeEndAction,
    MonopolyAction,
    DropHandCardsAction,
    SetPlayerTradeButtonAction,
    BankTradeButtonAction,
    BuildButtonAction,
    CommandButton
  },
  data() {
    return {
      store
    }
  },
  computed: {
    dropHandCardsState():boolean {
      return this.isState( "DropHandCardsState" )
          && this.store.hasGame()
          && this.store.gameData?.game.state.pID.id === this.store.gameData?.playerID?.id
    },
    playerTradeState():boolean {
      return this.isState( "PlayerTradeState" )
          && this.store.hasGame()
          && this.store.gameData?.game.state.pID.id === this.store.gameData?.playerID?.id
    }
  },
  methods: {
    isState( state:string ):boolean {
      return this.store.gameData?.game.state.class === state
    },
    isStateTurn( state:string ):boolean {
      return this.store.onTurn() && this.isState( state )
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #playerActions {
    width: 100%;
    flex-grow: 1;
    background-image: url( "~@/assets/images/stone_background.jpg" );
    background-position: center;
    background-size: 430px;
    background-repeat: repeat;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    column-gap: 0.5rem;

    @media @portrait {
      flex-direction: row;
      height: 100%;
      width: auto;
    }

    /*> * {
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;

      &:first-child {
        margin-top: 0.5rem;
      }

      &:last-child {
        margin-bottom: 0.5rem;
      }
    }*/

    > div {
      width: 100%;

      > *:not(:first-child) {
        margin-top: 0.5rem !important;
      }
    }
  }

  #rollTheDices {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 80%;
      max-height: 80%;
      aspect-ratio: 1024 / 602;
    }
  }
</style>