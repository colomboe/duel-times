import {gameStatus, players} from "../model/data.ts";
import {dictionary} from "../model/i18n.ts";

export class Start extends Phaser.Scene {

    preload() {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        const progressBarBackground = this.add.rectangle(screenCenterX - 400, screenCenterY, 800, 60, 0x777777, 1).setOrigin(0, 0);
        const progressBarValue = this.add.rectangle(screenCenterX - 400, screenCenterY, 0, 60, 0x0EC756, 1).setOrigin(0, 0);

        this.load.on("progress", (value: number) => {
            progressBarValue.setSize(value * 800, 60);
        });

        this.load.on("complete", () => {
            progressBarBackground.destroy();
            progressBarValue.destroy();
        });

        this.load.image("title", "game-assets/title.jpg");

        this.load.audio("intro-music", "game-assets/intro.mp3");
        this.load.audio("in-game-music", "game-assets/in-game.mp3");
        this.load.audio("menu-sfx", "game-assets/sfx/menu.mp3");
        this.load.audio("counter-sfx", "game-assets/sfx/counter.mp3");

        this.load.image("rival-frame", "game-assets/rivals/current.jpeg");
        this.load.image("rival-placeholder", "game-assets/rivals/placeholder.jpeg");
        this.load.image("sparkle", "game-assets/sparkle-red.png");

        players.forEach(player => {
            this.load.image(`player-${player.id}`, `game-assets/players/${player.id}-normal.jpeg`);
            this.load.image(`player-defeated-${player.id}`, `game-assets/players/${player.id}-crying.jpeg`);
            this.load.image(`player-winner-${player.id}`, `game-assets/players/${player.id}-happy.jpeg`);
        });
        gameStatus.levels.forEach(level => {
            this.load.image(`rival-${level.index}`, `game-assets/rivals/${level.rival.avatar}.jpeg`);
            this.load.image(`rival-defeated-${level.index}`, `game-assets/rivals/${level.rival.avatar}-defeated.jpeg`);
        });

    }

    create() {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.add.image(screenCenterX, screenCenterY, "title")
            .setScale(0.85)
            .setInteractive()
            .once("pointerdown", () => {
                this.sound.add("menu-sfx", { loop: false, volume: 1 }).play();
                this.cameras.main.fadeOut(1000, 0, 0, 0);
            });

        this.add.text(
            screenCenterX,
            this.cameras.main.height - 180,
            dictionary.pressToStart,
            {fontFamily: "Arial Black", fontSize: 74, color: "#ccffff"}
        )
            .setStroke("#336699", 16)
            .setShadow(2, 2, "#333333", 2, true, false)
            .setOrigin(0.5);

        this.add.text(
            screenCenterX,
            this.cameras.main.height - 50,
            dictionary.moreInfoLink,
            {fontFamily: "Arial", fontSize: 28, color: "#aaaaaa", fontStyle: "italic"}
        )
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => window.open("https://github.com/colomboe/duel-times/blob/main/README.md", "_blank"));

        this.sound.add("intro-music", { loop: true, volume: 0.5 }).play();

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start("PlayerSelection");
        });
    }

}