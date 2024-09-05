import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import Rectangle = Phaser.GameObjects.Rectangle;
import {gameStatus} from "../model/data.ts";
import {dictionary} from "../model/i18n.ts";
import {BaseScene, SkippableDelayPromise} from "./BaseScene.ts";
import {Player} from "../model/definitions.ts";
import {fonts, paletteHex, paletteString, timing} from "../Config.ts";
import {TypeWriter} from "./TypeWriter.ts";

export class Story extends BaseScene {

    private player?: Player;
    private story1?: Image;
    private story2?: Image;
    private avatar1?: Image;
    private avatar2?: Image;
    private textArea?: Rectangle;
    private textParagraph?: Text;
    private typeWriter?: TypeWriter;
    private delayPromise?: SkippableDelayPromise<void>;

    preload() {
        this.player = gameStatus.selectedPlayer;
        this.load.image(`player-${this.player.id}-sad`, `game-assets/players/${this.player.id}-sad.jpeg`);
    }

    create() {
        const center = this.screenCenter();

        this.story1 = this.add.image(center.x, center.y, "story1").setInteractive();
        this.story2 = this.add.image(center.x, center.y, "story2").setInteractive().setAlpha(0);
        this.textArea = this.add.rectangle(0, 800, 0, 400, paletteHex.black, 0.6).setOrigin(0, 0);
        this.avatar1 = this.add.image(1700, 600, `player-${this.player!.id}`).setScale(0.35).setAlpha(0);
        this.avatar2 = this.add.image(1700, 900, `player-${this.player!.id}-sad`).setScale(0.35).setAlpha(0);
        this.textParagraph = this.add
            .text(100, 830, "", fonts.small(paletteString.lightCyan))
            .setStroke(paletteString.blue, 8);
        this.typeWriter = new TypeWriter(this, this.textParagraph);

        this.story1.on("pointerdown", () => this.skipTypewriter());
        this.story2.on("pointerdown", () => this.skipTypewriter());

        this.fadeInAndThen(() => this.stepBackground1());
    }

    private stepBackground1() {

        this.tweens.add({
            targets: this.avatar1,
            alpha: { getStart: () => 0, getEnd: () => 1 },
            y: { getStart: () => 1000, getEnd: () => 900 },
            ease: "Sine.out",
            duration: timing.fastTransition,
        });

        const textAreaTween = this.tweens.add({
            targets: this.textArea,
            width: { getStart: () => 0, getEnd: () => 1800, },
            ease: "Sine.out",
            duration: timing.fastTransition,
        });

        textAreaTween.on("complete", () => this.stepText1());
    }

    private async stepText1() {
        await this.typeWriter?.start(dictionary.story1);
        this.delayPromise = this.delay(timing.textReadingPause);
        await this.delayPromise;
        this.delayPromise = undefined;
        this.stepBackground2();
    }

    private stepBackground2() {
        this.typeWriter?.reset();

        const sceneSwitchTween = this.tweens.add({
            targets: [ this.avatar2, this.story2 ],
            alpha: { getStart: () => 0, getEnd: () => 1 },
            ease: "Sine.out",
            duration: timing.midTransition,
        }).play();

        sceneSwitchTween.on("complete", () => this.setText2());
    }

    private async setText2() {
        await this.typeWriter?.start(dictionary.story2);
        this.delayPromise = this.delay(timing.textReadingPause);
        await this.delayPromise;
        this.delayPromise = undefined;
        this.goToNextScene();
    }

    private goToNextScene() {
        this.typeWriter?.destroy();
        this.fadeOutAndNavigateTo("NextEnemy");
    }

    private skipTypewriter() {
        if (this.typeWriter?.isStarted())
            this.typeWriter?.skip();
        else if (this.delayPromise)
            this.delayPromise.skip();
    }

}