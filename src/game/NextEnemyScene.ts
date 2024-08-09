import {gameStatus} from "../model/state.ts";

export class NextEnemyScene extends Phaser.Scene {

    preload() {
        this.load.audio('menu-sfx', 'game-assets/sfx/menu.mp3');
        this.load.image('frame', 'game-assets/rivals/current.png');
        this.load.image('placeholder', 'game-assets/rivals/placeholder.png');
        this.load.image('rival_0', 'game-assets/rivals/0.png');
    }

    create() {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const offsetX = this.cameras.main.worldView.x + this.cameras.main.width / 4;

        this.add
            .image(offsetX, 500, 'frame')
            .setScale(0.55);

        gameStatus.rivals.forEach((r, index) => {
            if (r.status === "HIDDEN") {
                this.add
                    .image(offsetX * (index + 1), 500, 'placeholder')
                    .setAlpha(0.3, 0.3, 0.3, 0.3)
                    .setScale(0.35);
            }
            else {
                this.add
                    .image(offsetX * (index + 1), 500, `rival_${index}`)
                    .setScale(0.35);
            }

        });

        const pressToStartText = this.add.text(
            screenCenterX,
            50,
            'Your next rival',
            {fontFamily: 'Arial Black', fontSize: 74, color: '#ffcc00'}
        );
        pressToStartText.setStroke('#665200', 16);
        pressToStartText.setShadow(2, 2, '#333333', 2, true, false);
        pressToStartText.setOrigin(0.5);

        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.input.on("pointerdown", () => {
            this.sound.add('menu-sfx', { loop: false, volume: 1 }).play();
            this.tweens.add({
                targets:  this.sound.get('intro-music'),
                volume: {
                    getStart: () => 0.5,
                    getEnd: () => 0,
                },
                duration: 2000
            });
            this.cameras.main.fadeOut(2000, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('Battle');
        });
    }

}