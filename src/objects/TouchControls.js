import Phaser from 'phaser';

// On-screen touch controls: virtual joystick (left) + A/B buttons (right)
export class TouchControls {
  constructor(scene) {
    this.scene = scene;
    this.joystickBase = null;
    this.joystickThumb = null;
    this.btnA = null;
    this.btnB = null;
    this.joystickVector = { x: 0, y: 0 };
    this.joystickPointer = null;
    this.btnAPointer = null;
    this.btnBPointer = null;
    this.isTouch = scene.sys.game.device.input.touch;

    this.create();
  }

  create() {
    const { width, height } = this.scene.cameras.main;
    const isLandscape = width > height;
    const scale = isLandscape ? 1.0 : 0.8;

    // Joystick base (left side)
    const jx = isLandscape ? 60 : 50;
    const jy = isLandscape ? height - 50 : height - 40;

    this.joystickBase = this.scene.add.circle(jx, jy, 40 * scale, 0x333344, 0.5)
      .setScrollFactor(0).setDepth(999);
    this.joystickThumb = this.scene.add.circle(jx, jy, 18 * scale, 0x00ffcc, 0.8)
      .setScrollFactor(0).setDepth(1000);

    // A button (jump) - right side
    const ax = isLandscape ? width - 100 : width - 80;
    const ay = isLandscape ? height - 40 : height - 35;
    this.btnA = this.scene.add.circle(ax, ay, 22 * scale, 0x44ff44, 0.7)
      .setScrollFactor(0).setDepth(1000);
    this.btnALabel = this.scene.add.text(ax, ay, 'A', {
      fontFamily: 'monospace', fontSize: `${14 * scale}px`, color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    // B button (attack) - right side, left of A
    const bx = isLandscape ? width - 50 : width - 45;
    const by = isLandscape ? height - 70 : height - 60;
    this.btnB = this.scene.add.circle(bx, by, 22 * scale, 0xff4444, 0.7)
      .setScrollFactor(0).setDepth(1000);
    this.btnBLabel = this.scene.add.text(bx, by, 'B', {
      fontFamily: 'monospace', fontSize: `${14 * scale}px`, color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);

    // Pause button (top-right)
    this.btnPause = this.scene.add.text(width - 20, 20, 'II', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffffff',
      backgroundColor: '#333344', padding: { x: 8, y: 4 },
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1000).setInteractive({ useHandCursor: true });

    this.btnPause.on('pointerdown', () => {
      this.scene.scene.pause();
      this.scene.scene.launch('Pause');
    });

    // Joystick input
    this.scene.input.on('pointerdown', (pointer) => {
      if (pointer.x < this.scene.cameras.main.width / 2 && pointer.y > this.scene.cameras.main.height * 0.4) {
        this.joystickPointer = pointer;
      }
    });

    this.scene.input.on('pointermove', (pointer) => {
      if (pointer === this.joystickPointer) {
        const dx = pointer.x - jx;
        const dy = pointer.y - jy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 35 * scale;
        const clampedDist = Math.min(dist, maxDist);
        const angle = Math.atan2(dy, dx);
        this.joystickThumb.x = jx + Math.cos(angle) * clampedDist;
        this.joystickThumb.y = jy + Math.sin(angle) * clampedDist;
        this.joystickVector.x = (clampedDist / maxDist) * Math.cos(angle);
        this.joystickVector.y = (clampedDist / maxDist) * Math.sin(angle);
      }
    });

    this.scene.input.on('pointerup', (pointer) => {
      if (pointer === this.joystickPointer) {
        this.joystickPointer = null;
        this.joystickThumb.x = jx;
        this.joystickThumb.y = jy;
        this.joystickVector.x = 0;
        this.joystickVector.y = 0;
      }
    });

    // A button (jump)
    this.btnA.on('pointerdown', () => { this.btnAPointer = true; });
    this.btnA.on('pointerup', () => { this.btnAPointer = false; });
    this.btnA.on('pointerout', () => { this.btnAPointer = false; });

    // B button (attack)
    this.btnB.on('pointerdown', () => { this.btnBPointer = true; });
    this.btnB.on('pointerup', () => { this.btnBPointer = false; });
    this.btnB.on('pointerout', () => { this.btnBPointer = false; });

    // Keyboard fallback
    this.keys = this.scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      a: Phaser.Input.Keyboard.KeyCodes.Z,
      b: Phaser.Input.Keyboard.KeyCodes.X,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.keys.pause.on('down', () => {
      this.scene.scene.pause();
      this.scene.scene.launch('Pause');
    });
  }

  getLeft() {
    if (this.keys.left.isDown) return true;
    return this.joystickVector.x < -0.3;
  }

  getRight() {
    if (this.keys.right.isDown) return true;
    return this.joystickVector.x > 0.3;
  }

  getJump() {
    return Phaser.Input.Keyboard.JustDown(this.keys.a) || this.btnAPointer === true;
  }

  getAttack() {
    return Phaser.Input.Keyboard.JustDown(this.keys.b) || this.btnBPointer === true;
  }

  getJumpHeld() {
    return this.keys.a.isDown;
  }

  destroy() {
    // Cleanup handled by scene shutdown
  }
}
