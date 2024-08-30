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

    protected fadeOutAndNavigateTo(nextSceneName: SceneName) {
        this.cameras.main.once(FADE_OUT_COMPLETE, () => this.scene.start(nextSceneName));
        this.cameras.main.fadeOut(timing.fastTransition, 0, 0, 0);
    }

    protected fadeInAndThen(next: () => void) {
        this.cameras.main.once(FADE_IN_COMPLETE, () => next());
        this.cameras.main.fadeIn(timing.fastTransition, 0, 0, 0);
    }

}