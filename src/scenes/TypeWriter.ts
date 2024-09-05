import TimerEvent = Phaser.Time.TimerEvent;
import Text = Phaser.GameObjects.Text;
import Phaser, {Scene} from "phaser";

export class TypeWriter {

    private scene: Scene;
    private renderedText: Text;

    private textToWrite: string = "";
    private timerEvent?: TimerEvent = undefined;
    private resolve?: () => void = undefined;
    private started: boolean = false;

    constructor(scene: Scene, renderedText: Text) {
        this.scene = scene;
        this.renderedText = renderedText;
    }

    start(text: string) {
        return new Promise<void>(resolve => {
            this.started = true;
            let i = 0;
            this.textToWrite = text;
            this.resolve = resolve;
            this.timerEvent = this.scene.time.addEvent({
                callback: () => {
                    if (this.started) {
                        this.renderedText.text += text[i++];
                        if (i >= text.length) {
                            this.resolve = undefined;
                            resolve();
                        }
                    }
                },
                repeat: text.length - 1,
                delay: 40,
            });
        });
    }

    reset() {
        this.destroy();
        this.renderedText.text = "";
        this.resolve = undefined;
    }

    skip() {
        if (this.started) {
            this.destroy();
            this.renderedText.text = this.textToWrite;
            if (this.resolve) this.resolve();
            this.resolve = undefined;
        }
    }

    destroy() {
        this.started = false;
        this.timerEvent?.remove();
        this.timerEvent?.destroy();
        this.timerEvent = undefined;
    }

    isStarted() {
        return this.started;
    }
}