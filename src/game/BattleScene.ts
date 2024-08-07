import Image = Phaser.GameObjects.Image;
import {gameStatus} from "../model/state.ts";
import Rectangle = Phaser.GameObjects.Rectangle;

const FADE_IN_DURATION = 1000;
const PAUSE_AFTER_FADE_IN_DURATION = 500;
const SEND_BACK_BG_DURATION = 1000;
const ENTER_AVATARS_DURATION = 500;
const ENERGY_BAR_LOADING_DURATION = 1500;
// const FADE_IN_DURATION = 10;
// const PAUSE_AFTER_FADE_IN_DURATION = 5;
// const SEND_BACK_BG_DURATION = 10;
// const ENTER_AVATARS_DURATION = 5;
// const ENERGY_BAR_LOADING_DURATION = 2;

export class BattleScene extends Phaser.Scene {

    private bg?: Image;
    private rival?: Image;
    private player?: Image;
    private playerEnergy?: Rectangle;
    private rivalEnergy?: Rectangle;

    preload() {
        this.load.image('rival_0', 'game-assets/rivals/0.png');
        this.load.image('player', `game-assets/players/${gameStatus.selectedPlayer.id}/normal.png`);
        this.load.image('bg0', 'game-assets/backgrounds/bg0.png');
    }

    create() {

        this.sound.stopAll();

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.bg = this.add.image(screenCenterX, screenCenterY, 'bg0');

        this.rival = this.add.image(0, 0, 'rival_0')
            .setScale(0.3)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.rival.setX(this.cameras.main.worldView.x + this.cameras.main.width - this.rival.displayWidth);

        this.player = this.add.image(0, 0, 'player')
            .setScale(0.3)
            .setOrigin(0.5, 0.5)
            .setVisible(false);
        this.player.setX(this.player.displayWidth);

        this.playerEnergy = this.add.rectangle(
            this.player!.displayWidth * 1.5,
            this.cameras.main.worldView.y + this.cameras.main.height - 400,
            0, 60, 0x00ff66, 1)
            .setOrigin(0, 0)
            .setDepth(100);

        this.rivalEnergy = this.add.rectangle(
            this.cameras.main.worldView.x + this.cameras.main.width - this.rival.displayWidth * 1.5,
            this.cameras.main.worldView.y + this.cameras.main.height - 260,
            0, 60, 0x00ff66, 1)
            .setOrigin(1, 0)
            .setDepth(100);

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
                        getStart: () => this.cameras.main.worldView.y + this.cameras.main.height,
                        getEnd: () => this.cameras.main.worldView.y + this.cameras.main.height - 300,
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
                        getStart: () => this.cameras.main.worldView.y + this.cameras.main.height,
                        getEnd: () => this.cameras.main.worldView.y + this.cameras.main.height - 300,
                    },
                    ease: 'Sine.out',
                    duration: ENTER_AVATARS_DURATION,
                }).play();
            });

        setTimeout(() => this.showEnergyBars(), ENTER_AVATARS_DURATION + SEND_BACK_BG_DURATION);
    }

    showEnergyBars() {

        this.tweens.add({
            targets: this.playerEnergy,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            width: {
                getStart: () => 0,
                getEnd: () => gameStatus.energy.player * 8,
            },
            ease: 'Sine.out',
            duration: ENERGY_BAR_LOADING_DURATION,
        }).play();

        this.tweens.add({
            targets: this.rivalEnergy,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            width: {
                getStart: () => 0,
                getEnd: () => -gameStatus.energy.rival * 8,
            },
            ease: 'Sine.out',
            duration: ENERGY_BAR_LOADING_DURATION,
        }).play();

        setTimeout(() => {

            this.add.rectangle(
                this.player!.displayWidth * 1.5,
                this.cameras.main.worldView.y + this.cameras.main.height - 400,
                800, 60, 0xff0000, 1)
                .setOrigin(0, 0);

            this.add.rectangle(
                this.cameras.main.worldView.x + this.cameras.main.width - this.rival!.displayWidth * 1.5,
                this.cameras.main.worldView.y + this.cameras.main.height - 260,
                800, 60, 0xff0000, 1)
                .setOrigin(1, 0);

            this.startCountDown();

        }, ENERGY_BAR_LOADING_DURATION);

    }

    startCountDown() {





        console.log('START!');
    }

}