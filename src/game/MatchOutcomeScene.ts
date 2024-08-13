import Image = Phaser.GameObjects.Image;
import {gameStatus} from "../model/data.ts";
import {getCurrentLevel, prepareForNextRival, resetGame} from "../model/actions.ts";

export class MatchOutcomeScene extends Phaser.Scene {

    private playerAvatar?: Image;
    private rivalAvatar?: Image;

    preload() {
    }

    create() {

        const currentLevel = getCurrentLevel();

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.add.image(screenCenterX, screenCenterY, `background-${currentLevel.index}`)
            .setAlpha(0.2)
            .setScale(0.9);

        const pressToStartText = this.add.text(
            screenCenterX,
            200,
            "The winner is:",
            {fontFamily: "Arial Black", fontSize: 74, color: "#ccffff"}
        );
        pressToStartText.setStroke("#336699", 16);
        pressToStartText.setShadow(2, 2, "#333333", 2, true, false);
        pressToStartText.setOrigin(0.5);

        this.cameras.main.fadeIn(400, 0, 0, 0);
        setTimeout(() => this.afterFadeIn(), 700);
    }

    afterFadeIn() {

        const currentLevel = getCurrentLevel();

        const playerImage = gameStatus.currentMatch.winner === "PLAYER" ? `player-winner-${gameStatus.selectedPlayer.id}` : `player-defeated-${gameStatus.selectedPlayer.id}`;
        const rivalImage = gameStatus.currentMatch.winner === "RIVAL" ? `rival-${currentLevel.index}` : `rival-defeated-${currentLevel.index}`;

        this.playerAvatar = this.add.image(600, 600, playerImage)
            .setScale(0.3)
            .setOrigin(0.5, 0.5);

        this.rivalAvatar = this.add.image(1400, 600, rivalImage)
            .setScale(0.3)
            .setOrigin(0.5, 0.5);

        const imageToScale = gameStatus.currentMatch.winner === "PLAYER" ? this.playerAvatar : this.rivalAvatar;

        this.tweens.chain({
            tweens: [
                {
                    targets: [this.playerAvatar, this.rivalAvatar],
                    alpha: {
                        getStart: () => 0,
                        getEnd: () => 1,
                    },
                    y: {
                        getStart: () => 700,
                        getEnd: () => 600,
                    },
                    ease: "Sine.out",
                    duration: 1000,
                },
                {
                    targets: imageToScale,
                    scale: {
                        getStart: () => 0.3,
                        getEnd: () => 0.6,
                    },
                    ease: "Sine.out",
                    duration: 1000,
                },
            ]
        }).play();

        setTimeout(() => {
            this.input.once("pointerdown", () => {
                this.tweens.add({
                    targets:  this.sound.get("in-game-music"),
                    volume: {
                        getStart: () => 0.5,
                        getEnd: () => 0,
                    },
                    duration: 1000
                });
                this.cameras.main.fadeOut(1000, 0, 0, 0);
            });

            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {

                this.sound.get("in-game-music").stop();

                if (gameStatus.currentMatch.winner === "RIVAL") {
                    resetGame();
                    this.scene.start("Start");
                }
                else {
                    prepareForNextRival();
                    this.scene.start("NextEnemy");
                }
            });
        }, 2000);

    }

}