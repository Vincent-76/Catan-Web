
import store from "@/store";

enum ConnectionError {
    TIMEOUT = 0,
    INVALID_COMMAND = 1,
    NO_GAME = 2
}

class ConnectionRequest<T> {
    promise:Promise<T>;
    private resolveF:( (value: T | PromiseLike<T>) => void ) | null = null;
    private rejectF:( (reason?:unknown) => void ) | null = null;
    //private timeout:number = Date.now() + 60 * 1000;

    constructor( public id:number, public command:string, public data:string ) {
        this.promise = Promise.race( [
            new Promise<T>( ( res, rej ) => [this.resolveF, this.rejectF] = [res, rej] ),
            new Promise<T>( ( res, rej ) => setTimeout(
                () => rej( "Timeout" ),
                60 * 1000
            ) )
        ] )
    }

    serialize():string {
        return this.id.toString() + "|" + this.command + "|" + this.data
    }

    /*isTimeout( timestamp:number ):boolean {
        return timestamp > this.timeout;
    }*/

    resolve( value:T ):void {
        if( this.resolveF != null )
            this.resolveF( value )
    }

    reject( reason:unknown ):void {
        if( this.rejectF != null )
            this.rejectF( reason )
    }
}

export class Connection {
    private connection:WebSocket | null = null
    private connecting = false
    private sessionID:string | null = null
    private nextID = 1
    private nextAnswerID = -1
    private requests:Map<number, ConnectionRequest<string>> = new Map()
    private openConfirmations:number[] = []
    private openInput:Map<number, string> = new Map()
    //private queue:Queue<ConnectionRequest<string>> = new Queue()
    /*private timeoutTimer:number

    constructor() {
        this.timeoutTimer = setInterval( () => Connection.checkTimeout( this ), 5000 )
    }

    private static checkTimeout( t:Connection ):void {
        const timestamp = Date.now();
        for( const entry of t.requests.entries() )
            if( entry[1].isTimeout( timestamp ) ) {
                t.requests.delete( entry[0] )
                entry[1].reject( "Timeout" )//ConnectionError.TIMEOUT. )
            }
    }*/

    connect( sessionID:string ) {
        this.connecting = true;
        this.sessionID = sessionID;
        this.connection = new WebSocket( "wss://wa-catan-server.herokuapp.com//websocket/" + sessionID );
        this.connection.onopen = () => this.onOpen()
        this.connection.onmessage = ( message:MessageEvent ) => this.onMessage( message )
        this.connection.onerror = ( error:Event ) => this.onError( error )
        this.connection.onclose = ( reason:Event ) => this.onClose( reason )
    }

    private onOpen():void {
        this.connecting = false;
        console.log( "WebSocket opened!" )
        this.nextAnswerID = -1
        this.requestNextAnswerID()
        if( this.openConfirmations.length > 0 && this.send( JSON.stringify( this.openConfirmations.map( id => `!${id}` ) ) ) )
            this.openConfirmations = []
        if( this.requests.size > 0 )
            this.send( JSON.stringify( Array.from( this.requests.values() ).map( r => r.serialize() ) ) )
        //this.requests.forEach( ( request ) => this.send( request.serialize() ) )
    }

    private requestNextAnswerID():void {
        this.send( "-" )
    }

    private onMessage( message:MessageEvent ):void {
        const msg:string = message.data
        //if( msg.length <= 50 )
            console.log( { nextAnswerID: this.nextAnswerID, msg: msg } )
        //else
         //   console.log( { msg: msg.substring( 0, 50 ) + " ...", nextAnswerID: this.nextAnswerID } )
        if( msg.startsWith( "-" ) && this.nextAnswerID < 0 ) {
            this.nextAnswerID = parseInt( msg.substring( 1 ) ) ?? -1
            if( this.nextAnswerID >= 0 )
                this.checkOpenInput()
        } else if( msg.startsWith( "[" ) )
            ( JSON.parse( msg ) as string[] ).forEach( m => this.handleRawMessage( m ) )
        else this.handleRawMessage( msg )
    }

