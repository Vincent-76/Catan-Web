import { reactive } from "vue";
import { ClassicGameData } from "@/model/game_data";
import { Connection } from "@/connection";

const SETUP_STATES = [
    "InitState",
    "InitPlayerState",
    "InitBeginnerState"
]

export const store = reactive( {
    con: new Connection(),
    title: true,
    gameData: null as ClassicGameData | null,
    hasGame() {
        return this.gameData !== null;
    },
    isSetup() {
        return this.gameData === null || SETUP_STATES.includes( this.gameData.game.state.class )
    },
    isHost() {
        return this.gameData?.host === true
    },
    updateGameData( data:string ) {
        this.gameData = JSON.parse( data )
    },
    updateGame( data:string ) {
        if( this.gameData != null )
            this.gameData.game = JSON.parse( data )
    },
    updatePlayers( data:string ) {
        if( this.gameData != null )
            this.gameData.game.players = JSON.parse( data )
    },
    updateState( data:string ) {
        if( this.gameData != null )
            this.gameData.game.state = JSON.parse( data )
    },
    updateTurn( data:string ) {
        if( this.gameData != null )
            this.gameData.game.turn = JSON.parse( data )
    }
} )