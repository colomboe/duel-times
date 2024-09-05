import Image = Phaser.GameObjects.Image;
import Rectangle = Phaser.GameObjects.Rectangle;
import Text = Phaser.GameObjects.Text;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import Container = Phaser.GameObjects.Container;
import Tween = Phaser.Tweens.Tween;
import {gameStatus} from "../model/data.ts";
import {evaluateRivalSelection, getCurrentLevel, nextQuestion, questionOutcome} from "../model/actions.ts";
import {Actor, Level, Question} from "../model/definitions.ts";
import {fonts, paletteHex, paletteString, timing} from "../Config.ts";
import {BaseScene} from "./BaseScene.ts";

const PAUSE_AFTER_FADE_IN_DURATION = 500;
const ENERGY_BAR_LOADING_DURATION = 1500;
const COUNTER_INTERVAL = 1000;
const SLIDE_QUESTION_DURATION = 500;
const PAUSE_BEFORE_OUTCOME_SCENE_DURATION = 2000;

const avatarY = 780;
const playerAvatarX = 307;
const rivalAvatarX = 1673;

export class Battle extends BaseScene {

    private bg?: Image;
    private rival?: Image;
    private player?: Image;
    private playerEnergy?: Rectangle;
    private rivalEnergy?: Rectangle;
    private rivalProgress?: Rectangle;
    private rivalProgressTween?: Tween;
    private questionText?: Text;
    private response1?: Text;
    private response2?: Text;
    private response3?: Text;
    private questionContainer?: Container;
    private playerEmitter?: ParticleEmitter;
    private rivalEmitter?: ParticleEmitter;
    private currentQuestion?: Question;
    private doubleTapLock: boolean = false;

    preload() {
        const currentLevel = getCurrentLevel();
        this.load.image("battle_background", `game-assets/backgrounds/${currentLevel.background}.jpeg`);
    }

    create() {

        this.doubleTapLock = false;
        const currentLevel = getCurrentLevel();
        const center = this.screenCenter();

        this.sound.add("in-game-music", { loop: true, volume: 0.5 }).play();
        this.bg = this.add.image(center.x, center.y, "battle_background");

        this.setupAvatars(currentLevel);
        this.setupGreenEnergyBars();

        this.fadeInAndThen(() => this.scaleBackgroundAndShowAvatars(), PAUSE_AFTER_FADE_IN_DURATION);
    }

    private scaleBackgroundAndShowAvatars() {
        this.tweens.add({targets: this.bg, duration: timing.fastTransition, alpha: 0.2, scale: 0.9, ease: "Sin.out" })
            .play()
            .once("complete", () => {

                this.rival?.setVisible(true);
                this.tweens.add({
                    targets: this.rival,
                    alpha: { getStart: () => 0, getEnd: () => 1 },
                    y: { getStart: () => avatarY + 300, getEnd: () => avatarY },
                    ease: "Sine.out",
                    duration: timing.veryFastTransition,
                })
                    .play();

                this.player?.setVisible(true);
                this.tweens.add({
                    targets: this.player,
                    alpha: { getStart: () => 0, getEnd: () => 1},
                    y: { getStart: () => avatarY + 300, getEnd: () => avatarY },
                    ease: "Sine.out",
                    duration: timing.veryFastTransition,
                })
                    .play()
                    .once("complete", () => this.showEnergyBars());
            });
    }

    private setupGreenEnergyBars() {
        this.playerEnergy = this.add.rectangle(
            this.player!.displayWidth * 1.5,
            avatarY - 100,
            0, 60, paletteHex.green, 1)
            .setOrigin(0, 0)
            .setDepth(100);

        this.rivalEnergy = this.add.rectangle(
            this.cameras.main.worldView.x + this.cameras.main.width - this.rival!.displayWidth * 1.5,
            avatarY + 40,
            0, 60, paletteHex.green, 1)
            .setOrigin(1, 0)
            .setDepth(100);
    }

