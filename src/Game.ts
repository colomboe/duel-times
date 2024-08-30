import Phaser from "phaser";
import {scenes} from "./Config.ts";
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
        Object.entries(scenes).forEach(([id, scene]) => this.scene.add(id, scene, false));
        this.scene.start("Start");
    }
}