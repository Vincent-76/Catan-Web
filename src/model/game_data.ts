export interface JMapEntry<K, V> {
    k: K,
    v: V
}

export type JMap<K, V> = JMapEntry<K, V>[]

export interface ClassicGameData {
    gameID:string,
    host:boolean,
    playerID: PlayerID | null,
    game: ClassicGame,
    gameStatus: GameStatus,
    resourceImages: JMap<string, Array<number>>,
    gameValues: GameValues
}

export interface GameValues {
    minPlayers:number,
    maxPlayers:number,
    requiredVictoryPoints:number,
    maxHandCards:number,
    defaultBankTradeFactor:number,
    unspecifiedPortFactor:number,
    specifiedPortFactor:number,
    maxPlayerNameLength:number,
    usableDevCards:string[],
    bonusCardVictoryPoints:JMap<string, number>
}

export interface GameStatus {
    hasUndo: boolean,
    hasRedo: boolean,
    buildablePoints: PlacementPointID[],
}

export interface PlacementPointID {
    class: string,
    id: number
}



export interface PlayerID {
    id: number
}



export interface ClassicGame {
    gameField: ClassicGameField,
    turn: ClassicTurn,
    seed: number,
    availablePlacements: string[],
    state: any, // TODO
    resourceStack: JMap<string, number>,
    developmentCards: string[],
    players: JMap<PlayerID, ClassicPlayer>,
    bonusCards: JMap<string, [PlayerID, number] | null>,
    winner: PlayerID | null
}



export interface ClassicGameField {
    field: (Hex | null)[][],
    edges: JMap<[number, number], Edge>,
    vertices: JMap<[number, number, number], Vertex>,
    robber: number
}

export interface Hex {
    hID: number,
    row: number,
    col: number,
    area: Area
}

export interface Edge {
    id: number,
    h1: number,
    h2: number,
    port: Port | null,
    road: Road | null
}

export interface Vertex {
    id: number,
    h1: number,
    h2: number,
    h3: number,
    port: Port | null,
    building: Building | null
}

export interface Area {
    class: string,
    port: Port | null,
    resource: string | null,
    number: string | null
}

export interface Port {
    specific: string | null
}

export interface Road {
    class: string,
    owner: PlayerID
}

export interface Building {
    class: string,
    owner: PlayerID
}



export interface ClassicTurn {
    playerID: PlayerID,
    usedDevCard: boolean,
    drawnDevCards: string[]
}

export interface ClassicPlayer {
    id: PlayerID,
    color: string,
    name: string,
    resources: JMap<string, number>,
    devCards: string[],
    usedDevCards: string[],
    victoryPoints: number,
    structures: JMap<string, number>
}