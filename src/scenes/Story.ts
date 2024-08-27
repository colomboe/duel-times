import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;
import Rectangle = Phaser.GameObjects.Rectangle;
import TimerEvent = Phaser.Time.TimerEvent;
import {gameStatus} from "../model/data.ts";
import {dictionary} from "../model/i18n.ts";

export class Story extends Phaser.Scene {

    private story2?: Image;
    private avatar1?: Image;
    private avatar2?: Image;
    private textArea?: Rectangle;
    private textParagraph?: Text;
    private typeWriterEvent?: TimerEvent;


    preload() {
        const player = gameStatus.selectedPlayer;
        this.load.image(`player-${player.id}-sad`, `game-assets/players/${player.id}-sad.jpeg`);
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.add.image(screenCenterX, screenCenterY, "story1")
            .setInteractive()
            .once("pointerdown", () => this.scene3());

        this.story2 = this.add.image(screenCenterX, screenCenterY, "story2").setAlpha(0)
            .setInteractive()
            .once("pointerdown", () => this.scene3());

        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => this.scene1());
    }

    scene1() {
        const player = gameStatus.selectedPlayer;

        this.textArea = this.add.rectangle(0, 900, 0, 300, 0x000000, 0.6)
            .setOrigin(0, 0);

        this.avatar1 = this.add.image(1700, 600, `player-${player.id}`)
            .setScale(0.35);

        this.textParagraph = this.add.text(100, 930, "", {fontFamily: "Arial", fontSize: 32, color: "#ccffff"})
            .setStroke("#336699", 8);

        this.tweens.add({
            targets: this.avatar1,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            y: {
                getStart: () => 1000,
                getEnd: () => 900,
            },
            ease: "Sine.out",
            duration: 1000,
        });

        this.tweens.add({
            targets: this.textArea,
            width: {
                getStart: () => 0,
                getEnd: () => 1800,
            },
            ease: "Sine.out",
            duration: 1000,
        });

        setTimeout(() => {
            this.typewriteText(dictionary.story1, () => setTimeout(() => this.scene2(), 2000));
        }, 1000);
    }

    scene2() {
        this.typeWriterEvent?.remove();
        this.typeWriterEvent?.destroy();
        this.textParagraph!.text = "";

        const player = gameStatus.selectedPlayer;
        this.avatar2 = this.add.image(1700, 900, `player-${player.id}-sad`)
            .setScale(0.35);

        this.tweens.add({
            targets: [ this.avatar2, this.story2 ],
            alpha: {
                getStart: () => 0,
                getEnd: () => 1,
            },
            ease: "Sine.out",
            duration: 2000,
        });

        setTimeout(() => {
            this.typewriteText(dictionary.story2, () => setTimeout(() => this.scene3(), 2000));
        }, 2000);

    }

    scene3() {
        this.typeWriterEvent?.remove();
        this.typeWriterEvent?.destroy();
        if (this.textParagraph) this.textParagraph.text = "";

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start("NextEnemy");
        });
        this.cameras.main.fadeOut(1000, 0, 0, 0);
    }

    typewriteText(text: string, onComplete?: () => void) {
        let i = 0;
        this.typeWriterEvent = this.time.addEvent({
            callback: () => {
                if (this.textParagraph == null) return;
                this.textParagraph.text += text[i++];
                if (i >= text.length && onComplete) onComplete();
            },
            repeat: text.length - 1,
            delay: 40,
        });
    }

}