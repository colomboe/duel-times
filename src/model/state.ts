import {Player, players} from "./players.ts";

export interface GameStatus {
    selectedPlayer: Player,
    rivals: Rival[],
}

export interface Rival {
    id: string,
    status: 'HIDDEN' | 'CURRENT' | 'DEFEATED',
}

export const gameStatus: GameStatus = {
    selectedPlayer: players[0],
    rivals: [
        { id: '1', status: 'CURRENT' },
        { id: '2', status: 'HIDDEN' },
        { id: '3', status: 'HIDDEN' },
        { id: '4', status: 'HIDDEN' },
        { id: '5', status: 'HIDDEN' },
        { id: '6', status: 'HIDDEN' },
        { id: '7', status: 'HIDDEN' },
        { id: '8', status: 'HIDDEN' },
        { id: '9', status: 'HIDDEN' },
        { id: '10', status: 'HIDDEN' },
    ]
}