    private checkOpenInput():void {
        const nextInput:string | undefined = this.openInput.get( this.nextAnswerID )
        if( nextInput !== undefined ) {
            this.openInput.delete( this.nextAnswerID )
            this.handleMessage( nextInput )
        }
    }

    private handleRawMessage( rawMsg:string ) {
        const i:number = rawMsg.indexOf( "|" )
        if( i <= 0 )
            return
        const msgID:number | undefined = parseInt( rawMsg.substring( 0, i ) )
        if( msgID === undefined )
            return
        this.confirm( msgID )
        const body:string = rawMsg.substring( i + 1 )
        if( msgID == this.nextAnswerID )
            this.handleMessage( body )
        else if( msgID > this.nextAnswerID ) {
            if( this.nextAnswerID < 0 )
                this.requestNextAnswerID()
            this.openInput.set( msgID, body )
        }
    }

    private handleMessage( msg:string ):void {
        console.log( "Handle: " + msg )
        this.nextAnswerID++
        const i:number = msg.indexOf( "|" )
        if( i >= 0 ) {
            const head:string = msg.substring( 0, i )
            const data:string = msg.substring( i + 1 )
            if( head.startsWith( "!" ) )
                this.handleMessageError( head.length > 1 ? parseInt( head.substring( 1 ) ) : undefined, data )
            else if( head.startsWith( "?" ) ) {
                const update:string = head.substring( 1 )
                if( update.length > 0 )
                    this.onUpdate( update, data )
            } else {
                const id:number | undefined = parseInt( head )
                if( id !== undefined ) {
                    const request:ConnectionRequest<string> | undefined = this.requests.get( id )
                    if( request !== undefined ) {
                        request.resolve( data )
                        this.requests.delete( id )
                    }
                }
            }
        }
        this.checkOpenInput()
    }

    private confirm( id:number ) {
        if( !this.send( `!${id}` ) )
            this.openConfirmations.push( id )
    }

    private handleMessageError( id:number | undefined, data:string ) {
        let code:number | undefined = undefined
        let reason:string = data
        const i = data.indexOf( "|" )
        if( i >= 0 ) {
            code = parseInt( data.substring( 0, i ) )
            reason = data.substring( i + 1 )
        }
        if( id !== undefined ) {
            const request:ConnectionRequest<string> | undefined = this.requests.get( id )
            if( request !== undefined ) {
                //if( data != "2|NoGame" )
                //    alert( data )
                request.reject( reason )
                this.requests.delete( id )
            }
        }
    }

    private onError( error:Event ):void {
        console.log( "Error: ", error )
    }

    private onClose( reason:Event ):void {
        console.log( "WebSocket closed!", reason )
        this.connect( this.sessionID! )
    }

    private send( msg:string ):boolean {
        if( !this.connecting ) {
            if( this.connection !== null ) {
                console.log( "Send: " + msg )
                this.connection?.send( msg )
                return true
            } else {
                this.connect( this.sessionID! )
            }
        }
        return false
    }

    execute( command:string, data = "" ):Promise<string> {
        const request:ConnectionRequest<string> = new ConnectionRequest<string>( this.nextID++, command, data )
        this.requests.set( request.id, request )
        this.send( request.serialize() )
        return request.promise;
    }

    private onUpdate( update:string, data:string ):void {
        console.log( "Update: " + update )
        switch ( update ) {
            case "info": return store.setInfo( data ) // alert( data )
            case "gameUpdate": return store.gameUpdate( data )
            case "gameData": return store.updateGameData( data )
            case "game": return store.updateGame( data )
            case "gameValues": return store.updateGameValues( data )
            case "gameStatus": return store.updateGameStatus( data )
            case "gameField": return store.updateGameField( data
            )
            case "players": return store.updatePlayers( data )
            case "state": return store.updateState( data )
            case "turn": return store.updateTurn( data )
        }
    }
}
