import {gameStatus, players} from "../model/data.ts";
import {dictionary} from "../model/i18n.ts";
import {fonts, paletteHex, paletteString} from "../Config.ts";
import {BaseScene, XYPoint} from "./BaseScene.ts";

export class Start extends BaseScene {

    preload() {

        this.setupPreloadProgressBar();

        this.load.image("title", "game-assets/title.jpg");

        this.load.audio("intro-music", "game-assets/intro.mp3");
        this.load.audio("in-game-music", "game-assets/in-game.mp3");
        this.load.audio("menu-sfx", "game-assets/sfx/menu.mp3");
        this.load.audio("counter-sfx", "game-assets/sfx/counter.mp3");

        this.load.image("rival-frame", "game-assets/rivals/current.jpeg");
        this.load.image("rival-placeholder", "game-assets/rivals/placeholder.jpeg");
        this.load.image("sparkle", "game-assets/sparkle-red.png");

        this.load.image("story1", "game-assets/backgrounds/story1.jpeg");
        this.load.image("story2", "game-assets/backgrounds/story2.jpeg");

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

        const center        = this.screenCenter();
        const background    = this.addBackgroundPicture(center);
                              this.addPressToStartMessage(center.x);
        const aboutLinkText = this.addAboutLinkText(center.x);
                              this.startIntroMusic();

        aboutLinkText.on("pointerdown", () => window.open("https://github.com/colomboe/duel-times/blob/main/README.md", "_blank"));

        background.once("pointerdown", () => {
            this.playClickSoundFx();
            this.fadeOutAndNavigateTo("PlayerSelection");
        });
    }

    private playClickSoundFx() {
        this.sound.add("menu-sfx", {loop: false, volume: 1}).play();
    }

    private startIntroMusic() {
        this.sound.removeByKey("intro-music");
        this.sound.add("intro-music", {loop: true, volume: 0.5}).play();
    }

    private addAboutLinkText(centerX: number) {
        return this.add.text(
            centerX,
            this.cameras.main.height - 50,
            dictionary.moreInfoLink,
            {fontFamily: "Arial", fontSize: 28, color: paletteString.lightGray, fontStyle: "italic"}
        )
            .setOrigin(0.5)
            .setInteractive();
    }

    private addPressToStartMessage(centerX: number) {
        this.add.text(centerX, this.cameras.main.height - 180, dictionary.pressToStart, fonts.bigLight)
            .setStroke(paletteString.blue, 16)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5);
    }

    private addBackgroundPicture(center: XYPoint) {
        return this.add.image(center.x, center.y, "title")
            .setScale(0.85)
            .setInteractive();
    }

    private setupPreloadProgressBar() {
        const center = this.screenCenter();
        const progressBarBackground = this.add.rectangle(center.x - 400, center.y, 800, 60, paletteHex.gray, 1).setOrigin(0, 0);
        const progressBarValue = this.add.rectangle(center.x - 400, center.y, 0, 60, paletteHex.green, 1).setOrigin(0, 0);

        this.load.on("progress", (value: number) => progressBarValue.setSize(value * 800, 60));
        this.load.on("complete", () => {
            progressBarBackground.destroy();
            progressBarValue.destroy();
        });
    }
}