    private setupAvatars(currentLevel: Level) {
        this.rival = this.add.image(rivalAvatarX, avatarY, `rival-${currentLevel.index}`)
            .setScale(0.3)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.rival.setX(this.cameras.main.worldView.x + this.cameras.main.width - this.rival.displayWidth);

        this.player = this.add.image(playerAvatarX, avatarY, `player-${gameStatus.selectedPlayer.id}`)
            .setScale(0.3)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.player.setX(this.player.displayWidth);

        this.rivalEmitter = this.add.particles(
            rivalAvatarX, avatarY, "sparkle", {
                lifespan: 1000,
                speed: {min: 250, max: 350},
                scale: {start: 0.5, end: 0},
                gravityY: 350,
                blendMode: "ADD",
                emitting: false
            });

        this.playerEmitter = this.add.particles(
            playerAvatarX, avatarY, "sparkle", {
                lifespan: 1000,
                speed: {min: 250, max: 350},
                scale: {start: 0.5, end: 0},
                gravityY: 350,
                blendMode: "ADD",
                emitting: false
            });
    }

    private async showEnergyBars() {
        this.setupRivalResponseProgressBar();
        this.updateEnergyBarsValue(true);

        await this.delay(ENERGY_BAR_LOADING_DURATION);
        this.setupRedBarsUnderEnergyBars();
        await this.startCountDown();
    }

    private setupRedBarsUnderEnergyBars() {
        this.add.rectangle(
            this.player!.displayWidth * 1.5,
            avatarY - 100,
            800, 60, paletteHex.red, 1)
            .setOrigin(0, 0);

        this.add.rectangle(
            rivalAvatarX - this.rival!.displayWidth * 0.5 - 60,
            avatarY + 40,
            800, 60, paletteHex.red, 1)
            .setOrigin(1, 0);
    }

    private async startCountDown() {

        const center = this.screenCenter();
        const countDownText = this.add.text(center.x, 400, "", fonts.veryBig(paletteString.red))
            .setStroke(paletteString.darkRed, 16)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5);

