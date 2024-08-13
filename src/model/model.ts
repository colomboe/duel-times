// type Speed = number;        // seconds
// type Experience = number;    // 1 to 10 points
// type Difficulty = number;    // ? to ?? points

// interface Character {
//     speed: Speed,
//     experience: Experience
// }
//
// interface GameLevel {
//     targetDifficulty: Difficulty,
//     questionsNumber: number,
//
// }

import {gameStatus, getInitialMatch} from "./state.ts";
import {getLevels, Level} from "./levels.ts";

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

export function questionOutcome(actor: Actor, response: string): Outcome {

    const playerOk = (): Outcome => {
        gameStatus.currentMatch.energy.rival -= 10;
        const winner = (gameStatus.currentMatch.energy.rival <= 0) ? "PLAYER" : undefined;
        if (winner) gameStatus.currentMatch.winner = winner;
        return { damageEffect: "RIVAL", winner };
    };

    const rivalOk = (): Outcome => {
        gameStatus.currentMatch.energy.player -= 10;
        const winner = (gameStatus.currentMatch.energy.player <= 0) ? "RIVAL" : undefined;
        if (winner) gameStatus.currentMatch.winner = winner;
        return { damageEffect: "PLAYER", winner };
    };

    if (actor === "PLAYER")
        return (response === gameStatus.currentMatch.currentQuestion!.correctResponse) ? playerOk() : rivalOk();
    else
        return (response === gameStatus.currentMatch.currentQuestion!.correctResponse) ? rivalOk() : playerOk();
}

export function nextQuestion(): Question {

    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const correctResponse = a * b;
    const correctResponsePosition = Math.floor(Math.random() * 3) + 1;
    const randomResponse = () => Math.floor(Math.random() * 100) + 1;

    const newQuestion = {
        question: `${a} x ${b}`,
        response1: `${correctResponsePosition === 1 ? correctResponse : randomResponse()}`,
        response2: `${correctResponsePosition === 2 ? correctResponse : randomResponse()}`,
        response3: `${correctResponsePosition === 3 ? correctResponse : randomResponse()}`,
        correctResponse: `${correctResponse}`,
    };

    gameStatus.currentMatch.currentQuestion = newQuestion;
    return newQuestion;
}

export function prepareForNextRival() {
    gameStatus.levels[gameStatus.currentMatch.rival.index].status = "DEFEATED";
    gameStatus.levels[gameStatus.currentMatch.rival.index + 1].status = "CURRENT";

    gameStatus.currentMatch = {
        rival: {
            index: gameStatus.currentMatch.rival.index + 1,
            responseDelay: 4000,    // TODO
        },
        energy: {
            player: 100,
            rival: 100,
        },
        currentQuestion: undefined,
        winner: undefined,
    };
}

export function getCurrentLevel(): Level {
    return gameStatus.levels.find(l => l.status === "CURRENT")!;
}

export function getDefeatedCount(): number {
    return gameStatus.levels.filter(l => l.status === "DEFEATED").length;
}

export function resetGame() {
    gameStatus.levels = getLevels();
    gameStatus.currentMatch = getInitialMatch();

}