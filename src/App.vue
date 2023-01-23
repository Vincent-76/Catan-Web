<template>
  <TitleMenu v-if="store.isTitle()" :initial-loaded="initialLoaded" />
  <GameRules v-else-if="store.isRules()" />
  <GameSetup v-else-if="store.isSetup()" />
  <Game v-else />
  <ErrorDialog />
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import store from "@/store";
  import Game from '@/components/Game.vue';
  import TitleMenu from "@/components/TitleMenu.vue";
  import {uuid} from "vue-uuid";
  import GameSetup from "@/components/GameSetup.vue";
  import GameRules from "@/components/GameRules.vue";
  import Dialog from "@/components/util/Dialog.vue";
  import ErrorDialog from "@/components/ErrorDialog.vue";

  @Options({
    components: {
      ErrorDialog,
      Dialog,
      GameRules,
      GameSetup,
      TitleMenu,
      Game,
    },
    data() {
      return {
        store,
        initialLoaded: false
      }
    },
    created() {
      console.log( "Created!" )
      this.initialLoaded = false
      let sessionID = this.$cookies.get( "sessionID" )
      if( sessionID === null ) {
        sessionID = uuid.v4()
        this.$cookies.set( "sessionID", sessionID )
      }
      console.log( sessionID )
      store.con.connect( sessionID )
      store.con.execute( "gameData" )
          .then( res => store.updateGameData( res ) )
          .catch()
          //.then( () => new Promise( f => setTimeout( f, 3000 ) ) )
          .finally( async () => this.initialLoaded = true )
    },
    computed: {
      hasError():boolean {
        return this.store.error != null
      }
    }
  })
  export default class App extends Vue {}
</script>

