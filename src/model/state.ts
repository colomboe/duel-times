import {Player, players} from "./players.ts";
import {Question} from "./model.ts";
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
    levels: getLevels(),
    currentMatch: getInitialMatch(),
};

export function getInitialMatch(): CurrentMatch {
    return {
        rivalIndex: 0,
        energy: {
            player: 100,
            rival: 100,
        },
        currentQuestion: undefined,
        winner: 'PLAYER',
    };
}