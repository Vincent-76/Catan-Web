<template>
  <div id="mainPanels" class="row mx-0">
    <div id="gamePanel" class="col-md-2 row mx-0 p-0 ropeBorder">
      <GameStack />
      <div class="horizontalRopeBorderSeparator ropeBorder"></div>
      <PlayerList />
    </div>
    <div id="middlePanel" class="col-md-8 p-0">
      <a id="homeButton" class="button navButton2" @click="backHome">
        <img :src="require( '@/assets/images/home.png' )" alt="Home" />
      </a>
      <a id="downloadButton" v-if="store.isHost()" class="button navButton2">
        <img :src="require( '@/assets/images/download.png' )" alt="Download" />
      </a>
      <!--<label for="uploadInput" id="uploadButton" v-if="store.isHost()" class="button navButton2">
        <img :src="require( '@/assets/images/upload.png' )" alt="Upload" />
        <input type="file" id="uploadInput" />
      </label>-->
      <CommandButton v-if="store.onTurn() && hasUndo" id="undoButton" command="undo" class="navButton2">
        <img :src="require( '@/assets/images/undo.png' )" alt="Undo" />
      </CommandButton>
      <CommandButton v-if="store.onTurn() && hasRedo" id="redoButton" command="redo" class="navButton2">
        <img :src="require( '@/assets/images/redo.png' )" alt="Redo" />
      </CommandButton>
      <div id="gridPanel">
        <img id="compass" :src="require( '@/assets/images/compass_2.png' )" alt="" />
        <div>
          <GameField />
        </div>
      </div>
      <!-- <LogPanel /> -->
    </div>
    <div id="turnPanel" class="col-md-2 row mx-0 p-0 ropeBorder">
      <PlayerInfo />
      <div class="horizontalRopeBorderSeparator ropeBorder"></div>
      <PlayerActions />
    </div>
  </div>
  <InfoDialog />
</template>

<script lang="ts">
  import { defineComponent } from "vue"
  import store from "@/store"
  import GameStack from "@/components/GameStack.vue"
  import PlayerList from "@/components/PlayerList.vue"
  import PlayerInfo from "@/components/PlayerInfo.vue"
  import GameField from "@/components/GameField.vue"
  import PlayerActions from "@/components/PlayerActions.vue";
  import CommandButton from "@/components/CommandButton.vue";
  import InfoDialog from "@/components/InfoDialog.vue";

  export default defineComponent( {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Game",
    components: {
      InfoDialog,
      PlayerActions,
      GameStack,
      PlayerList,
      PlayerInfo,
      GameField,
      CommandButton
    },
    data() {
      return {
        store
      }
    },
    computed: {
      hasUndo():boolean {
        return this.store.gameData?.gameStatus.hasUndo === true
      },
      hasRedo():boolean {
        return this.store.gameData?.gameStatus.hasRedo === true
      },
    },
    methods: {
      backHome() {
        this.store.setTitle()
      },
    }
  } )
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #mainPanels {
    height: 100%;
  }

  .horizontalRopeBorderSeparator {
    border-style: solid;
    box-sizing: border-box;
    width: 100%;
    height: 0;
    border-width: 0.5rem 0 0 0;

    @media @portrait {
      width: 0;
      height: 100%;
      border-width: 0 0 0 0.5rem;
    }
  }

  #gamePanel {
    //float: left;
    height: 100%;
    //width: 15%;
    //min-width: 100px; // TODO
    background-image: url( "~@/assets/images/stone_background.jpg" );
    background-position: center;
    background-size: 430px;
    background-repeat: repeat;
    border: 0.5rem solid transparent;
    box-sizing: border-box;
    align-content: flex-start;
    overflow: hidden;

    @media @portrait {
      max-height: 15%;
      flex-direction: row;
    }
  }

  #middlePanel {
    position: relative;
    //flex-grow: 1;
    //width: 70%;
    height: 100%;

    @media @portrait {
      height: 70%;
    }

    #gridPanel {
      @margin: 2%;

      position: relative;
      //float: left;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-image: url( "~@/assets/images/map_background.png" );
      background-repeat: no-repeat;
      //background-size: 100% 100%;
      background-size: cover;
      background-position: center;
      border-image: url( "~@/assets/images/map_border.png" ) 11 round !important;
      border-style: solid;
      border-width: 0.5rem 0 0.5rem 0;
      box-sizing: border-box;
      overflow: hidden;

      @media @portrait {
        height: 100%;
        border-width: 0 0.5rem 0 0.5rem;
      }

      > #compass {
        position: absolute;
        bottom: 0;
        right: 0;
        margin-right: 3%;
        margin-bottom: 3%;
        height: 25%;
        aspect-ratio: 1;
        z-index: 1;
      }

      > div {
        margin: @margin;
        max-height: 100% - 2 * @margin;
      }
    }

    #logPanel {
      @media @portrait {
        display: none;
      }
    }
  }

  #turnPanel {
    height: 100%;
    //width: 15%;
    //min-width: 100px; // TODO
    background-image: url( "~@/assets/images/stone_background.jpg" );
    background-position: center;
    background-size: 430px;
    background-repeat: repeat;
    border: 0.5rem solid transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    @media @portrait {
      max-height: 15%;
      flex-direction: row;
    }

    #actionPanel {
      flex-grow: 1;
      width: 100%;

      @media @portrait {
        width: auto;
        height: 100%;
      }
    }
  }


  .navButton2 {
    position: absolute;
    aspect-ratio: 1;
    width: 5%;
    min-width: 50px;
    max-width: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.8rem;
    z-index: 1;
    margin: 0.5rem 0 0.5rem 0 !important;

    @media @portrait {
      margin: 0 0.5rem 0 0.5rem;
    }

    img {
      width: 100%;
    }
  }

  #homeButton {
    top: 0;
    left: 0;
    transform: translate( 10%, 10% );
  }

  #downloadButton {
    bottom: 0;
    left: 0;
    transform: translate( 10%, -10% );
  }

  #uploadButton {
    bottom: 0;
    left: 0;
    transform: translate( 120%, -10% );
  }

  #uploadInput {
    display: none;
  }

  #undoButton {
    top: 0;
    right: 0;
    transform: translate( -10%, 10% );
  }

  #redoButton {
    top: 0;
    right: 0;
    transform: translate( -10%, 120% );
  }



  #gameInfo {
    //width: 30%;
    padding: 1rem;
    border: solid 0.4rem black;
    border-radius: 1rem;
    background-color: #D09029;

    @media @portrait {
      width: auto;
      height: 40%;
    }
  }
</style>