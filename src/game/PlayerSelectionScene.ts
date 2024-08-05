export class PlayerSelectionScene extends Phaser.Scene {

    preload() {
        this.load.image('avatar1', 'game-assets/avatar1.png');
        this.load.image('avatar2', 'game-assets/avatar2.png');
        this.load.image('avatar3', 'game-assets/avatar3.png');
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        const offsetX = this.cameras.main.worldView.x + this.cameras.main.width / 4

        this.createAvatar(offsetX, 1, "Lisa");
        this.createAvatar(offsetX, 2, "Mark");
        this.createAvatar(offsetX, 3, "Foxy");

        const pressToStartText = this.add.text(
            screenCenterX,
            150,
            'Select your player',
            {fontFamily: 'Arial Black', fontSize: 74, color: '#ccffff'}
        );
        pressToStartText.setStroke('#336699', 16);
        pressToStartText.setShadow(2, 2, '#333333', 2, true, false);
        pressToStartText.setOrigin(0.5);

        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    createAvatar(offsetX: number, index: number, name: string) {
        const avatar = this.add.image(offsetX * index, 500, `avatar${index}`);
        avatar.setScale(0.4);

        this.add.text(
            offsetX * index,
            800,
            name,
            {fontFamily: 'Arial Black', fontSize: 56, color: '#ccffff'}
        ).setOrigin(0.5);
    }
}