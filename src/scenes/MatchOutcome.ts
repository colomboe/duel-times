import Image = Phaser.GameObjects.Image;
import {gameStatus} from "../model/data.ts";
import {getCurrentLevel, prepareForNextRival, resetGame} from "../model/actions.ts";
import {dictionary} from "../model/i18n.ts";
import {fonts, paletteString, timing} from "../Config.ts";
import {BaseScene} from "./BaseScene.ts";

export class MatchOutcome extends BaseScene {

    private bg?: Image;
    private playerAvatar?: Image;
    private rivalAvatar?: Image;

    create() {

        const center = this.screenCenter();

        this.bg = this.add.image(center.x, center.y, "battle_background")
            .setAlpha(0.2)
            .setScale(0.9);

        this.add.text(center.x, 200, dictionary.winner, fonts.big(paletteString.lightCyan))
            .setStroke(paletteString.blue, 16)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5);

        this.fadeInAndThen(() => this.afterFadeIn(), timing.veryFastTransition);
    }

    private afterFadeIn() {

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

        const tween = this.tweens.chain({
            tweens: [
                {
                    targets: [this.playerAvatar, this.rivalAvatar],
                    alpha: { getStart: () => 0, getEnd: () => 1 },
                    y: { getStart: () => 700, getEnd: () => 600 },
                    ease: "Sine.out",
                    duration: timing.fastTransition,
                },
                {
                    targets: imageToScale,
                    scale: { getStart: () => 0.3, getEnd: () => 0.6 },
                    ease: "Sine.out",
                    duration: timing.fastTransition,
                },
            ]
        }).play();

        tween.once("complete", () => {
            this.input.once("pointerdown", () => {
                this.tweens.add({
                    targets:  this.sound.get("in-game-music"),
                    volume: { getStart: () => 0.5, getEnd: () => 0 },
                    duration: timing.fastTransition * 0.9
                });

                this.fadeOutAndThen(() => this.proceedToNextStep());
            });
        });
    }

    private proceedToNextStep() {
        this.bg?.destroy();
        this.textures.remove("battle_background");

        this.sound.get("in-game-music").stop();
        this.sound.get("in-game-music").destroy();

        if (gameStatus.currentMatch.winner === "RIVAL") {
            resetGame();
            this.navigateTo("Start");
        }
        else if (gameStatus.currentMatch.currentLevel.rival.finalBoss) {
            resetGame();
            this.navigateTo("Final");
        }
        else {
            prepareForNextRival();
            this.navigateTo("NextEnemy");
        }
    }

}