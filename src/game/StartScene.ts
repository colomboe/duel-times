import {gameStatus} from "../model/state.ts";
import {players} from "../model/players.ts";

export class StartScene extends Phaser.Scene {

    preload() {

        const progress = this.add.graphics();
        this.load.on('progress', (value: number) => {
            progress.clear();
            progress.fillStyle(0xffffff, 1);
            progress.fillRect(0, 270, 800 * value, 60);
        });

        this.load.on('complete', () => {
            progress.destroy();
        });

        this.load.image('title', 'game-assets/title.png');

        this.load.audio('intro-music', 'game-assets/intro.mp3');
        this.load.audio('in-game-music', 'game-assets/in-game.mp3');
        this.load.audio('menu-sfx', 'game-assets/sfx/menu.mp3');
        this.load.audio('counter-sfx', 'game-assets/sfx/counter.mp3');

        this.load.image('rival-frame', 'game-assets/rivals/current.png');
        this.load.image('rival-placeholder', 'game-assets/rivals/placeholder.png');
        this.load.image('sparkle', 'game-assets/sparkle-red.png');

        players.forEach(player => {
            this.load.image(`player-${player.id}`, `game-assets/players/${player.id}/normal.png`);
            this.load.image(`player-defeated-${player.id}`, `game-assets/players/${player.id}/crying.png`);
            this.load.image(`player-winner-${player.id}`, `game-assets/players/${player.id}/happy.png`);
        });
        gameStatus.levels.forEach(level => {
            this.load.image(`background-${level.id}`, `game-assets/backgrounds/${level.background}.png`);
            this.load.image(`rival-${level.id}`, `game-assets/rivals/${level.rivalAvatar}.png`);
            this.load.image(`rival-defeated-${level.id}`, `game-assets/rivals/${level.rivalAvatar}-defeated.png`);
        });

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

        this.input.once("pointerdown", () => {
            this.sound.add('menu-sfx', { loop: false, volume: 1 }).play();
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('PlayerSelection');
        });
    }

}