import Image = Phaser.GameObjects.Image;

import {Player} from "../model/definitions.ts";
import {gameStatus, players} from "../model/data.ts";
import {dictionary} from "../model/i18n.ts";

export class PlayerSelection extends Phaser.Scene {

    private avatars: Phaser.GameObjects.Image[] = [];
    private names: Phaser.GameObjects.Text[] = [];

    preload() {
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const offsetX = this.cameras.main.worldView.x + this.cameras.main.width / (players.length + 1);

        players.forEach((p, index) => {
            const avatar = this.createAvatar(offsetX, index, p);
            this.avatars.push(avatar);
            avatar.once("pointerdown", () => {
                gameStatus.selectedPlayer = p;
                this.sound.add("menu-sfx", { loop: false, volume: 1 }).play();
                this.names.forEach(t => {
                    this.tweens.add({
                        targets: t,
                        duration: 1000,
                        alpha: 0,
                    }).play();
                });
                this.avatars.forEach(a => {
                    if (a !== avatar)
                        this.tweens.add({
                            targets: a,
                            duration: 1000,
                            alpha: 0,
                        }).play();
                });

                setTimeout(() => this.cameras.main.fadeOut(1000, 0, 0, 0), 1500);
            });
        });

        const pressToStartText = this.add.text(
            screenCenterX,
            150,
            dictionary.selectPlayer,
            {fontFamily: "Arial Black", fontSize: 74, color: "#ccffff"}
        );
        pressToStartText.setStroke("#336699", 16);
        pressToStartText.setShadow(2, 2, "#333333", 2, true, false);
        pressToStartText.setOrigin(0.5);

        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start("NextEnemy");
        });
    }

    createAvatar(offsetX: number, index: number, player: Player): Image {
        const avatar = this.add.image(offsetX * (index + 1), 500, `player-${player.id}`);
        avatar.setScale(0.35);
        avatar.setInteractive();
        const text = this.add.text(
            offsetX * (index + 1),
            800,
            player.label,
            {fontFamily: "Arial Black", fontSize: 56, color: "#ccffff"}
        );
        text.setOrigin(0.5);
        this.names.push(text);
        return avatar;
    }
}