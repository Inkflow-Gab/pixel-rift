import Phaser from 'phaser';
import { createButton, createText, createPanel } from '../objects/UI.js';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('Pause');
  }

  create() {
    const { width, height } = this.cameras.main;

    createPanel(this, width / 2, height / 2, 200, 160);
    createText(this, width / 2, height / 2 - 55, 'PAUSED', { fontSize: 18, color: '#00ffcc' });

    createButton(this, width / 2, height / 2 - 15, 'RESUME', () => {
      this.scene.stop();
      this.scene.resume('Level');
    }, { width: 140, height: 30, fontSize: 12 });

    createButton(this, width / 2, height / 2 + 25, 'RESTART', () => {
      this.scene.stop();
      this.scene.stop('Level');
      this.scene.start('Level', { world: this.scene.get('Level').worldIdx, stage: this.scene.get('Level').stageIdx });
    }, { width: 140, height: 30, fontSize: 12 });

    createButton(this, width / 2, height / 2 + 65, 'QUIT', () => {
      this.scene.stop();
      this.scene.stop('Level');
      this.scene.start('Menu');
    }, { width: 140, height: 30, fontSize: 12, bgColor: 0x442222, borderColor: 0xff4444 });
  }
}
