import {gameStatus} from "../model/data.ts";
import {getDefeatedCount} from "../model/actions.ts";

export class NextEnemyScene extends Phaser.Scene {

    preload() {
    }

    create() {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const offsetX = this.cameras.main.worldView.x + this.cameras.main.width / 4;

        this.tweens.add({
            targets:  this.sound.get("intro-music"),
            volume: 0.5,
            duration: 500,
        });

        this.add
            .image(offsetX*2, 500, "rival-frame")
            .setScale(0.55);

        const scrollOffsetX = -offsetX * getDefeatedCount();

        gameStatus.levels.forEach((level) => {
            if (level.status === "HIDDEN") {
                this.add
                    .image(scrollOffsetX + offsetX * (level.index + 2), 500, "rival-placeholder")
                    .setAlpha(0.3, 0.3, 0.3, 0.3)
                    .setScale(0.35);
            }
            else if (level.status === "DEFEATED") {
                this.add
                    .image(scrollOffsetX + offsetX * (level.index + 2), 500, `rival-defeated-${level.index}`)
                    .setScale(0.35);
            }
            else {
                this.add
                    .image(scrollOffsetX + offsetX * (level.index + 2), 500, `rival-${level.index}`)
                    .setScale(0.35);
            }

        });

        const pressToStartText = this.add.text(
            screenCenterX,
            50,
            "Your next rival",
            {fontFamily: "Arial Black", fontSize: 74, color: "#ffcc00"}
        );
        pressToStartText.setStroke("#665200", 16);
        pressToStartText.setShadow(2, 2, "#333333", 2, true, false);
        pressToStartText.setOrigin(0.5);

        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.input.once("pointerdown", () => {
            this.sound.add("menu-sfx", { loop: false, volume: 1 }).play();
            this.tweens.add({
                targets:  this.sound.get("intro-music"),
                volume: {
                    getStart: () => 0.5,
                    getEnd: () => 0,
                },
                duration: 2000
            });
            this.cameras.main.fadeOut(2000, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start("Battle");
        });
    }

}