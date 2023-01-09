
import { store } from "@/store";

enum ConnectionError {
    TIMEOUT = 0,
    INVALID_COMMAND = 1,
    NO_GAME = 2
}

class ConnectionRequest<T> {
    promise:Promise<T>;
    private resolveF:( (value: T | PromiseLike<T>) => void ) | null = null;
    private rejectF:( (reason?:unknown) => void ) | null = null;
    private timeout:number = Date.now() + 60 * 1000;

    constructor( public id:number, public command:string, public data:string ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const t = this;
        this.promise = new Promise<T>( function( resolve, reject ) {
            t.resolveF = resolve;
            t.rejectF = reject;
        } )
    }

    serialize():string {
        return this.id.toString() + "|" + this.command + "|" + this.data
    }

    isTimeout( timestamp:number ):boolean {
        return timestamp > this.timeout;
    }

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
    private connection:WebSocket | null = null;
    private connecting = false;
    private sessionID:string | null = null;
    private count = 1;
    private requests:Map<number, ConnectionRequest<string>> = new Map();
    //private queue:Queue<ConnectionRequest<string>> = new Queue();
    private timeoutTimer:number;

    constructor() {
        this.timeoutTimer = setInterval( () => Connection.checkTimeout( this ), 3000 )
    }

    private static checkTimeout(t:Connection ):void {
        const timestamp = Date.now();
        for( const entry of t.requests.entries() )
            if( entry[1].isTimeout( timestamp ) ) {
                t.requests.delete( entry[0] )
                entry[1].reject( ConnectionError.TIMEOUT )
            }
    }

    connect( sessionID:string ) {
        this.connecting = true;
        this.sessionID = sessionID;
        this.connection = new WebSocket( "ws://localhost:9000/websocket/" + sessionID );
        this.connection.onopen = () => this.onOpen()
        this.connection.onmessage = ( message:MessageEvent ) => this.onMessage( message )
        this.connection.onerror = ( error:Event ) => this.onError( error )
        this.connection.onclose = ( reason:Event ) => this.onClose( reason )
    }

    private onOpen():void {
        this.connecting = false;
        console.log( "WebSocket opened!" )
        this.requests.forEach( ( request ) => this.send( request) )
    }

    private onMessage( message:MessageEvent ):void {
        const msg:string = message.data
        if( msg.length <= 50 )
            console.log( msg )
        else
            console.log( msg.substring( 0, 50 ) + " ..." )
        const i:number = msg.indexOf( "|" )
        if( i < 0 )
            return
        const head:string = msg.substring( 0, i )
        const data:string = msg.substring( i + 1 )
        if( head.startsWith( "?" ) ) {
            const event:string = head.substring( 1 )
            if( event.length > 0 )
                this.onEvent( event, data )
            return
        } else if( head.startsWith( "!" ) ) {
            const id:number | undefined = parseInt( head.substring( 1 ) )
            if( id === undefined )
                return
            const reason:number | string | undefined = Object.values( ConnectionError ).find( ( v ) => v == data )
            const request:ConnectionRequest<string> | undefined = this.requests.get( id )
            if( request !== undefined ) {
                alert( data )
                request.reject( reason )
                this.requests.delete( id )
            }
        } else {
            const id:number | undefined = parseInt( head )
            if( id === undefined )
                return
            const request:ConnectionRequest<string> | undefined = this.requests.get( id )
            if( request !== undefined ) {
                request.resolve( data )
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

    private send( request:ConnectionRequest<string> ):void {
        if( !this.connecting ) {
            if( this.connection !== null ) {
                console.log( "Send: " + request.serialize() )
                this.connection?.send(request.serialize())
            } else {
                this.connect( this.sessionID! )
            }
        } else {
            console.log( "Queued: " + request.serialize() )
        }
    }

    execute( command:string, data = "" ):Promise<string> {
        const request:ConnectionRequest<string> = new ConnectionRequest<string>( this.count++, command, data )
        this.requests.set( request.id, request )
        this.send( request )
        return request.promise;
    }

    private onEvent( event:string, data:string ):void {
        console.log( "Event: " + event )
        switch ( event ) {
            case "info": return alert( data )
            case "gameData": return store.updateGameData( data )
            case "game": return store.updateGame( data )
            case "players": return store.updatePlayers( data )
            case "state": return store.updateState( data )
            case "turn": return store.updateTurn( data )
        }
    }
}