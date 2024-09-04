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
    black: 0x000000,
    red: 0xFF0000,
    yellow: 0xFFEE58,
};

export const paletteString = {
    blue: "#336699",
    darkGray: "#333333",
    lightGray: "#aaaaaa",
    lightCyan: "#ccffff",
    yellow: "#ffcc00",
    lightPink: "#f3dcff",
    green: "#289f00",
    darkGreen: "#123e00",
    darkRed: "#600000",
    red: "#ff3a3a",
    gold: "#665200",
    purple: "#765387",
};

export const timing = {
    fastTransition: 1000,
    midTransition: 2000,
    textReadingPause: 3000,
};

export type Fonts = "veryBig" | "big" | "normal" | "small" | "verySmall";

export const fonts: Record<Fonts, (color: string) => TextStyle> = {
    veryBig: color => ({fontFamily: "Arial Black, Arial-BoldMT", fontSize: 224, color: color}),
    big: color => ({fontFamily: "Arial Black, Arial-BoldMT", fontSize: 74, color: color}),
    normal: color => ({fontFamily: "Arial Black, Arial-BoldMT", fontSize: 56, color: color}),
    small: color => ({fontFamily: "Arial", fontSize: 48, color: color}),
    verySmall: color => ({fontFamily: "Arial Black, Arial-BoldMT", fontSize: 28, color: color}),
};