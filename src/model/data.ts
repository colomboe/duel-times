import {CurrentMatch, GameStatus, Level, Player} from "./definitions.ts";

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
        { index: 0, status: "CURRENT", background: "forest1", complexity: "EASY", rival: { avatar: "dog", responseDelay: 14, precision: 60 } },
        { index: 1, status: "HIDDEN", background: "sunflowers1", complexity: "EASY", rival: { avatar: "snail", responseDelay: 13, precision: 65 } },
        { index: 2, status: "HIDDEN", background: "river1", complexity: "EASY", rival: { avatar: "elephant", responseDelay: 12, precision: 70 } },
        { index: 3, status: "HIDDEN", background: "waterfall1", complexity: "MEDIUM", rival: { avatar: "fish", responseDelay: 12, precision: 75 } },
        { index: 4, status: "HIDDEN", background: "forest2", complexity: "MEDIUM", rival: { avatar: "monkey", responseDelay: 12, precision: 80 } },
        { index: 5, status: "HIDDEN", background: "school1", complexity: "HARD", rival: { avatar: "cat", responseDelay: 11, precision: 85 } },
        { index: 6, status: "HIDDEN", background: "volcano2", complexity: "HARD", rival: { avatar: "rock", responseDelay: 10, precision: 90 } },
        { index: 7, status: "HIDDEN", background: "sky1", complexity: "HARD", rival: { avatar: "eagle", responseDelay: 9, precision: 95 } },
        { index: 8, status: "HIDDEN", background: "rome1", complexity: "HARD", rival: { avatar: "tiger", responseDelay: 8, precision: 95 } },
        { index: 9, status: "HIDDEN", background: "castle1", complexity: "HARD", rival: { avatar: "mage", responseDelay: 3, precision: 100 } },
    ];
}

export const players: Player[] = [
    {id: "rem", label: "Rem"},
    {id: "john", label: "John"},
    {id: "nino", label: "Nino"},
    {id: "foxy", label: "Foxy"},
];

export const gameStatus: GameStatus = {
    selectedPlayer: players[0],
    levels: getLevels(),
    currentMatch: getInitialMatch(),
};