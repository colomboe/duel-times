import {complexityMap, gameStatus, getInitialMatch, getLevels, secondFactorValues} from "./data.ts";
import {Actor, Level, Outcome, Question} from "./definitions.ts";

export function questionOutcome(actor: Actor, response: string): Outcome {

    const playerOk = (): Outcome => {
        gameStatus.currentMatch.energy.rival -= 10;
        const winner = (gameStatus.currentMatch.energy.rival <= 0) ? "PLAYER" : undefined;
        if (winner) gameStatus.currentMatch.winner = winner;
        return { damageEffect: "RIVAL", winner };
    };

    const rivalOk = (): Outcome => {
        gameStatus.currentMatch.energy.player -= 20;
        const winner = (gameStatus.currentMatch.energy.player <= 0) ? "RIVAL" : undefined;
        if (winner) gameStatus.currentMatch.winner = winner;
        return { damageEffect: "PLAYER", winner };
    };

    if (actor === "PLAYER")
        return (response === gameStatus.currentMatch.currentQuestion!.correctResponse) ? playerOk() : rivalOk();
    else
        return (response === gameStatus.currentMatch.currentQuestion!.correctResponse) ? rivalOk() : playerOk();
}

const recentQuestions: { a: number, b: number }[] = [];

export function nextQuestion(): Question {

    const enabledTables = complexityMap[gameStatus.currentMatch.currentLevel.complexity];

    let a = 0;
    let b = 0;

    do {
        a = enabledTables[Math.floor(Math.random() * enabledTables.length)];
        b = secondFactorValues[Math.floor(Math.random() * secondFactorValues.length)];
    } while (recentQuestions.find(recent => sameQuestion(recent, a, b)) !== undefined);

    if (recentQuestions.length >= 5) recentQuestions.shift();
    recentQuestions.push({ a, b });

    const correctAnswer = a * b;
    const answers = generatePossibleAnswers(correctAnswer, a, b);

    const newQuestion = {
        question: `${a} x ${b}`,
        response1: `${answers[0]}`,
        response2: `${answers[1]}`,
        response3: `${answers[2]}`,
        correctResponse: `${correctAnswer}`,
    };

    gameStatus.currentMatch.currentQuestion = newQuestion;
    return newQuestion;
}

export function prepareForNextRival() {
    gameStatus.levels[gameStatus.currentMatch.currentLevel.index].status = "DEFEATED";
    gameStatus.levels[gameStatus.currentMatch.currentLevel.index + 1].status = "CURRENT";

    gameStatus.currentMatch = {
        currentLevel: gameStatus.levels[gameStatus.currentMatch.currentLevel.index + 1],
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

export function evaluateRivalSelection(): string {
    const correctAnswer = Math.random() * 100 <= gameStatus.currentMatch.currentLevel.rival.precision;
    return correctAnswer ? gameStatus.currentMatch.currentQuestion!.correctResponse : "WRONG";
}

export function resetGame() {
    gameStatus.levels = getLevels();
    gameStatus.currentMatch = getInitialMatch();
}

function generatePossibleAnswers(correctAnswer: number, a: number, b: number): number[] {

    const uniqueIntegers = new Set<number>();
    uniqueIntegers.add(correctAnswer);

    while (uniqueIntegers.size < 3) {

        const delta = deltaByCase(a, b);
        uniqueIntegers.add(Math.abs(correctAnswer + delta));
    }

    const resultArray = Array.from(uniqueIntegers);

    // Shuffle the array to randomize the positions
    for (let i = resultArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultArray[i], resultArray[j]] = [resultArray[j], resultArray[i]];
    }

    return resultArray;
}

function deltaByCase(a: number, b: number): number {
    const randomCase = Math.floor(Math.random() * 8);
    switch (randomCase) {
        case 0: return -2 * a;
        case 1: return -a;
        case 2: return a;
        case 3: return 2 * a;
        case 4: return -2 * b;
        case 5: return -b;
        case 6: return b;
        case 7: return 2 * b;
        default: return 0;
    }
}

function sameQuestion(recent: { a: number, b: number }, a: number, b: number): boolean {
    return (recent.a == a && recent.b == b) || (recent.a == b && recent.b == a);
}