        const goText = this.add.text(center.x, 400, "GO!", fonts.veryBig(paletteString.green))
            .setStroke(paletteString.darkGreen, 16)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5)
            .setAlpha(0);

        const sfx = this.sound.add("counter-sfx", { loop: false, volume: 1 });
        const showCounter = (n: number) => {
            countDownText.setText(`${n}`);
            this.add.tween({
                targets: countDownText,
                y: { getStart: () => 450, getEnd: () => 400},
                alpha: {getStart: () => 1, getEnd: () => 0},
                ease: "Sine.in",
                duration: COUNTER_INTERVAL - 300,
            });
        };

        for (const i of [3, 2, 1]) {
            showCounter(i);
            sfx.play();
            await this.delay(COUNTER_INTERVAL);
        }

        countDownText.setVisible(false);
        this.add.tween({
            targets: goText,
            y: { getStart: () => 450, getEnd: () => 400 },
            alpha: {getStart: () => 1, getEnd: () => 0 },
            ease: "Sine.in",
            duration: COUNTER_INTERVAL + 200,
        });

        this.createQuestionAndAnswersLabels();
        await this.nextQuestion();
    }

    private setupRivalResponseProgressBar() {
        this.rivalProgress = this.add.rectangle(
            this.rival!.x - this.rival!.displayWidth / 2,
            this.rival!.y - this.rival!.displayHeight / 2,
            0, 10, paletteHex.yellow, 1).setOrigin(0, 1);

        this.rivalProgressTween = this.tweens.add({
            targets: this.rivalProgress,
            duration: gameStatus.currentMatch.currentLevel.rival.responseDelay * 1000 + SLIDE_QUESTION_DURATION,
            paused: true,
            persist: true,
            width: {getStart: () => 0, getEnd: () => this.rival?.displayWidth},
        });

        this.rivalProgressTween.on("complete", () => this.handleResponse("RIVAL", evaluateRivalSelection()));
    }

    private createQuestionAndAnswersLabels() {

        const center = this.screenCenter();

        this.questionText = this.add.text(center.x, 200, "", fonts.big(paletteString.lightCyan))
            .setStroke(paletteString.blue, 16)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5);

        this.response1 = this.add.text(center.x - 500, 420, "", fonts.big(paletteString.lightPink))
            .setStroke(paletteString.purple, 8)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5)
            .setInteractive();
        this.response1.on("pointerdown", () => this.handleResponse("PLAYER", this.response1!.text));

        this.response2 = this.add.text(center.x, 420, "", fonts.big(paletteString.lightPink))
            .setStroke(paletteString.purple, 8)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5)
            .setInteractive();
        this.response2.on("pointerdown", () => this.handleResponse("PLAYER", this.response2!.text));

        this.response3 = this.add.text(center.x + 500, 420, "", fonts.big(paletteString.lightPink))
            .setStroke(paletteString.purple, 8)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5)
            .setInteractive();
        this.response3.on("pointerdown", () => this.handleResponse("PLAYER", this.response3!.text));

        this.questionContainer = this.add.container(0, 0, [ this.questionText, this.response1, this.response2, this.response3 ]);
    }

    private async nextQuestion() {
        this.moveQuestionOut();

        await this.delay(SLIDE_QUESTION_DURATION);

        this.currentQuestion = nextQuestion();
        this.questionText!.setText(this.currentQuestion.question);
        this.response1!.setText(this.currentQuestion.response1);
        this.response2!.setText(this.currentQuestion.response2);
        this.response3!.setText(this.currentQuestion.response3);
        this.moveQuestionIn();
        this.rivalProgressTween?.seek(0).play();
        this.doubleTapLock = false;
    }

    private moveQuestionIn() {
        this.add.tween({
            targets: this.questionContainer,
            x: {getStart: () => 2000, getEnd: () => 0},
            alpha: {getStart: () => 0, getEnd: () => 1},
            ease: "Sine.out",
            duration: SLIDE_QUESTION_DURATION,
        });
    }

    private moveQuestionOut() {
        this.add.tween({
            targets: this.questionContainer,
            x: { getStart: () => 0, getEnd: () => -2000 },
            alpha: { getStart: () => 1, getEnd: () => 0 },
            ease: "Sine.in",
            duration: SLIDE_QUESTION_DURATION,
        });
    }

    private async handleResponse(actor: Actor, selection: string) {

        if (this.doubleTapLock) return;
        this.doubleTapLock = true;

        this.rivalProgressTween?.pause();
        this.tweens.add({ targets: this.rivalProgress, duration: 100, width: 0 });

        const outcome = questionOutcome(actor, selection);

        if (outcome.damageEffect === "PLAYER")
            this.playerEmitter!.explode(30);
        else
            this.rivalEmitter!.explode(30);

        this.updateEnergyBarsValue(false);

        if (outcome.winner === undefined)
            await this.nextQuestion();
        else {
            this.moveQuestionOut();
            await this.delay(PAUSE_BEFORE_OUTCOME_SCENE_DURATION);
            this.fadeOutAndThen(() => {
                this.bg?.destroy();
                this.navigateTo("MatchOutcome");
            }, timing.veryFastTransition);
        }
    };

    private updateEnergyBarsValue(firstTime: boolean) {

        const alpha = firstTime ? {
            alpha: { getStart: () => 0, getEnd: () => 1 }
        } : {};

        this.tweens.add({
            ...alpha,
            targets: this.playerEnergy,
            width: {
                getStart: () => this.playerEnergy?.width ?? 0,
                getEnd: () => gameStatus.currentMatch.energy.player * 8,
            },
            ease: "Sine.out",
            duration: ENERGY_BAR_LOADING_DURATION,
        }).play();

        this.tweens.add({
            ...alpha,
            targets: this.rivalEnergy,
            width: {
                getStart: () => this.rivalEnergy?.width ?? 0,
                getEnd: () => -gameStatus.currentMatch.energy.rival * 8,
            },
            ease: "Sine.out",
            duration: ENERGY_BAR_LOADING_DURATION,
        }).play();

    }

}
