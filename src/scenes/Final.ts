import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import RenderTexture = Phaser.GameObjects.RenderTexture;
import Text = Phaser.GameObjects.Text;
import {dictionary} from "../model/i18n.ts";
import {BaseScene} from "./BaseScene.ts";
import {fonts, paletteString, timing} from "../Config.ts";

const {Between, FloatBetween} = Phaser.Math;
const {GetRandom} = Phaser.Utils.Array;

const tints = [0xff4136, 0xff851b, 0xffdc00, 0x01ff70, 0x2ecc40, 0x7fdbff, 0x0074d9, 0xf012be];

export class Final extends BaseScene {

    private emitterConfig = {
        alpha: {start: 1, end: 0, ease: "Quad.easeOut"},
        angle: {start: 0, end: 360, steps: 100},
        blendMode: "SCREEN",
        emitting: false,
        frequency: -1,
        gravityY: 128,
        lifespan: 1500,
        quantity: 500,
        reserve: 500,
        rotate: {min: 0, max: 45},
        speed: {min: 0, max: 256}
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

        const center = this.screenCenter();

        this.sound.get("intro-music").stop();
        this.sound.get("intro-music").play();
        this.tweens.add({
            targets: this.sound.get("intro-music"),
            volume: 0.5,
            duration: timing.veryFastTransition,
        });

        this.credits = this.make.text({x: center.x, y: 1200,
            style: fonts.credits(paletteString.white),
            text: dictionary.credits,
        }).setOrigin(0.5, 0);

        const bg = this.add.image(center.x, center.y, "final-background");
        this.tweens.add({
            targets: bg,
            duration: timing.slowTransition,
            alpha: {getStart: () => 0, getEnd: () => 0.3},
            ease: "Sin.out",
        }).play()
            .once("complete", () => this.backgroundShown());
    }

    update(_time: number, delta: number) {
        if (this.renderTexture && this.emitter1 && this.emitter1 && this.emitter3) {
            this.renderTexture
                .fill(0, 0.01 * delta)
                .draw([this.emitter1, this.emitter2, this.emitter3]);
        }
    }

    private backgroundShown() {
        this.tweens.add({
            targets: this.credits,
            duration: 35000,
            y: {getStart: () => 1200, getEnd: () => -3000},
            ease: "Sin.out",
        })
            .once("complete", () => this.creditsCompleted());

        this.renderTexture = this.add
            .renderTexture(0, 0, 1920, 1080)
            .setOrigin(0, 0)
            .setBlendMode("ADD");

        this.emitter1 = this.initEmitter();
        this.emitter2 = this.initEmitter();
        this.emitter3 = this.initEmitter();
    }

    private initEmitter() {
        const emitter = this.make.particles({key: "__WHITE", config: this.emitterConfig}, false);
        this.time.addEvent({
            delay: 3000,
            startAt: Between(0, 3000),
            repeat: -1,
            callback: () => this.updateEmitter(emitter)
        });
        return emitter;
    }

    private updateEmitter(emitter: ParticleEmitter) {
        emitter.particleX = 1920 * FloatBetween(0, 0.75);
        emitter.particleY = 1080 * FloatBetween(0, 0.5);
        emitter.setParticleTint(GetRandom(tints));
        emitter.explode();
    }

    private creditsCompleted() {
        this.input.once("pointerdown", () => {
            this.fadeOutAndThen(() => {

                this.emitter1?.destroy();
                this.emitter2?.destroy();
                this.emitter3?.destroy();
                this.renderTexture?.destroy();
                this.emitter1 = undefined;
                this.emitter2 = undefined;
                this.emitter3 = undefined;
                this.renderTexture = undefined;

                this.navigateTo("Start");

            }, timing.slowTransition);
            this.tweens.add({
                targets: this.sound.get("intro-music"),
                volume: {
                    getStart: () => 0.5,
                    getEnd: () => 0,
                },
                duration: timing.slowTransition * 0.8,
            });
        });
    }

}
