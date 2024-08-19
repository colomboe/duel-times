import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import RenderTexture = Phaser.GameObjects.RenderTexture;
import Text = Phaser.GameObjects.Text;
import {dictionary} from "../model/i18n.ts";

const { Between, FloatBetween } = Phaser.Math;
const { GetRandom } = Phaser.Utils.Array;

const tints = [0xff4136, 0xff851b, 0xffdc00, 0x01ff70, 0x2ecc40, 0x7fdbff, 0x0074d9, 0xf012be];

export class Final extends Phaser.Scene {

    private emitterConfig = {
        alpha: { start: 1, end: 0, ease: "Quad.easeOut" },
        angle: { start: 0, end: 360, steps: 100 },
        blendMode: "SCREEN",
        emitting: false,
        frequency: -1,
        gravityY: 128,
        lifespan: 1500,
        quantity: 500,
        reserve: 500,
        rotate: {min:0, max:45},
        speed: { min: 0, max: 256 }
    };
    private emitter1?: ParticleEmitter;
    private emitter2?: ParticleEmitter;
    private emitter3?: ParticleEmitter;
    private renderTexture?: RenderTexture;

    private credits?: Text;

    preload() {
        this.load.image("final-background", "game-assets/backgrounds/castle2.jpeg");
    }

    create() {

        this.sound.get("intro-music").stop();
        this.sound.get("intro-music").play();
        this.tweens.add({
            targets: this.sound.get("intro-music"),
            volume: 0.5,
            duration: 500,
        });

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.credits = this.make.text({
            x: screenCenterX,
            y: 1200,
            style: {
                fontFamily: "Univers, sans-serif",
                fontSize: 48,
                align: "center",
            },
            text: dictionary.credits,
        }).setOrigin(0.5, 0);

        const bg = this.add.image(screenCenterX, screenCenterY, "final-background");
        this.tweens.add({
            targets: bg,
            duration: 3000,
            alpha: {getStart: () => 0, getEnd: () => 0.3},
            ease: "Sin.out",
        })
            .play()
            .once("complete", () => {

                this.tweens.add({
                    targets: this.credits,
                    duration: 35000,
                    y: {getStart: () => 1200, getEnd: () => -3000},
                    ease: "Sin.out",
                }).once("complete", () => {

                    this.input.once("pointerdown", () => {
                        this.cameras.main.fadeOut(3000, 0, 0, 0);
                        this.tweens.add({
                            targets:  this.sound.get("intro-music"),
                            volume: {
                                getStart: () => 0.5,
                                getEnd: () => 0,
                            },
                            duration: 2500
                        });
                    });

                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                        this.scene.start("Start");
                    });

                });

                this.renderTexture = this.add
                    .renderTexture(0, 0, 1920, 1080)
                    .setOrigin(0, 0)
                    .setBlendMode("ADD");

                this.emitter1 = this.make.particles({ key: "__WHITE", config: this.emitterConfig }, false);
                this.emitter2 = this.make.particles({ key: "__WHITE", config: this.emitterConfig }, false);
                this.emitter3 = this.make.particles({ key: "__WHITE", config: this.emitterConfig }, false);

                this.time.addEvent({
                    delay: 3000,
                    startAt: Between(0, 3000),
                    repeat: -1,
                    callback: () => {
                        updateEmitter(this.emitter1!);
                    }
                });

                this.time.addEvent({
                    delay: 4000,
                    startAt: Between(0, 4000),
                    repeat: -1,
                    callback: () => {
                        updateEmitter(this.emitter2!);
                    }
                });

                this.time.addEvent({
                    delay: 5000,
                    startAt: Between(0, 5000),
                    repeat: -1,
                    callback: () => {
                        updateEmitter(this.emitter3!);
                    }
                });

            });
    }

    update(_time: number, delta: number) {
        if (this.renderTexture) {
            this.renderTexture!
                .fill(0, 0.01 * delta)
                .draw([this.emitter1, this.emitter2, this.emitter3]);
        }
    }

}

function updateEmitter(emitter: ParticleEmitter) {
    emitter.particleX = 1920 * FloatBetween(0, 0.75);
    emitter.particleY = 1080 * FloatBetween(0, 0.5);
    emitter.setParticleTint(GetRandom(tints));
    emitter.explode();
}