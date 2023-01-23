import {ClassicPlayer, Edge, JMap, Vertex} from "@/model/game_data";
import store from "@/store"
import { Hex } from "@/model/game_data"

export function pBGColorClass( color:string ):string {
    switch ( color ) {
        case "Green": return "pBGColorGreen"
        case "Blue": return "pBGColorBlue"
        case "Yellow": return "pBGColorYellow"
        case "Red": return "pBGColorRed"
    }
    return ""
}

export function pTextColorClass( color:string ):string {
    switch ( color ) {
        case "Green": return "pTextColorGreen"
        case "Blue": return "pTextColorBlue"
        case "Yellow": return "pTextColorYellow"
        case "Red": return "pTextColorRed"
    }
    return ""
}

export function pBorderColorClass( color:string ):string {
    switch ( color ) {
        case "Green": return "pBorderColorGreen";
        case "Blue": return "pBorderColorBlue";
        case "Yellow": return "pBorderColorYellow";
        case "Red": return "pBorderColorRed";
    }
    return ""
}

export function playerDisplayVictoryPoints( player:ClassicPlayer ):number {
    return player.victoryPoints + (
        store.gameData?.game.bonusCards
            .filter( e => e.v?.[0].id === player.id.id )
            .map( e => store.gameData?.gameValues.bonusCardVictoryPoints.find( b => b.k === e.k )?.v ?? 0 )
            .reduce( ( sum, n ) => sum + n, 0 ) ?? 0
    )
}

const adjacentOffset:[number, number][] = [ [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1] ]
export { adjacentOffset }

export function findHex( r:number, c:number, data:(Hex | null)[][] ):Hex | null {
    return data[r]?.[c]
}

export function findEdge( h:[number, number], edges:JMap<[number, number], Edge> ):Edge | undefined {
    const sortedHexes = h[0] < h[1] ? h : [h[1], h[0]]
    return edges.find( e => e.k[0] === sortedHexes[0] && e.k[1] === sortedHexes[1] )?.v
}

export function adjacentEdge( hex:Hex, offsetIndex:number, data:(Hex | null)[][], edges:JMap<[number, number], Edge> ):Edge | undefined {
    if( offsetIndex < adjacentOffset.length ) {
        const o = adjacentOffset[offsetIndex]
        const hex1 = findHex( hex.row + o[0], hex.col + o[1], data )
        return hex1 !== null && hex1 !== undefined ? findEdge( [hex.hID, hex1.hID], edges ) : undefined
    }
    return undefined
}

export function adjacentVertex( hex:Hex, offsetIndex1:number, offsetIndex2:number, data:(Hex | null)[][], vertices:JMap<[number, number, number], Vertex> ):Vertex | undefined {
    if( offsetIndex1 < adjacentOffset.length && offsetIndex2 < adjacentOffset.length ) {
        const o1 = adjacentOffset[offsetIndex1]
        const o2 = adjacentOffset[offsetIndex2]
        const h1 = findHex( hex.row + o1[0], hex.col + o1[1], data )
        const h2 = findHex( hex.row + o2[0], hex.col + o2[1], data )
        if( h1 !== null && h1 !== undefined && h2 !== null && h2 !== undefined ) {
            const hIDs = [ hex.hID, h1.hID, h2.hID ].sort( ( a, b ) => a - b )
            return vertices.find( e => e.k[0] === hIDs[0] && e.k[1] === hIDs[1] && e.k[2] === hIDs[2] )?.v
        }
    }
    return undefined
}


export function resourcesString( prefix:string, resources:JMap<string, number> ):string {
    return resources.filter( e => e.v > 0 ).map( e => `${prefix} ${e.v} ${e.k}` ).join( ", " )
}

export function toLength( s:string, l:number ) {
    if( s.length > length )
        return s.substring( 0, l )
    else
        return Array.from( Array( length - s.length ) ).reduce(
            r => r + " ",
            s
        )
}