import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import Rectangle = Phaser.GameObjects.Rectangle;
import TimerEvent = Phaser.Time.TimerEvent;
import {gameStatus} from "../model/data.ts";
import {dictionary} from "../model/i18n.ts";
import {BaseScene, XYPoint} from "./BaseScene.ts";
import {Player} from "../model/definitions.ts";
import {paletteString, timing} from "../Config.ts";

export class Story extends BaseScene {

    private player?: Player;
    private story2?: Image;
    private avatar1?: Image;
    private avatar2?: Image;
    private textArea?: Rectangle;
    private textParagraph?: Text;
    private typeWriterEvent?: TimerEvent;


    preload() {
        this.player = gameStatus.selectedPlayer;
        this.load.image(`player-${this.player.id}-sad`, `game-assets/players/${this.player.id}-sad.jpeg`);
    }

    create() {
        const center = this.screenCenter();

        const firstBackground = this.addFirstBackgroundPicture(center);
        const secondBackgroundPicture = this.addSecondBackgroundPicture(center);

        firstBackground.once("pointerdown", () => this.navigateToNextScene());
        secondBackgroundPicture.once("pointerdown", () => this.navigateToNextScene());

        this.fadeInAndThen(() => this.showFirstParagraph());
    }

    private showFirstParagraph() {

        this.textArea = this.add.rectangle(0, 800, 0, 400, 0x000000, 0.6).setOrigin(0, 0);
        this.avatar1 = this.add.image(1700, 600, `player-${this.player!.id}`).setScale(0.35);

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

        textAreaTween.on("complete", () => {
            this.textParagraph = this.add
                .text(100, 830, "", {fontFamily: "Arial", fontSize: 48, color: paletteString.lightCyan})
                .setStroke(paletteString.blue, 8);

            this.typewriteText(dictionary.story1, timing.textReadingPause, () => this.showSecondBackgroundAndParagraph());
        });
    }

    private showSecondBackgroundAndParagraph() {
        this.resetTypeWriter();

        this.avatar2 = this.add.image(1700, 900, `player-${this.player!.id}-sad`).setScale(0.35);

        const sceneSwitchTween = this.tweens.add({
            targets: [ this.avatar2, this.story2 ],
            alpha: { getStart: () => 0, getEnd: () => 1 },
            ease: "Sine.out",
            duration: timing.midTransition,
        }).play();

        sceneSwitchTween.on("complete", () => {
            this.typewriteText(dictionary.story2, timing.textReadingPause, () => this.navigateToNextScene());
        });
    }

    private navigateToNextScene() {
        this.resetTypeWriter();
        this.fadeOutAndNavigateTo("NextEnemy");
    }

    private addSecondBackgroundPicture(center: XYPoint) {
        return this.story2 = this.add.image(center.x, center.y, "story2").setAlpha(0)
            .setInteractive();
    }

    private addFirstBackgroundPicture(center: XYPoint) {
        return this.add.image(center.x, center.y, "story1")
            .setInteractive();
    }

    private resetTypeWriter() {
        this.typeWriterEvent?.remove();
        this.typeWriterEvent?.destroy();
        if (this.textParagraph) this.textParagraph.text = "";
    }

    private typewriteText(text: string, completedDelay: number, onComplete?: () => void) {
        let i = 0;
        this.typeWriterEvent = this.time.addEvent({
            callback: () => {
                if (this.textParagraph == null) return;
                this.textParagraph.text += text[i++];
                if (i >= text.length && onComplete)
                    setTimeout(() => onComplete(), completedDelay);
            },
            repeat: text.length - 1,
            delay: 40,
        });
    }

}