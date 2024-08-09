import Image = Phaser.GameObjects.Image;
import Rectangle = Phaser.GameObjects.Rectangle;
import Text = Phaser.GameObjects.Text;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import Container = Phaser.GameObjects.Container;
import {gameStatus} from "../model/state.ts";
import {nextQuestion, Question} from "../model/model.ts";

const FADE_IN_DURATION = 1000;
const PAUSE_AFTER_FADE_IN_DURATION = 500;
const SEND_BACK_BG_DURATION = 1000;
const ENTER_AVATARS_DURATION = 500;
const ENERGY_BAR_LOADING_DURATION = 1500;
const COUNTER_INTERVAL = 1000;
// const FADE_IN_DURATION = 10;
// const PAUSE_AFTER_FADE_IN_DURATION = 5;
// const SEND_BACK_BG_DURATION = 10;
// const ENTER_AVATARS_DURATION = 5;
// const ENERGY_BAR_LOADING_DURATION = 2;
// const COUNTER_INTERVAL = 1;

const avatarY = 780;
const playerAvatarX = 307;
const rivalAvatarX = 1673;

export class BattleScene extends Phaser.Scene {

    private bg?: Image;
    private rival?: Image;
    private player?: Image;
    private playerEnergy?: Rectangle;
    private rivalEnergy?: Rectangle;
    private questionText?: Text;
    private response1?: Text;
    private response2?: Text;
    private response3?: Text;
    private questionContainer?: Container;
    private playerEmitter?: ParticleEmitter;
    private rivalEmitter?: ParticleEmitter;
    private currentQuestion?: Question;

    preload() {
        this.load.audio('counter-sfx', 'game-assets/sfx/counter.mp3');
        this.load.image('rival', 'game-assets/rivals/0.png');
        this.load.image('player', `game-assets/players/${gameStatus.selectedPlayer.id}/normal.png`);
        this.load.image('bg0', 'game-assets/backgrounds/bg0.png');
        this.load.image('sparkle', 'game-assets/sparkle-red.png');
    }

    create() {

        // this.sound.stopAll();

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.bg = this.add.image(screenCenterX, screenCenterY, 'bg0');

        this.rival = this.add.image(rivalAvatarX, avatarY, 'rival')
            .setScale(0.3)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.rival.setX(this.cameras.main.worldView.x + this.cameras.main.width - this.rival.displayWidth);

        this.player = this.add.image(playerAvatarX, avatarY, 'player')
            .setScale(0.3)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.player.setX(this.player.displayWidth);

        this.playerEnergy = this.add.rectangle(
            this.player!.displayWidth * 1.5,
            avatarY - 100,
            0, 60, 0x0EC756, 1)
            .setOrigin(0, 0)
            .setDepth(100);

        this.rivalEnergy = this.add.rectangle(
            this.cameras.main.worldView.x + this.cameras.main.width - this.rival.displayWidth * 1.5,
            avatarY + 40,
            0, 60, 0x0EC756, 1)
            .setOrigin(1, 0)
            .setDepth(100);

        this.rivalEmitter = this.add.particles(
            rivalAvatarX, avatarY, 'sparkle', {
                lifespan: 1000,
                speed: { min: 250, max: 350 },
                scale: { start: 0.5, end: 0 },
                gravityY: 350,
                blendMode: 'ADD',
                emitting: false
            });

        this.playerEmitter = this.add.particles(
            playerAvatarX, avatarY, 'sparkle', {
                lifespan: 1000,
                speed: { min: 250, max: 350 },
                scale: { start: 0.5, end: 0 },
                gravityY: 350,
                blendMode: 'ADD',
                emitting: false
            });

        setTimeout(() => this.afterFadeIn(), FADE_IN_DURATION + PAUSE_AFTER_FADE_IN_DURATION);
        this.cameras.main.fadeIn(FADE_IN_DURATION, 0, 0, 0);
    }

    afterFadeIn() {
        this.tweens.add({
            targets: this.bg,
            duration: SEND_BACK_BG_DURATION,
            alpha: 0.2,
            scale: 0.9,
            ease: 'Sin.out',
        })
            .play()
            .once('complete', () => {

                this.rival?.setVisible(true);
                this.tweens.add({
                    targets: this.rival,
                    alpha: {
                        getStart: () => 0,
                        getEnd: () => 1,
                    },
                    y: {
                        getStart: () => avatarY + 300,
                        getEnd: () => avatarY,
                    },
                    ease: 'Sine.out',
                    duration: ENTER_AVATARS_DURATION,
                }).play();

                this.player?.setVisible(true);
                this.tweens.add({
                    targets: this.player,
                    alpha: {
                        getStart: () => 0,
                        getEnd: () => 1,
                    },
                    y: {
                        getStart: () => avatarY + 300,
                        getEnd: () => avatarY,
                    },
                    ease: 'Sine.out',
                    duration: ENTER_AVATARS_DURATION,
                }).play();
            });

        setTimeout(() => this.showEnergyBars(), ENTER_AVATARS_DURATION + SEND_BACK_BG_DURATION);
    }

    showEnergyBars() {

        this.refreshEnergy(true);

        setTimeout(() => {

            this.add.rectangle(
                this.player!.displayWidth * 1.5,
                avatarY - 100,
                800, 60, 0xff0000, 1)
                .setOrigin(0, 0);

            this.add.rectangle(
                rivalAvatarX - this.rival!.displayWidth * 0.5,
                avatarY + 40,
                800, 60, 0xff0000, 1)
                .setOrigin(1, 0);

            this.startCountDown();

        }, ENERGY_BAR_LOADING_DURATION);

    }

