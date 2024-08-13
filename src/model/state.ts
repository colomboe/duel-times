import {Player, players} from "./players.ts";
import {Actor, Question} from "./model.ts";
import {getLevels, Level} from "./levels.ts";

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
    rival: {
        index: number,
        responseDelay: number,
    },
    energy: {
        player: number,
        rival: number,
    }
    currentQuestion?: Question,
    winner?: Actor,
}

export const gameStatus: GameStatus = {
    selectedPlayer: players[0],
    levels: getLevels(),
    currentMatch: getInitialMatch(),
};

export function getInitialMatch(): CurrentMatch {
    return {
        rival: {
            index: 0,
            responseDelay: 4000,
        },
        energy: {
            player: 100,
            rival: 100,
        },
        currentQuestion: undefined,
        winner: 'PLAYER',
    };
}