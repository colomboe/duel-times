import Image = Phaser.GameObjects.Image;
import Text = Phaser.GameObjects.Text;

import {Player} from "../model/definitions.ts";
import {gameStatus, players} from "../model/data.ts";
import {dictionary} from "../model/i18n.ts";
import {BaseScene} from "./BaseScene.ts";
import {paletteString, timing} from "../Config.ts";

export class PlayerSelection extends BaseScene {

    private avatars: Image[] = [];
    private names: Text[] = [];

    preload() {
    }

    create() {
        const center = this.screenCenter();
        const offsetX = this.cameras.main.worldView.x + this.cameras.main.width / (players.length + 1);

        players.forEach((p, index) => {
            const avatar = this.createAvatar(offsetX, index, p);
            avatar.once("pointerdown", () => this.avatarSelected(avatar, p));
        });

        this.add.text(center.x, 150, dictionary.selectPlayer,
            {fontFamily: "Arial Black, Arial-BoldMT", fontSize: 74, color: paletteString.lightCyan})
            .setStroke(paletteString.blue, 16)
            .setShadow(2, 2, paletteString.darkGray, 2, true, false)
            .setOrigin(0.5);

        this.fadeInAndThen(() => {});
    }

    private avatarSelected(avatar: Image, player: Player) {
        gameStatus.selectedPlayer = player;
        this.sound.add("menu-sfx", { loop: false, volume: 1 }).play();

        this.names.forEach(t => {
            this.tweens.add({ targets: t, duration: timing.fastTransition, alpha: 0 }).play();
        });

        this.avatars.forEach(a => {
            if (a !== avatar)
                this.tweens.add({ targets: a, duration: timing.fastTransition, alpha: 0 }).play();
        });

        setTimeout(() => this.fadeOutAndNavigateTo("Story"), timing.fastTransition * 1.5);
    }

    private createAvatar(offsetX: number, index: number, player: Player): Image {
        const avatar = this.add.image(offsetX * (index + 1), 500, `player-${player.id}`)
            .setScale(0.35)
            .setInteractive();

        const text = this.add.text(
            offsetX * (index + 1),
            800,
            player.label,
            {fontFamily: "Arial Black, Arial-BoldMT", fontSize: 56, color: paletteString.lightCyan}
        ).setOrigin(0.5);

        this.avatars.push(avatar);
        this.names.push(text);

        return avatar;
    }
}