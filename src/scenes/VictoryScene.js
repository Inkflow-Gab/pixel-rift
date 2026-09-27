import Phaser from 'phaser';
import { SaveManager } from '../config/save.js';
import { WORLDS } from '../config/worlds.js';
import { createButton, createText, createPanel } from '../objects/UI.js';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('Victory');
  }

  init(data) {
    this.score = data.score || 0;
    this.coins = data.coins || 0;
    this.stars = data.stars || 1;
    this.world = data.world || 0;
    this.stage = data.stage || 0;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#0a1a0a');

    createPanel(this, width / 2, height / 2, 220, 180);
    createText(this, width / 2, height / 2 - 60, 'VICTORY!', { fontSize: 20, color: '#44ff44' });

    // Stars
    const starStr = '★'.repeat(this.stars) + '☆'.repeat(3 - this.stars);
    createText(this, width / 2, height / 2 - 30, starStr, { fontSize: 24, color: '#ffcc00' });

    createText(this, width / 2, height / 2, `Score: ${this.score}`, { fontSize: 12, color: '#ffffff' });
    createText(this, width / 2, height / 2 + 18, `Coins: ${this.coins}`, { fontSize: 10, color: '#ffcc00' });

    // Next stage or world map
    const hasNext = this.stage < 2 || this.world < WORLDS.length - 1;
    if (hasNext) {
      createButton(this, width / 2, height / 2 + 45, 'NEXT', () => {
        let nextWorld = this.world;
        let nextStage = this.stage + 1;
        if (nextStage > 2) {
          nextStage = 0;
          nextWorld = this.world + 1;
        }
        this.scene.start('Level', { world: nextWorld, stage: nextStage });
      }, { width: 140, height: 30, fontSize: 12 });
    }

    createButton(this, width / 2, height / 2 + 80, 'WORLD MAP', () => {
      this.scene.start('WorldMap');
    }, { width: 140, height: 30, fontSize: 12 });

    createButton(this, width / 2, height / 2 + 115, 'MENU', () => {
      this.scene.start('Menu');
    }, { width: 140, height: 30, fontSize: 12 });
  }
}
