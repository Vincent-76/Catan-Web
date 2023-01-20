<template>
  <div id="main">
    <div v-if="!store.hasGame()" class="col-md-8 gameSetup">
      <div class="ropeBorder">
        <div id="gameSettings" class="asyncForm">
          <div class="row m-0">
            <div id="moduleSelect" class="col-sm-4 my-2">
              <label class="selectLabel">Game Mode</label>
              <select class="select" v-model="gameSettings.module" name="module">
                <option v-for="module in modules" :key="module" v-bind:value="module">
                  {{ module }}
                </option>
              </select>
              <!-- TODO Error Message -->
            </div>
            <div id="placementSelect" class="col-sm-4 my-2">
              <div class="row mx-0 woodenMetal">
                <div v-for="placement in availablePlacements" :key="placement" class="col-xl-6 placement">
                  <input v-bind:id="placement" type="checkbox" class="checkbox" v-model="gameSettings.availablePlacements" v-bind:value="placement">
                  <label v-bind:for="placement">{{ placement }}</label>
                </div>
                <!-- TODO Error Message -->
              </div>
            </div>
            <div id="fileIOSelect" class="col-sm-4 my-2">
              <label class="selectLabel">Save Game Method</label>
              <select class="select" v-model="gameSettings.fileIO" name="fileIO">
                <option v-for="fileIO in fileIOs" :key="fileIO" v-bind:value="fileIO">{{ fileIO }}</option>
              </select>
              <!-- TODO Error Message -->
            </div>
          </div>
          <div id=createGame class="row mx-0">
            <div class="col-md-12 my-2">
              <CommandButton
                  command="createGame"
                  :data="JSON.stringify( gameSettings )"
                  :validation="createGameValidation"
                  @result=" res => store.updateGameData( res )"
              >Create Game</CommandButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="isInitPlayerState" class="col-md-8 gameSetup">
      <div class="ropeBorder">
        <div v-if="store.isHost()" id="gameIDHolder" class="ropeBorder">
          Game ID: <span>{{ store.gameData?.gameID ?? "-" }}</span>
        </div>
        <div id="initPlayer" class="row mx-0">
          <div id="addPlayer" class="col-md-7 my-2">
            <div v-if="!hasPlayer" class="asyncForm">
              <label id="addPlayerLabel" class="mb-3">Add Player</label>
              <div id="playerName" class="row mx-0">
                <label>Name:</label>
                <div class="col-sm pr-0">
                  <input type="text" v-model="addPlayer.name" />
                </div>
              </div>
              <!-- TODO Error Message -->
              <div id="playerColor" class="row mx-0">
                <label>Color:</label>
                <div class="col-sm row mx-0 pr-0">
                  <div v-for="color in availableColors" :key="color" class="col my-2">
                    <input type="radio" v-model="addPlayer.color" v-bind:class="pBGColorClass( color )" v-bind:value="color" />
                  </div>
                </div>
              </div>
              <!-- TODO Error Message -->
              <div id="sendAddPlayer" class="row mx-0 my-2">
                <CommandButton
                    command="addPlayer"
                    :data="JSON.stringify( addPlayer )"
                    :validation="addPlayerToGameValidation"
                >AddPlayer</CommandButton>
              </div>
            </div>
            <CommandButton v-if="store.isHost() && isSubmitButton" command="setInitBeginnerState" class="col-sm">
              Next
            </CommandButton>
          </div>
          <div id="playerList" class="col-md-5 ropeBorder">
            <label id="playersLabel" class="mb-1">Players</label>
            <div v-for="p in players" :key="p.name" class="col-12 row mx-0 my-2 woodenMetal align-items-center">
              <div class="col my-2 px-0 playerListName">
                <label>{{ p.name }}</label>
              </div>
              <div class="playerListColor" v-bind:class="pBGColorClass( p.color )"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="isInitBeginnerState" class="col-md-4 gameSetup">
      <div class="ropeBorder">
        <div id="beginnerList" class="col-md-12 ropeBorder">
          <label id="beginnersLabel" class="mb-1">Dice out beginner</label>
          <div v-for="diceValue in dicePlayers" :key="diceValue.k.id.id" class="col-12 row mx-0 my-2 woodenMetal align-items-center">
            <div class="beginnerListColor mr-2" v-bind:class="pBGColorClass( diceValue.k.color )"></div>
            <div class="col my-2 px-0 beginnerListName">
              <label>{{ diceValue.k.name }}</label>
            </div>
            <img v-if="diceValue.v !== null" class="beginnerDiceValue" v-bind:class="isBeginnerClass( diceValue.k.id )"
              :src="require( '@/assets/images/dice/' + diceValue.v + '.png' )" v-bind:alt="diceValue.v" />
          </div>
          <div v-if="store.isHost()">
            <CommandButton v-if="!hasBeginner" id="diceOutButton" command="diceOutBeginner" class="col my-2">
              <img :src="require( '@/assets/images/dices.png')" alt="Roll the dices"/>
            </CommandButton>
            <CommandButton v-else id="startButton" command="setBeginner" class="col my2">Start</CommandButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import store from "@/store";
  import { pBGColorClass } from "@/util/util";
  import { ClassicPlayer, JMap, PlayerID } from "@/model/game_data"
  import { JMapEntry } from "@/model/game_data";
  import deepEqual from "fast-deep-equal"
  import CommandButton from "@/components/CommandButton.vue";

  export default defineComponent( {
    name: "GameSetup",
    components: {
      CommandButton
    },
    data() {
      return {
        store,
        modules: [] as string[],
        availablePlacements: [] as string[],
        fileIOs: [] as string[],
        playerColors: [] as string[],
        gameSettings: {
          module: null as unknown as string,
          availablePlacements: [] as string[],
          fileIO: null as unknown as string
        },
        addPlayer: {
          name: "",
          color: null as unknown as string
        }
      }
    },
    created() {
      store.con.execute( "modules" ).then( ( res ) =>
          this.modules = JSON.parse( res )
      )
      store.con.execute( "placements" ).then( ( res ) =>
          this.availablePlacements = JSON.parse( res )
      )
      store.con.execute( "fileIOs" ).then( ( res ) =>
          this.fileIOs = JSON.parse( res )
      )
      store.con.execute( "playerColors" ).then( ( res ) =>
          this.playerColors = JSON.parse( res )
      )
    },
    watch: {
      modules( newValue:string[] ) {
        if( this.gameSettings.module == null && newValue.length > 0 )
          this.gameSettings.module = newValue[0]
      },
      availablePlacements(newValue:string[] ) {
        if( this.gameSettings.availablePlacements.length == 0 )
          this.gameSettings.availablePlacements = newValue
      },
      fileIOs( newValue:string[] ){
        if( this.gameSettings.fileIO == null && newValue.length > 0 )
          this.gameSettings.fileIO = newValue[0]
      },
      'store.gameData.game.availablePlacements'( newValue ) {
        if( newValue !== null )
          this.gameSettings.availablePlacements = newValue
      },
      availableColors( newValue:string[] ) {
        if( newValue.length > 0 && ( this.addPlayer.color == null || newValue.indexOf( this.addPlayer.color ) == -1 ) )
          this.addPlayer.color = newValue[0]
      },
    },
    computed: {
      isInitPlayerState():boolean {
        return this.store.gameData?.game.state.class === "InitPlayerState";
      },
      isInitBeginnerState():boolean {
        return this.store.gameData?.game.state.class === "InitBeginnerState";
      },
      availableColors():string[] {
        return this.playerColors.filter( ( color ) => this.store.gameData?.game.players.some( p => p.v.color === color ) !== true )
      },
      isSubmitButton():boolean {
        return ( this.store.gameData?.game.players.length ?? 0 ) >= ( this.store.gameData?.gameValues.minPlayers ?? 2 )
      },
      players():ClassicPlayer[] {
        return this.store.gameData?.game.players.map( e => e.v ) ?? [];
      },
      diceValues():JMap<PlayerID, number> {
        return this.store.gameData?.game.state.diceValues ?? [];
      },
      dicePlayers():JMap<ClassicPlayer, number> {
        if( this.diceValues.length === 0 )
            return this.store.gameData?.game.players.map( function( e ) {
              return { k: e.v, v: null as unknown as number }
            } ) ?? [];
        else {
          const playerMap:JMap<PlayerID, ClassicPlayer> | undefined = this.store.gameData?.game.players;
          if( playerMap === undefined )
            return [];
          const map:JMap<ClassicPlayer | undefined, number> = this.diceValues.map( function( e ) {
            return { k: playerMap.find( p => p.k.id === e.k.id )?.v, v: e.v > 0 ? e.v : null as unknown as number }
          } )
          return map.filter( e => e.k !== undefined ) as JMap<ClassicPlayer, number>;
        }
      },
      hasBeginner():boolean {
        return this.store.gameData?.game.state.beginner !== null;
      },
      hasPlayer():boolean {
        return this.store.gameData?.playerID !== null
      }
    },
    methods: {
      pBGColorClass( color:string ):string {
        return pBGColorClass( color );
      },
      isBeginnerClass( pID:PlayerID ):string {
        return deepEqual( this.store.gameData?.game.state.beginner, pID ) ? "beginner" : "";
      },
      createGameValidation():boolean {
        return this.gameSettings.module != null && this.gameSettings.availablePlacements.length > 0 && this.gameSettings.fileIO != null
      },
      addPlayerToGameValidation():boolean {
        return this.addPlayer.name != null && this.addPlayer.color != null
      }
    }
  } )
