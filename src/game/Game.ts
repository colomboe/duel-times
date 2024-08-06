import Phaser from "phaser";
import {StartScene} from "./StartScene.ts";
import {PlayerSelectionScene} from "./PlayerSelectionScene.ts";
import {NextEnemy} from "./NextEnemy.ts";

export class Game extends Phaser.Game {
    constructor(parent: string) {
        super(
            {
                type: Phaser.AUTO,
                backgroundColor: '#000000',
                scale: {
                    mode: Phaser.Scale.FIT,
                    width: 1980,
                    height: 1080,
                    parent: parent,
                    expandParent: false,
                },
            }
        );
        this.scene.add('Start', StartScene, false);
        this.scene.add('PlayerSelection', PlayerSelectionScene, false);
        this.scene.add('NextEnemy', NextEnemy, false);
        this.scene.start('Start');
        // this.scene.start('PlayerSelection');
        // this.scene.start('NextEnemy');
    }
}