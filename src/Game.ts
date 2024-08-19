import Phaser from "phaser";
import {Start} from "./scenes/Start.ts";
import {PlayerSelection} from "./scenes/PlayerSelection.ts";
import {NextEnemy} from "./scenes/NextEnemy.ts";
import {Battle} from "./scenes/Battle.ts";
import {MatchOutcome} from "./scenes/MatchOutcome.ts";
import {Final} from "./scenes/Final.ts";

export class Game extends Phaser.Game {
    constructor(parent: string) {
        super(
            {
                type: Phaser.AUTO,
                backgroundColor: "#000000",
                scale: {
                    mode: Phaser.Scale.FIT,
                    width: 1980,
                    height: 1080,
                    parent: parent,
                    expandParent: false,
                },
            }
        );
        this.scene.add("Start", Start, false);
        this.scene.add("PlayerSelection", PlayerSelection, false);
        this.scene.add("NextEnemy", NextEnemy, false);
        this.scene.add("Battle", Battle, false);
        this.scene.add("MatchOutcome", MatchOutcome, false);
        this.scene.add("Final", Final, false);
        this.scene.start("Start");
    }
}