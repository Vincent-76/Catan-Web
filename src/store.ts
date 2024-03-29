import { reactive } from "vue";
import {ClassicGameData, JMap, JMapEntry} from "@/model/game_data";
import { Connection } from "@/connection";

enum AppState {
    Title,
    Rules,
    Game
}

const SETUP_STATES = [
    "InitState",
    "InitPlayerState",
    "InitBeginnerState"
]

export default reactive( {
    con: new Connection(),
    appState: AppState.Title,
    gameData: null as ClassicGameData | null,
    info: null as any | null,
    error:null as string | null,
    executing: false,
    hasGame():boolean {
        return this.gameData !== null;
    },
    isSetup():boolean {
        return this.gameData === null || SETUP_STATES.includes( this.gameData.game.state.class )
    },
    isTitle():boolean {
        return this.appState == AppState.Title
    },
    isRules():boolean {
        return this.appState == AppState.Rules
    },
    isGame():boolean {
        return this.appState == AppState.Game
    },
    setTitle():void {
        this.appState = AppState.Title
    },
    setRules():void {
        this.appState = AppState.Rules
    },
    isHost():boolean {
        return this.gameData?.host === true
    },
    onTurn():boolean {
        return this.gameData?.playerID?.id !== null && this.gameData?.game.turn.playerID.id === this.gameData?.playerID?.id
    },
    setInfo( info:any ) {
        this.info = JSON.parse( info )
    },
    setError( error:string ) {
        this.error = error
    },
    setGame():void {
        this.appState = AppState.Game
    },
    gameUpdate( data:string ):void {
        if( this.gameData === null )
            return
        //console.log( data )
        const updates:JMap<any[], any> = JSON.parse( data )
        console.log( { updates: updates } )
        for( const u of updates ) {
            if( u.k.length == 0 )
                this.gameData.game = u.v
            else {
                //console.log( "Updating: " + u.k.map( e => typeof e !== "string" ? JSON.stringify( e ) : e ).join( "." ) )
                //console.log( this.gameData.game )
                const last:number = u.k.length - 1
                let data:any = this.gameData.game as any
                for( let i = 0; i <= last; i++ ) {
                    const key:any = u.k[i]
                    if( typeof key === "number" && key >= ( data as Array<any> ).length ) {
                        data.push( last ? u.v :
                            typeof u.k[i + 1] === "number" ? [] : {} )
                    } else if( typeof key === "object" && "k" in key ) {
                        const found = ( data as JMap<any, any> ).find( e => JSON.stringify( e.k ) === JSON.stringify( key.k ) )
                        if( found !== undefined ) {
                            if( i == last )
                                found.v = u.v
                            else
                                data = found.v
                        } else {
                            const newEntry:JMapEntry<any, any> = {
                                k: key.k,
                                v: i == last ? u.v :
                                    typeof u.k[i + 1] === "number" ? [] : {}
                            } as JMapEntry<any, any>;
                            ( data as JMap<any, any> ).push( newEntry )
                            if( i != last )
                                data = newEntry.v
                        }
                    } else {
                        if( i == last )
                            data[key] = u.v
                        else
                            data = data[key]
                    }
                }
                //console.log( data )
                //console.log( this.gameData.game )
                /*e.k.slice( 0, e.k.length - 1 ).reduce(
                    function( data:any, key:any ) {
                        if( typeof key == "object" && "k" in key ) {
                            const found = ( data as JMap<any, any> ).find( e => e.k == key.k )
                        }
                    },
                    this.gameData.game as any
                )[e.k[e.k.length - 1]] = e.v*/
            }
        }
    },
    updateGameData( data:string ):void {
        this.gameData = JSON.parse( data )
        console.log( { gameData: this.gameData } )
    },
    updateGame( data:string ):void {
        if( this.gameData != null )
            this.gameData.game = JSON.parse( data )
    },
    updateGameValues( data:string ):void {
        if( this.gameData != null )
            this.gameData.gameValues = JSON.parse( data )
    },
    updateGameStatus( data:string ):void {
        if( this.gameData != null )
            this.gameData.gameStatus = JSON.parse( data )
    },
    updateGameField( data:string ):void {
        if( this.gameData != null ) {
            const newGameField = JSON.parse( data )
            console.log( newGameField )
            this.gameData.game.gameField = newGameField
        }
    },
    updatePlayers( data:string ):void {
        if( this.gameData != null )
            this.gameData.game.players = JSON.parse( data )
    },
    updateState( data:string ):void {
        if( this.gameData != null )
            this.gameData.game.state = JSON.parse( data )
    },
    updateTurn( data:string ):void {
        if( this.gameData != null )
            this.gameData.game.turn = JSON.parse( data )
    },
    isBuildable( type:string, id:number ):boolean {
        return this.onTurn() && this.gameData?.gameStatus.buildablePoints.some( p => p.class === type && p.id === id ) === true
    }

} )