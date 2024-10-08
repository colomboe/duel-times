import {Complextity, CurrentMatch, GameStatus, Level, Player} from "./definitions.ts";

export function getInitialMatch(): CurrentMatch {
    return {
        currentLevel: getLevels()[0],
        energy: {
            player: 100,
            rival: 100,
        },
        currentQuestion: undefined,
        winner: "PLAYER",
    };
}

export function getLevels(): Level[] {
    return [
        { index: 0, status: "CURRENT", background: "forest1", complexity: "EASY", rival: { finalBoss: false, avatar: "dog", responseDelay: 20, precision: 70 } },
        { index: 1, status: "HIDDEN", background: "sunflowers1", complexity: "EASY", rival: { finalBoss: false, avatar: "snail", responseDelay: 8, precision: 75 } },
        { index: 2, status: "HIDDEN", background: "river1", complexity: "MEDIUM", rival: { finalBoss: false, avatar: "elephant", responseDelay: 6, precision: 80 } },
        { index: 3, status: "HIDDEN", background: "waterfall1", complexity: "MEDIUM", rival: { finalBoss: false, avatar: "fish", responseDelay: 6, precision: 85 } },
        { index: 4, status: "HIDDEN", background: "forest2", complexity: "MEDIUM", rival: { finalBoss: false, avatar: "monkey", responseDelay: 6, precision: 90 } },
        { index: 5, status: "HIDDEN", background: "school1", complexity: "HARD", rival: { finalBoss: false, avatar: "cat", responseDelay: 5, precision: 90 } },
        { index: 6, status: "HIDDEN", background: "volcano2", complexity: "HARD", rival: { finalBoss: false, avatar: "rock", responseDelay: 5, precision: 90 } },
        { index: 7, status: "HIDDEN", background: "sky1", complexity: "HARD", rival: { finalBoss: false, avatar: "eagle", responseDelay: 8, precision: 95 } },
        { index: 8, status: "HIDDEN", background: "rome1", complexity: "HARD", rival: { finalBoss: false, avatar: "tiger", responseDelay: 5, precision: 95 } },
        { index: 9, status: "HIDDEN", background: "castle1", complexity: "HARD", rival: { finalBoss: true, avatar: "mage", responseDelay: 3, precision: 100 } },
    ];
}

export const players: Player[] = [
    {id: "rem", label: "Rem"},
    {id: "john", label: "John"},
    {id: "nino", label: "Nino"},
    {id: "foxy", label: "Foxy"},
];

export const complexityMap: { [k in Complextity]: number[] } = {
    "EASY": [ 1, 2, 5, 10 ],
    "MEDIUM": [ 3, 4, 6, 7 ],
    "HARD": [ 4, 6, 7, 8, 9 ],
};

export const secondFactorValues = [ 3, 4, 6, 7, 8, 9 ];

export const gameStatus: GameStatus = {
    selectedPlayer: players[0],
    levels: getLevels(),
    currentMatch: getInitialMatch(),
};