    startCountDown() {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const countDownText = this.add.text(screenCenterX, 400, '', {fontFamily: 'Arial Black', fontSize: 224, color: '#ff3a3a'})
            .setStroke('#600000', 16)
            .setShadow(2, 2, '#333333', 2, true, false)
            .setOrigin(0.5);

        const goText = this.add.text(screenCenterX, 400, 'GO!', {fontFamily: 'Arial Black', fontSize: 224, color: '#289f00'})
            .setStroke('#123e00', 16)
            .setShadow(2, 2, '#333333', 2, true, false)
            .setOrigin(0.5)
            .setAlpha(0);

        const sfx = this.sound.add('counter-sfx', { loop: false, volume: 1 });
        const showCounter = (n: number) => {
            countDownText.setText(`${n}`);
            this.add.tween({
                targets: countDownText,
                y: {
                    getStart: () => 450,
                    getEnd: () => 400,
                },
                alpha: {
                    getStart: () => 1,
                    getEnd: () => 0,
                },
                ease: 'Sine.in',
                duration: COUNTER_INTERVAL - 300,
            });
        };

        setTimeout(() => {
            showCounter(3);
            sfx.play();
            setTimeout(() => {
                showCounter(2);
                sfx.play();
                setTimeout(() => {
                    showCounter(1);
                    sfx.play();
                    setTimeout(() => {
                        countDownText.setVisible(false);
                        this.add.tween({
                            targets: goText,
                            y: {
                                getStart: () => 450,
                                getEnd: () => 400,
                            },
                            alpha: {
                                getStart: () => 1,
                                getEnd: () => 0,
                            },
                            ease: 'Sine.in',
                            duration: COUNTER_INTERVAL + 200,
                        });
                        this.startGame();
                    }, COUNTER_INTERVAL);
                }, COUNTER_INTERVAL);
            }, COUNTER_INTERVAL);
        }, COUNTER_INTERVAL);

    }

    startGame() {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        this.questionText = this.add.text(screenCenterX, 200, '', {fontFamily: 'Arial Black', fontSize: 74, color: '#ccffff'})
            .setStroke('#336699', 16)
            .setShadow(2, 2, '#333333', 2, true, false)
            .setOrigin(0.5);

        this.response1 = this.add.text(screenCenterX - 500, 420, '', {fontFamily: 'Arial Black', fontSize: 74, color: '#f3dcff'})
            .setStroke('#765387', 8)
            .setShadow(2, 2, '#333333', 2, true, false)
            .setOrigin(0.5)
            .setInteractive();
        this.response1.on('pointerdown', () => { this.playerSelected(this.response1!.text); });

        this.response2 = this.add.text(screenCenterX, 420, '', {fontFamily: 'Arial Black', fontSize: 74, color: '#f3dcff'})
            .setStroke('#765387', 8)
            .setShadow(2, 2, '#333333', 2, true, false)
            .setOrigin(0.5)
            .setInteractive();
        this.response2.on('pointerdown', () => { this.playerSelected(this.response2!.text); });

        this.response3 = this.add.text(screenCenterX + 500, 420, '', {fontFamily: 'Arial Black', fontSize: 74, color: '#f3dcff'})
            .setStroke('#765387', 8)
            .setShadow(2, 2, '#333333', 2, true, false)
            .setOrigin(0.5)
            .setInteractive();
        this.response3.on('pointerdown', () => { this.playerSelected(this.response3!.text); });

        this.questionContainer = this.add.container(0, 0, [ this.questionText, this.response1, this.response2, this.response3 ]);

        this.nextQuestion();
    }

    nextQuestion() {
        this.add.tween({
            targets: this.questionContainer,
            x: { getStart: () => 0, getEnd: () => -2000 },
            alpha: { getStart: () => 1, getEnd: () => 0 },
            ease: 'Sine.in',
            duration: 500,
        });

        setTimeout(() => {
            this.currentQuestion = nextQuestion();
            this.questionText!.setText(this.currentQuestion.question);
            this.response1!.setText(this.currentQuestion.response1);
            this.response2!.setText(this.currentQuestion.response2);
            this.response3!.setText(this.currentQuestion.response3);
            this.add.tween({
                targets: this.questionContainer,
                x: { getStart: () => 2000, getEnd: () => 0 },
                alpha: { getStart: () => 0, getEnd: () => 1 },
                ease: 'Sine.out',
                duration: 500,
            });
        }, 500);
    }

    playerSelected(selection: string) {
        if (selection === this.currentQuestion!.correctResponse) {
            this.rivalEmitter!.explode(30);
            gameStatus.energy.rival -= 10;
        }
        else {
            this.playerEmitter!.explode(30);
            gameStatus.energy.player -= 10;
        }
        this.refreshEnergy(false);
        this.nextQuestion();
    };


    refreshEnergy(withAlpha: boolean) {

        const alpha = withAlpha ? {
            alpha: { getStart: () => 0, getEnd: () => 1 }
        } : {};

        this.tweens.add({
            ...alpha,
            targets: this.playerEnergy,
            width: {
                getStart: () => this.playerEnergy?.width ?? 0,
                getEnd: () => gameStatus.energy.player * 8,
            },
            ease: 'Sine.out',
            duration: ENERGY_BAR_LOADING_DURATION,
        }).play();

        this.tweens.add({
            ...alpha,
            targets: this.rivalEnergy,
            width: {
                getStart: () => this.rivalEnergy?.width ?? 0,
                getEnd: () => -gameStatus.energy.rival * 8,
            },
            ease: 'Sine.out',
            duration: ENERGY_BAR_LOADING_DURATION,
        }).play();

    }

}