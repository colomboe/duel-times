export type Complextity = "EASY" | "MEDIUM" | "HARD";

export interface Player {
    id: string,
    label: string,
}

export interface Rival {
    avatar: string,
    responseDelay: number,  // seconds
    precision: number,      // 0 - 100 (%)
}

export interface Level {
    index: number,
    status: "HIDDEN" | "CURRENT" | "DEFEATED",
    background: string,
    complexity: Complextity,
    rival: Rival
}

export interface GameStatus {
    selectedPlayer: Player,
    levels: Level[],
    currentMatch: CurrentMatch,
}

export type Actor = "PLAYER" | "RIVAL";

export interface Question {
    question: string,
    response1: string,
    response2: string,
    response3: string,
    correctResponse: string,
}

export interface Outcome {
    damageEffect: Actor;
    winner: undefined | Actor;
}

export interface CurrentMatch {
    currentLevel: Level
    energy: {
        player: number,
        rival: number,
    }
    currentQuestion?: Question,
    winner?: Actor,
}
