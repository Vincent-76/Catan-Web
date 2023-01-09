<template>
  <div id="content" class="col-md-5">
    <img id="header" :src="require( '@/assets/images/main_header.png' )" alt="Settlers of Catan" />
    <div id="buttons" class="col-md-6">
      <div v-if="store.hasGame()">
        <a @click="resumeGame" class="button">Resume Game</a>
        <!-- <a href="" class="button">Resume Game (TUI)</a> -->
      </div>
      <div>
        <a @click="startNewGame" class="button">Start New Game</a>
        <!-- <a href="" class="button">Start New Game (TUI)</a> -->
      </div>
      <div id="joinGame">
        <input type="text" v-model="joinGameID" placeholder="Game ID" />
        <a @click="joinGame" class="button">Join Game</a>
        <!-- <a href="" class="button">Start New Game (TUI)</a> -->
      </div>
      <a target="_blank" href="" class="button">Open Rules</a>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { store } from "@/store"

  export default defineComponent( {
    name: "TitleMenu",
    props: {
      sessionExists: {
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
        this.store.title = false
      },
      startNewGame():void {
        // TODO Confirmation Message
        this.store.con.execute( "newGame" ).then( () => {
          this.store.gameData = null
          this.store.title = false;
        } )
      },
      joinGame():void {
        this.store.con.execute( "joinGame", this.joinGameID ).then( res => {
          this.store.updateGameData( res )
          this.store.title = false;
        } )
      }
    }
  } )
</script>


<style lang="less">
  #main {
    background-image: url( "~@/assets/images/main_theme.jpg" );
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>

<style lang="less" scoped>

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