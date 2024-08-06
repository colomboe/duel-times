export class StartScene extends Phaser.Scene {

    preload() {
        this.load.image('title', 'game-assets/title.png');
        this.load.audio('intro-music', 'game-assets/intro.mp3');
        this.load.audio('menu-sfx', 'game-assets/sfx/menu.mp3');
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.add.image(screenCenterX, screenCenterY, 'title');

        const pressToStartText = this.add.text(
            screenCenterX,
            this.cameras.main.height - 150,
            'Press to start',
            {fontFamily: 'Arial Black', fontSize: 74, color: '#ccffff'}
        );
        pressToStartText.setStroke('#336699', 16);
        pressToStartText.setShadow(2, 2, '#333333', 2, true, false);
        pressToStartText.setOrigin(0.5);

        this.sound.add('intro-music', { loop: true, volume: 0.5 }).play();

        this.input.on("pointerdown", () => {
            this.sound.add('menu-sfx', { loop: false, volume: 1 }).play();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('PlayerSelection');
        });
    }

}