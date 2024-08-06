import Phaser from "phaser";
import {StartScene} from "./StartScene.ts";
import {PlayerSelectionScene} from "./PlayerSelectionScene.ts";
import {NextEnemyScene} from "./NextEnemyScene.ts";
import {BattleScene} from "./BattleScene.ts";

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
        this.scene.add('NextEnemy', NextEnemyScene, false);
        this.scene.add('Battle', BattleScene, false);
        this.scene.start('Start');
        // this.scene.start('PlayerSelection');
        // this.scene.start('NextEnemy');
        // this.scene.start('Battle');
    }
}