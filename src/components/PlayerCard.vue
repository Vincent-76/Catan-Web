<template>
  <div class="playerCard">
    <div class="playerCardHeader">
      <div class="playerCardPoints" :class="borderColorClass">
        <p>{{ displayVictoryPoints }}</p>
      </div>
      <p class="playerCardName" :style="turnNameStyle">{{ p.name }}</p>
    </div>
    <div class="playerDisplayInfos">
      <div class="playerDisplayInfo">
        <div class="playerDisplayInfoLabel">Resources:</div>
        <div class="playerDisplayInfoValue">{{ resourcesAmount }}</div>
      </div>
      <div class="playerDisplayInfo">
        <div class="playerDisplayInfoLabel">Dev. Cards:</div>
        <div class="playerDisplayInfoValue">{{ p.devCards.length }}</div>
      </div>
      <div class="playerDisplayInfo">
        <div class="playerDisplayInfoLabel">Knights:</div>
        <div class="playerDisplayInfoValue">{{ knightsAmount }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store";
import {pBorderColorClass, playerDisplayVictoryPoints} from "@/util/util";
import {ClassicPlayer} from "@/model/game_data";
import { Vue } from "vue-class-component";

/*class Props {
  player!:ClassicPlayer
}

export default class PlayerCard extends Vue.with( Props ) {
  get displayVictoryPoints():number {
    return playerDisplayVictoryPoints( this.player )
  }

  get borderColorClass():string {
    return pBorderColorClass( this.player.color )
  }

  get resourcesAmount():number {
    return this.player.resources.reduce( ( sum, e ) => sum + e[1], 0 )
  }

  get knightsAmount():number {
    return this.player.usedDevCards.filter( d => d === "Knight" ).length
  }
}*/

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "PlayerCard",
  props: {
    player: {
      required: true
    }
  },
  data() {
    return {
      store
    }
  },
  computed: {
    p():ClassicPlayer {
      return this.player as ClassicPlayer
    },
    displayVictoryPoints():number {
      return playerDisplayVictoryPoints( this.p )
    },
    borderColorClass():string {
      return pBorderColorClass( this.p.color )
    },
    resourcesAmount():number {
      return this.p.resources.reduce( ( sum, e ) => sum + e.v, 0 )
    },
    knightsAmount():number {
      return this.p.usedDevCards.filter( d => d === "Knight" ).length
    },
    onTurn():boolean {
      return this.store.gameData?.game.turn.playerID.id === this.p.id.id
    },
    turnNameStyle():string {
      return `text-decoration: ${ this.onTurn ? "underline" : "none" }`
    }
  }
} )
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  .playerCard {
    flex-grow: 1;
    margin: @playerCardMargin @playerCardMargin 0 @playerCardMargin;
    border: solid 0.3rem black;
    box-sizing: border-box;
    background-image: url( "~@/assets/images/wood_background.jpg" );
    background-position: center;
    background-size: 128px;
    background-repeat: repeat;
    border-image: url( "~@/assets/images/metal_border.png" ) 24 stretch !important;
    padding: 5px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media @portrait {
      height: calc( 100% - 2 * @playerCardMargin)
    }

    &:first-child {
      margin-top: 0 !important;

      @media @portrait {
        margin-top: @playerCardMargin !important;
        margin-left: 0 !important;
      }
    }

    &:last-child {
      margin-bottom: 0 !important;

      @media @portrait {
        bottom: @playerCardMargin !important;
        margin-right: 0 !important;
      }
    }
  }

  .playerCardHeader {
    display: flex;
    align-items: center;
    width: 100%;

    @media @portrait {

    }
  }

  .playerCardPoints {
    float: left;
    border: solid 0.3vw transparent;
    border-radius: 100%;
    aspect-ratio: 1;
    height: 30%;
    min-height: 24px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    @media @portrait {
      min-height: 20px;
    }

    > p {
      font-weight: bold;
      font-size: 1.2em;
      margin: 0;

      @media @portrait {
        font-size: 1em;
      }
    }
  }

  .playerCardName {
    margin: 0 0 0 5%;
    float: left;
    color: white;
    font-size: 1.2em;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;

    @media @portrait {
      font-size: 1em;
    }
  }

  .playerDisplayInfos {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .playerDisplayInfo {
    width: 100%;
    color: white;
    font-size: 1em;
    display: flex;
    white-space: nowrap;

    @media @portrait {
      font-size: 0.8em;
    }

    > .playerDisplayInfoLabel {
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > .playerDisplayInfoValue {
    }
  }
</style>