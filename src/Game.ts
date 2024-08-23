import Phaser from "phaser";
import {Start} from "./scenes/Start.ts";
import {PlayerSelection} from "./scenes/PlayerSelection.ts";
import {NextEnemy} from "./scenes/NextEnemy.ts";
import {Battle} from "./scenes/Battle.ts";
import {MatchOutcome} from "./scenes/MatchOutcome.ts";
import {Final} from "./scenes/Final.ts";
import {Story} from "./scenes/Story.ts";
import CENTER_BOTH = Phaser.Scale.CENTER_BOTH;

export class Game extends Phaser.Game {
    constructor(parent: string) {
        super(
            {
                type: Phaser.AUTO,
                backgroundColor: "#000000",
                scale: {
                    mode: Phaser.Scale.FIT,
                    width: 1920,
                    height: 1080,
                    parent: parent,
                    expandParent: false,
                    autoCenter: CENTER_BOTH,
                },
            }
        );
        this.scale.displaySize.setAspectRatio(1920/1080.0);
        this.scale.refresh();
        this.scene.add("Start", Start, false);
        this.scene.add("PlayerSelection", PlayerSelection, false);
        this.scene.add("Story", Story, false);
        this.scene.add("NextEnemy", NextEnemy, false);
        this.scene.add("Battle", Battle, false);
        this.scene.add("MatchOutcome", MatchOutcome, false);
        this.scene.add("Final", Final, false);
        this.scene.start("Start");
    }
}