<style lang="less">
  @import "@/assets/vars.less";

  @pColorGreen: #12ba00;
  @pColorBlue: #007cba;
  @pColorYellow: #cdd310;
  @pColorRed: #d21414;

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    //margin-top: 60px;
    height: 100%;
    width: 100%;
  }

  * {
    user-select: none;
    cursor: url( "~@/assets/images/cursor.png" ), auto;
  }

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  body {
    font-family: Georgia, Times, Times New Roman, serif;
    background-color: #C0A886;
  }

  .ropeBorder {
    border-image: url( "~@/assets/images/rope_border.png" ) 205 round !important;
  }

  .button {
    background-image: linear-gradient( #F9D031, #A65020 );
    display: block;
    border: 4px solid @buttonBorderColor;
    border-radius: 12px;
    text-align: center;
    padding: 8px 25px 8px 25px;
    text-decoration: none;
    color: @textColor !important;
    font-size: 1.2em;
    font-weight: bold;
    //cursor: inherit;
    transition: box-shadow 0.1s ease-in-out;
  }

  .button:not( .buttonDisabled ):hover {
    box-shadow: inset 0 0 3px @buttonBorderColor;
    color: initial !important;
    text-decoration: initial !important;
  }

  .button:not( .buttonDisabled ):active {
    box-shadow: inset 0 0 5px @buttonBorderColor;
  }

  .buttonLoading {
    background: grey none !important;
    animation: loading 0.5s infinite alternate;

    @keyframes loading {
      0% {
        border-color: black;
      }
      100% {
        border-color: #D09029;
      }
    }
  }

  .buttonDisabled {
    background: grey none !important;
    border-color: black !important;
  }


  .select {
    background-image: linear-gradient( #F9D031, #A65020 );
    display: block;
    border: 3px solid @buttonBorderColor;
    border-radius: 8px;
    text-align: center;
    padding: 6px 12px 6px 12px;
    text-decoration: none;
    color: @textColor;
    font-size: 1.2em;
    font-weight: bold;
    //cursor: inherit;
    outline: 0;
    transition: box-shadow 0.1s ease-in-out;
  }

  .select:hover {
    box-shadow: inset 0 0 3px @buttonBorderColor;
  }

  .select:active {
    box-shadow: inset 0 0 5px @buttonBorderColor;
  }

  label {
    -webkit-text-stroke: 0.5px black;
    text-overflow: ellipsis;
    margin-bottom: 0 !important;
  }

  input[type="text"] {
    background-color: #C0A78B;
    border: solid 0.2rem black;
    border-radius: 5px;
    outline: none;

    &:focus {
      border-color: #D09029;
    }
  }

  .errorInfo {
    width: 100%;
    color: #bc0000;
    font-size: 1.1em;
    font-weight: bold;
    -webkit-text-stroke: 0.4px black;

    > p {
      margin-bottom: 0;
    }
  }

  .centerText {
    text-align: center;
  }

  .dialog {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    background-color: rgba( 0, 0, 0, 0.6 );
    align-items: center;
    justify-content: center;
    text-decoration: none;
    display: flex;
    z-index: 100;
    padding-left: 10%;
    padding-right: 10%;
  }

  .dialogText {
    font-weight: bold;
    font-size: 1.2em;
    color: black;
    margin: 0;
  }


  .pBGColorGreen { background-color: @pColorGreen !important; }
  .pTextColorGreen { color: @pColorGreen !important; }
  .pBorderColorGreen { border-color: @pColorGreen !important; }

  .pBGColorBlue { background-color: @pColorBlue !important; }
  .pTextColorBlue { color: @pColorBlue !important; }
  .pBorderColorBlue { border-color: @pColorBlue !important; }

  .pBGColorYellow { background-color: @pColorYellow !important; }
  .pTextColorYellow { color: @pColorYellow !important; }
  .pBorderColorYellow { border-color: @pColorYellow !important; }

  .pBGColorRed { background-color: @pColorRed !important; }
  .pTextColorRed { color: @pColorRed !important; }
  .pBorderColorRed { border-color: @pColorRed !important; }


  @media @portrait {
    *[class^="col-md"] {
      min-width: 100% !important;
    }

    *[class~="col-lg-1"] {
      flex: 0 0 100% / 12;
      max-width: 100% / 12;
    }

    *[class~="col-lg-2"] {
      flex: 0 0 100% / 6;
      max-width: 100% / 6;
    }

    *[class~="col-lg-3"] {
      flex: 0 0 100% / 4;
      max-width: 100% / 4;
    }

    *[class~="col-lg-4"] {
      flex: 0 0 100% / 3;
      max-width: 100% / 3;
    }

    *[class~="col-lg-5"] {
      flex: 0 0 100% / 12 * 5;
      max-width: 100% / 12 * 5;
    }

    *[class~="col-lg-6"] {
      flex: 0 0 100% / 2;
      max-width: 100% / 2;
    }

    *[class~="col-lg-7"] {
      flex: 0 0 100% / 12 * 7;
      max-width: 100% / 12 * 7;
    }

    *[class~="col-lg-8"] {
      flex: 0 0 100% / 12 * 8;
      max-width: 100% / 12 * 8;
    }

    *[class~="col-lg-9"] {
      flex: 0 0 100% / 12 * 9;
      max-width: 100% / 12 * 9;
    }

    *[class~="col-lg-10"] {
      flex: 0 0 100% / 12 * 10;
      max-width: 100% / 12 * 10;
    }

    *[class~="col-lg-11"] {
      flex: 0 0 100% / 12 * 11;
      max-width: 100% / 12 * 11;
    }

    *[class~="col-lg-12"] {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  @media @landscape {
    *[class^="col-lg"] {
      min-width: 100% !important;
    }

    *[class~="col-md-1"] {
      flex: 0 0 100% / 12;
      max-width: 100% / 12;
    }

    *[class~="col-md-2"] {
      flex: 0 0 100% / 6;
      max-width: 100% / 6;
    }

    *[class~="col-md-3"] {
      flex: 0 0 100% / 4;
      max-width: 100% / 4;
    }

    *[class~="col-md-4"] {
      flex: 0 0 100% / 3;
      max-width: 100% / 3;
    }

    *[class~="col-md-5"] {
      flex: 0 0 100% / 12 * 5;
      max-width: 100% / 12 * 5;
    }

    *[class~="col-md-6"] {
      flex: 0 0 100% / 2;
      max-width: 100% / 2;
    }

    *[class~="col-md-7"] {
      flex: 0 0 100% / 12 * 7;
      max-width: 100% / 12 * 7;
    }

    *[class~="col-md-8"] {
      flex: 0 0 100% / 12 * 8;
      max-width: 100% / 12 * 8;
    }

    *[class~="col-md-9"] {
      flex: 0 0 100% / 12 * 9;
      max-width: 100% / 12 * 9;
    }

    *[class~="col-md-10"] {
      flex: 0 0 100% / 12 * 10;
      max-width: 100% / 12 * 10;
    }

    *[class~="col-md-11"] {
      flex: 0 0 100% / 12 * 11;
      max-width: 100% / 12 * 11;
    }

    *[class~="col-md-12"] {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
</style>
