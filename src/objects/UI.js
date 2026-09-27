import Phaser from 'phaser';

// Pixel-art UI helper
export function createButton(scene, x, y, text, callback, options = {}) {
  const {
    width = 160, height = 36, fontSize = 14,
    bgColor = 0x333344, hoverColor = 0x444466, textColor = '#ffffff',
    borderColor = 0x00ffcc,
  } = options;

  const container = scene.add.container(x, y);

  const bg = scene.add.rectangle(0, 0, width, height, bgColor)
    .setStrokeStyle(2, borderColor);
  const label = scene.add.text(0, 0, text, {
    fontFamily: 'monospace', fontSize: `${fontSize}px`, color: textColor,
  }).setOrigin(0.5);

  container.add([bg, label]);
  container.setSize(width, height);
  container.setInteractive({ useHandCursor: true });

  container.on('pointerover', () => bg.setFillStyle(hoverColor));
  container.on('pointerout', () => bg.setFillStyle(bgColor));
  container.on('pointerdown', () => {
    bg.setFillStyle(0x222233);
    scene.time.delayedCall(100, () => {
      bg.setFillStyle(bgColor);
      callback();
    });
  });

  return container;
}

export function createPanel(scene, x, y, width, height, alpha = 0.85) {
  const panel = scene.add.rectangle(x, y, width, height, 0x1a1a2e, alpha)
    .setStrokeStyle(2, 0x00ffcc);
  return panel;
}

export function createText(scene, x, y, text, options = {}) {
  const { fontSize = 14, color = '#ffffff', align = 'center', origin = 0.5 } = options;
  return scene.add.text(x, y, text, {
    fontFamily: 'monospace',
    fontSize: `${fontSize}px`,
    color,
    align,
    stroke: '#000000',
    strokeThickness: 2,
  }).setOrigin(origin);
}

export function createBar(scene, x, y, width, height, bgColor, fillColor) {
  const bg = scene.add.rectangle(x, y, width, height, bgColor).setOrigin(0, 0.5);
  const fill = scene.add.rectangle(x, y, width, height, fillColor).setOrigin(0, 0.5);
  return {
    bg, fill,
    set(percent) {
      fill.width = Math.max(0, width * Phaser.Math.Clamp(percent, 0, 1));
    },
    destroy() { bg.destroy(); fill.destroy(); },
  };
}
