import {Player, players} from "./players.ts";
import {Question} from "./model.ts";
import {Level, levels} from "./levels.ts";

export interface GameStatus {
    selectedPlayer: Player,
    levels: Level[],
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
    levels: levels,
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