</script>


<style lang="less" scoped>
  @import "@/assets/vars.less";

  #main {
    width: 100%;
    height: 100%;
    background-image: url( "~@/assets/images/main_theme.jpg" );
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .gameSetup {
    height: 100%;
    margin: auto;
    padding-top: 4%;
    padding-bottom: 4%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    > div {
      background-image: url( "~@/assets/images/stone_background.jpg" );
      background-position: center;
      background-size: 430px;
      background-repeat: repeat;
      border: solid @ropeBorderWidth transparent;
      box-sizing: border-box;
    }
  }

  .woodenMetal {
    background-image: url( "~@/assets/images/wood_background.jpg" );
    background-position: center;
    background-size: 128px;
    background-repeat: repeat;
    border-image: url( "~@/assets/images/metal_border.png" ) 24 stretch !important;
    border: solid 0.4rem transparent;
    box-sizing: border-box;
  }

  #gameSettings {
    width: 100%;

    .selectLabel {
      color: @selectedColor;
      font-size: 1.2em;
      font-weight: bold;
    }

    #moduleSelect {
      text-align: center;

      select {
        width: 100%;
      }
    }

    #placementSelect {

      .placement {
        display: flex;
      }

      input {
        border-radius: 5px;
      }

      label {
        color: white;
        flex-grow: 1;
        margin-bottom: 0;
        padding: 6px;
      }
    }

    #fileIOSelect {
      text-align: center;

      select {
        width: 100%;
      }
    }

    #createGame {
      margin-top: 20px;

      .button {
        width: 100%;
      }
    }
  }


  #gameIDHolder {
    box-sizing: border-box;
    border-style: solid;
    border-width: 0 0 @ropeBorderWidth 0;
    color: white;
    font-size: 1.4em;
    font-weight: bold;
    padding: 0.4em 0;

    span {
      user-select: all;
      color: #D09029;
    }
  }


  #initPlayer {

    #playerList {
      text-align: center;

      #playersLabel {
        color: white;
        font-size: 1.4em;
        font-weight: bold;
      }

      .playerListName {
        text-align: left;
        color: white;
        font-size: 1.2em;
        font-weight: bold;
      }

      .playerListColor {
        height: 2rem;
        aspect-ratio: 1;
        border: solid 2px black;
      }
    }

    #addPlayer {
      text-align: center;
    }

    form {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    #addPlayerLabel {
      color: @selectedColor;
      font-size: 1.4em;
      font-weight: bold;
    }

    #playerName {
      text-align: left;
      justify-content: center;

      > label {
        color: @selectedColor;
        font-size: 1.2em;
        font-weight: bold;
      }

      input {
        width: 100%;

        @media @sm {
          & {
            text-align: center;
          }
        }
      }
    }

    #playerColor {
      text-align: left;
      justify-content: center;
      align-items: center;

      > label {
        color: @selectedColor;
        font-size: 1.2em;
        font-weight: bold;
      }

      .col {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      input {
        min-width: 50px;
        margin: auto;
        aspect-ratio: 1;
        appearance: none;
        border: solid 2px black;
        box-sizing: border-box;
        transition: 200ms;

        &:checked {
          border-color: @selectedColor;
          border-width: 5px;
        }
      }
    }

    #sendAddPlayer {
      margin-top: 20px;

      .button {
        width: 100%;
      }
    }

    #playerList {
      box-sizing: border-box;
      border-style: solid;
      border-width: 0 0 0 @ropeBorderWidth;

      @media @md {
        border-width: @ropeBorderWidth 0 0 0;
      }
    }
  }

  #beginnerList {
    text-align: center;

    #beginnersLabel {
      color: white;
      font-size: 1.4em;
      font-weight: bold;
    }

    .beginnerListName {
      text-align: left;
      color: white;
      font-size: 1.2em;
      font-weight: bold;
    }

    .beginnerListColor {
      height: 2rem;
      aspect-ratio: 1;
      border: solid 2px black;
    }

    .beginnerDiceValue {
      height: 2.5rem;
      aspect-ratio: 1;
      border: solid 3px black;
      border-radius: 8px;
      background-color: black;
      box-sizing: border-box;
    }

    .beginner {
      border-color: @selectedColor;
      background-color: @selectedColor;
    }

    #diceOutButton {
      width: fit-content;
      width: -moz-fit-content;
      margin: auto;

      > img {
        height: 40px;
      }
    }
  }
</style>