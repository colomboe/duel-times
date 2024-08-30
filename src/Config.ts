import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;
import {Start} from "./scenes/Start.ts";
import {PlayerSelection} from "./scenes/PlayerSelection.ts";
import {Story} from "./scenes/Story.ts";
import {NextEnemy} from "./scenes/NextEnemy.ts";
import {Battle} from "./scenes/Battle.ts";
import {MatchOutcome} from "./scenes/MatchOutcome.ts";
import {Final} from "./scenes/Final.ts";

export const scenes = {
    Start: Start,
    PlayerSelection: PlayerSelection,
    Story: Story,
    NextEnemy: NextEnemy,
    Battle: Battle,
    MatchOutcome: MatchOutcome,
    Final: Final,
};

export type SceneName = keyof typeof scenes;

export const paletteHex = {
    green: 0x0EC756,
    gray: 0x777777,
};

export const paletteString = {
    blue: "#336699",
    darkGray: "#333333",
    lightGray: "#aaaaaa",
    lightCyan: "#ccffff",
};

export const timing = {
    fastTransition: 1000,
    midTransition: 2000,
    textReadingPause: 3000,
};

export const fonts: Record<string, TextStyle> = {
    "bigLight": {fontFamily: "Arial Black, Arial-BoldMT", fontSize: 74, color: "#ccffff"},
};