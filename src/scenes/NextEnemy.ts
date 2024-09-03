import {gameStatus} from "../model/data.ts";
import {getDefeatedCount} from "../model/actions.ts";
import {dictionary} from "../model/i18n.ts";
import {fonts, paletteString, timing} from "../Config.ts";
import {BaseScene} from "./BaseScene.ts";

export class NextEnemy extends BaseScene {

    create() {

        const center = this.screenCenter();
        const offsetX = this.cameras.main.worldView.x + this.cameras.main.width / 4;

        this.tweens.add({ targets:  this.sound.get("intro-music"), volume: 0.5, duration: 500 });

        this.add.image(offsetX * 2, 500, "rival-frame")
            .setScale(0.55);

        const scrollOffsetX = -offsetX * getDefeatedCount();

        gameStatus.levels.forEach((level) => {
            if (level.status === "HIDDEN") {
                this.add
                    .image(scrollOffsetX + offsetX * (level.index + 2), 500, "rival-placeholder")
                    .setAlpha(0.3, 0.3, 0.3, 0.3)
                    .setScale(0.35);
            }
            else if (level.status === "DEFEATED") {
                this.add
                    .image(scrollOffsetX + offsetX * (level.index + 2), 500, `rival-defeated-${level.index}`)
                    .setScale(0.35);
            }
            else {
                this.add
                    .image(scrollOffsetX + offsetX * (level.index + 2), 500, `rival-${level.index}`)
                    .setScale(0.35);
            }

        });

        this.add.text(center.x, 150, dictionary.nextRival, fonts.big(paletteString.yellow))
            .setStroke(paletteString.gold, 16)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5);

        this.fadeInAndThen(() => {
            this.input.once("pointerdown", () => {
                this.sound.add("menu-sfx", { loop: false, volume: 1 }).play();
                this.tweens.add({
                    targets:  this.sound.get("intro-music"),
                    volume: {
                        getStart: () => 0.5,
                        getEnd: () => 0,
                    },
                    duration: timing.fastTransition * 0.9
                });
                this.fadeOutAndNavigateTo("Battle");
            });
        });


    }

}