import Image = Phaser.GameObjects.Image;
import {gameStatus} from "../model/state.ts";

export class BattleScene extends Phaser.Scene {

    private bg?: Image;
    private rival?: Image;
    private player?: Image;

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

        setTimeout(() => this.afterFadeIn(), 1500);
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    afterFadeIn() {
        this.tweens.add({
            targets: this.bg,
            duration: 1000,
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
                    duration: 500,
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
                    duration: 500,
                }).play();
            });

        setTimeout(() => this.startCountDown(), 2000);
    }

    startCountDown() {
        console.log('START!');
    }

}