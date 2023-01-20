<template>
  <div id="main">
    <div id="content" class="col-md-5">
      <img id="header" :src="require( '@/assets/images/main_header.png' )" alt="Settlers of Catan" />
      <div id="buttons" class="col-md-6">
        <div>
          <GameButton @action="resumeGame" :initial-loading="!initialLoaded" :enabled="store.hasGame()">Resume Game</GameButton>
          <!-- <a href="" class="button">Resume Game (TUI)</a> -->
        </div>
        <div>
          <CommandButton command="newGame" :validation="startNewGameValidation" @result="startNewGame">
            Start New Game
          </CommandButton>
          <!-- <a href="" class="button">Start New Game (TUI)</a> -->
        </div>
        <div id="joinGame">
          <input type="text" v-model="joinGameID" placeholder="Game ID" />
          <CommandButton command="joinGame" :data="joinGameID" @result="joinGame">
            Join Game
          </CommandButton>
          <!-- <a href="" class="button">Start New Game (TUI)</a> -->
        </div>
        <GameButton @action="openRules">Game Rules</GameButton>
        <!-- <a target="_blank" href="" class="button">Open Rules</a> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import store from "@/store"
  import GameButton from "@/components/GameButton.vue";
  import CommandButton from "@/components/CommandButton.vue";

  export default defineComponent( {
    name: "TitleMenu",
    components: {
      GameButton,
      CommandButton
    },
    props: {
      sessionExists: {
        type: Boolean,
        default: false
      },
      initialLoaded: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        store,
        joinGameID: ""
      }
    },
    methods: {
      resumeGame():void {
        this.store.setGame()
      },
      startNewGameValidation():boolean {
        // TODO Confirmation Message
        return true
      },
      startNewGame():void {
        this.store.gameData = null
        this.store.setGame()
      },
      joinGame( res:string ):void {
        this.store.updateGameData( res )
        this.store.setGame()
      },
      openRules():void {
        this.store.setRules()
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

  #content {
    margin: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }

  #header {
    width: 100%;
  }

  #buttons {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .button {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }

  #joinGame {

    > input {
      width: 100%;
      text-align: center;
    }

    > .button {
      margin-top: 5px !important;
    }
  }
</style>