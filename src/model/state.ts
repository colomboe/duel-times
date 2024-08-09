import {Player, players} from "./players.ts";
import {Question} from "./model.ts";

export interface GameStatus {
    selectedPlayer: Player,
    rivals: Rival[],
    currentMatch: CurrentMatch,
}

export interface Rival {
    id: string,
    status: 'HIDDEN' | 'CURRENT' | 'DEFEATED',
}

export interface CurrentMatch {
    rivalIndex: number,
    energy: {
        player: number,
        rival: number,
    }
    currentQuestion?: Question,
    winner?: 'PLAYER' | 'RIVAL',
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
    ],
    currentMatch: {
        rivalIndex: 0,
        energy: {
            player: 100,
            rival: 100,
        },
        currentQuestion: undefined,
        winner: 'PLAYER',
    }
};