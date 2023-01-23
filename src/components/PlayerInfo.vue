<template>
  <div id="playerPanel" class="row mx-0 p-2">
    <div id="playerResourceHolder" class="col-lg-6 row mx-0 p-0">
      <div id="playerNameHolder" class="col-lg p-0 pb-2">
        <div class="playerPoints" :class="borderColorClass">
          <p>{{ victoryPoints }}</p>
        </div>
        <p class="playerName" :style="turnNameStyle">{{ playerName }}</p>
      </div>
      <div class="col-lg row p-0 mx-0">
        <div v-for="resource in resources" :key="resource" class="col p-0">
          <div class="playerStack">
            <img :src="require( `@/assets/images/resources/${resource.toLowerCase()}.png` )" :alt="resource" />
            <p>{{ resourceAmount( resource ) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div id="playerDevCards" class="col-lg-6 p-0">
      <div v-for="(d, i) in devCards" :key="i" class="playerDevCard" @click="devCard = d">
        {{ d }}
      </div>
    </div>
  </div>

  <Dialog :show="devCard != null" :content-style="devCardDialogStyle" class="devCardDialog" @click="devCard = null">
    <img :src="require( `@/assets/images/devCards/${devCard.toLowerCase()}.png` )" :alt="devCard">
    <CommandButton v-if="devCardUsable" command="useDevCard" :data="devCard" v-on:click.prevent>
      Use
    </CommandButton>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import {ClassicPlayer, RESOURCES} from "@/model/game_data";
import {pBorderColorClass, playerDisplayVictoryPoints} from "@/util/util";
import CommandButton from "@/components/util/CommandButton.vue";
import Dialog from "@/components/util/Dialog.vue";

export default defineComponent({
  name: "PlayerInfo",
  components: {
    Dialog,
    CommandButton
  },
  data() {
    return {
      store,
      devCard: null as string | null
    }
  },
  computed: {
    player():ClassicPlayer | null {
      return this.store.gameData?.game.players.find( e => e.k.id === this.store.gameData?.playerID?.id )?.v ?? null
    },
    victoryPoints():number {
      if( this.player === null )
        return 0
      return playerDisplayVictoryPoints( this.player ) + this.player.devCards.filter( d => d === "GreatHall" ).length
    },
    borderColorClass():string {
      return pBorderColorClass( this.player?.color ?? "" )
    },
    playerName():string {
      console.log( this.store.gameData?.playerID ?? "-" )
      return this.player?.name ?? ""
    },
    turnNameStyle():string {
      return `text-decoration: ${ this.store.onTurn() ? "underline" : "none" }`
    },
    devCards():string[] {
      //return [ "GreatHall", "Knight" ]
      return this.player?.devCards ?? []
    },
    resources():string[] {
      return RESOURCES
    },
    devCardDialogStyle():object {
      return {
        border: "none",
        backgroundColor: "transparent"
      }
    },
    devCardUsable():boolean {
      console.log( { devCard: this.devCard, state: this.store.gameData?.game.state, usableCards: this.store.gameData?.gameValues.devCards } )
      return this.store.gameData?.gameValues.devCards.find( e => e.k === this.devCard )?.v.usable === true &&
          this.store.onTurn() && (
              this.store.gameData?.game.state.class === "DiceState" ||
              this.store.gameData?.game.state.class === "ActionState"
          )
    }
  },
  methods: {
    devCardLabelFor( devCard:string ):string {
      return `devCard${devCard}Control`
    },
    resourceAmount( resource:string ):number {
      return this.player?.resources.find( e => e.k === resource )?.v ?? 0
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #playerPanel {
    width: 100%;
    //height: 30%;
    background-image: url( "~@/assets/images/wood_background.jpg" );
    background-position: center;
    background-size: 128px;
    background-repeat: repeat;
    box-sizing: border-box;
    text-align: center;

    @media @portrait {
      min-width: 20%;
      max-width: 50%;
      width: auto;
      height: 100%;
    }

    td {
      width: 30%;
      padding: 4%;
    }

    .col {
      margin: 0 -10px 0 -10px;
    }
  }

  .playerHeader {
    display: flex;
    width: 100%;
  }

  #playerNameHolder {
    display: flex;
    align-items: center;
  }

  .playerPoints {
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

    > p {
      font-weight: bold;
      font-size: 1.2em;
      margin: 0;
    }
  }

  .playerName {
    margin: auto auto auto 5%;
    float: left;
    color: white;
    font-size: 1.4em;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #playerResourceHolder {
    @media @portrait {
      flex-direction: column;
    }
  }

  .playerStack {
    text-align: center;
    color: white;
    font-size: 1.2em;

    > img {
      max-height: 5vh;
      max-width: 80%;
    }

    > p {
      margin: 0;
    }
  }

  #playerDevCards {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-height: 25vh;
    overflow-y: auto;
    overflow-x: hidden;

    @media @portrait {
      padding-left: 0.5rem !important;
      max-height: 100%;
    }

    @borderColor: #392F31;

    .playerDevCard {
      background-image: linear-gradient( gray, dimgray );
      display: block;
      border: 2px solid @borderColor;
      border-radius: 6px;
      text-align: center;
      padding: 3px 8px 3px 8px;
      text-decoration: none;
      color: white;
      font-size: 0.8em;
      //cursor: inherit;
      transition: box-shadow 0.1s ease-in-out;
      margin: 2px !important;
      -webkit-text-stroke: unset !important;
    }

    .playerDevCard:hover {
      box-shadow: inset 0 0 3px @borderColor;
    }

    .playerDevCard:active {
      box-shadow: inset 0 0 5px @borderColor;
    }
  }


  .devCardDialog {
    transition: opacity 0.5s ease;

    img {
      width: 30vw;

      @media @portrait {
        width: auto;
        height: 40vh;
      }
    }
  }
</style>