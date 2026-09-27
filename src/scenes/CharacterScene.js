import Phaser from 'phaser';
import { SaveManager } from '../config/save.js';
import { CHARACTERS, getCharacter } from '../config/characters.js';
import { createButton, createText, createPanel } from '../objects/UI.js';

export class CharacterScene extends Phaser.Scene {
  constructor() {
    super('Character');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.selectedIdx = CHARACTERS.findIndex(c => c.id === SaveManager.get('character'));
    if (this.selectedIdx < 0) this.selectedIdx = 0;

    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Title
    createText(this, width / 2, 25, 'CHOOSE YOUR RIFTWALKER', {
      fontSize: 16, color: '#00ffcc',
    });

    // Character display area
    this.charDisplay = this.add.sprite(width / 2, 100, 'char_cute_0');
    this.charDisplay.setScale(2.5);

    // Character name and desc
    this.nameText = createText(this, width / 2, 155, '', { fontSize: 14, color: '#ffffff' });
    this.descText = createText(this, width / 2, 172, '', { fontSize: 9, color: '#aaaaaa' });

    // Stats bars
    this.statBars = {};
    const stats = ['speed', 'jump', 'attack'];
    const statColors = { speed: 0x44ff44, jump: 0x44aaff, attack: 0xff4444 };
    stats.forEach((stat, i) => {
      const y = 190 + i * 14;
      createText(this, width / 2 - 60, y, stat.toUpperCase(), { fontSize: 8, color: '#888888' });
      const bg = this.add.rectangle(width / 2 - 30, y, 100, 8, 0x333344).setOrigin(0, 0.5);
      const fill = this.add.rectangle(width / 2 - 30, y, 0, 8, statColors[stat]).setOrigin(0, 0.5);
      this.statBars[stat] = { bg, fill };
    });

    // Navigation arrows
    createButton(this, 30, 100, '<', () => this.navigate(-1), {
      width: 30, height: 30, fontSize: 14,
    });
    createButton(this, width - 30, 100, '>', () => this.navigate(1), {
      width: 30, height: 30, fontSize: 14,
    });

    // Customization section
    const custY = 230;
    createText(this, width / 2, custY, 'CUSTOMIZE', { fontSize: 10, color: '#00ffcc' });

    // Tint color picker
    createText(this, width / 2 - 80, custY + 20, 'Tint:', { fontSize: 9, color: '#aaaaaa' });
    this.tintBtns = [];
    const tints = [0xffffff, 0xff6666, 0x66ff66, 0x6666ff, 0xffff66, 0xff66ff, 0x66ffff, 0xff9933];
    tints.forEach((tint, i) => {
      const btn = this.add.circle(width / 2 - 40 + i * 18, custY + 22, 7, tint)
        .setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        SaveManager.set('custom', { ...SaveManager.get('custom'), tint });
        this.updateDisplay();
      });
      this.tintBtns.push(btn);
    });

    // Name input (tap to cycle names)
    createText(this, width / 2 - 80, custY + 40, 'Name:', { fontSize: 9, color: '#aaaaaa' });
    this.nameBtn = createButton(this, width / 2 + 20, custY + 40, SaveManager.get('custom').name, () => {
      const names = ['Riftwalker', 'Pixel', 'Nova', 'Blaze', 'Shadow', 'Storm'];
      const current = SaveManager.get('custom').name;
      const idx = names.indexOf(current);
      const next = names[(idx + 1) % names.length];
      SaveManager.set('custom', { ...SaveManager.get('custom'), name: next });
      this.nameBtn.list[1].setText(next);
    }, { width: 100, height: 22, fontSize: 9 });

    // Select button
    createButton(this, width / 2, height - 30, 'SELECT', () => {
      const char = CHARACTERS[this.selectedIdx];
      SaveManager.set('character', char.id);
      this.scene.start('Menu');
    }, { width: 160, height: 30, fontSize: 14 });

    // Back button
    createButton(this, 50, height - 30, 'BACK', () => {
      this.scene.start('Menu');
    }, { width: 80, height: 30, fontSize: 10 });

    this.updateDisplay();
  }

  navigate(dir) {
    this.selectedIdx = (this.selectedIdx + dir + CHARACTERS.length) % CHARACTERS.length;
    this.updateDisplay();
  }

  updateDisplay() {
    const char = CHARACTERS[this.selectedIdx];
    const key = `char_${char.id}`;

    // Update sprite
    if (this.textures.exists(`${key}_0`)) {
      this.charDisplay.setTexture(`${key}_0`);
      if (this.anims.exists(`${key}_idle`)) {
        this.charDisplay.play(`${key}_idle`);
      }
    }

    // Apply tint
    const tint = SaveManager.get('custom').tint;
    this.charDisplay.setTint(tint);

    // Update text
    this.nameText.setText(char.name);
    this.descText.setText(char.desc);

    // Update stats
    const maxStat = 260;
    for (const [stat, bars] of Object.entries(this.statBars)) {
      const val = char[stat];
      const pct = Math.min(val / maxStat, 1);
      bars.fill.width = 100 * pct;
    }
  }
}
