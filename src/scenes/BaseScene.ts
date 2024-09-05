import FADE_OUT_COMPLETE = Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE;
import FADE_IN_COMPLETE = Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE;
import {SceneName, timing} from "../Config.ts";

export interface XYPoint {
    x: number;
    y: number;
}

export abstract class BaseScene extends Phaser.Scene {

    protected screenCenter(): XYPoint {
        return {
            x: this.cameras.main.worldView.x + this.cameras.main.width / 2,
            y: this.cameras.main.worldView.y + this.cameras.main.height / 2,
        };
    }

    protected fadeOutAndNavigateTo(nextSceneName: SceneName, duration?: number) {
        this.cameras.main.once(FADE_OUT_COMPLETE, () => this.scene.start(nextSceneName));
        const d = duration ? duration : timing.fastTransition;
        this.cameras.main.fadeOut(d, 0, 0, 0);
    }

    protected fadeOutAndThen(next: () => void, duration?: number) {
        this.cameras.main.once(FADE_OUT_COMPLETE, () => next());
        const d = duration ? duration : timing.fastTransition;
        this.cameras.main.fadeOut(d, 0, 0, 0);
    }

    protected fadeInAndThen(next: () => void, duration?: number, pause?: number) {
        if (pause)
            this.cameras.main.once(FADE_IN_COMPLETE, () => setTimeout(() => next(), pause));
        else
            this.cameras.main.once(FADE_IN_COMPLETE, () => next());
        const d = duration ? duration : timing.fastTransition;
        this.cameras.main.fadeIn(d, 0, 0, 0);
    }

    protected navigateTo(nextSceneName: SceneName) {
        this.scene.start(nextSceneName);
    }

}