import Phaser from 'phaser';
import { SaveManager } from '../config/save.js';
import { getWorld } from '../config/worlds.js';
import { getCharacter } from '../config/characters.js';
import { TouchControls } from '../objects/TouchControls.js';
import { createText, createBar } from '../objects/UI.js';

const P = (pack, path) => `assets/packs/${pack}/${path}`;

export class LevelScene extends Phaser.Scene {
  constructor() {
    super('Level');
  }

  init(data) {
    this.worldIdx = data.world || 0;
    this.stageIdx = data.stage || 0;
    this.world = getWorld(this.worldIdx);
    this.isBossStage = this.stageIdx === 2;
  }

  preload() {
    const w = this.world;

    // Loading bar
    const { width, height } = this.cameras.main;
    const barBg = this.add.rectangle(width / 2, height / 2, 200, 12, 0x333344);
    const bar = this.add.rectangle(width / 2 - 95, height / 2, 0, 8, 0x00ffcc).setOrigin(0, 0.5);
    this.load.on('progress', (v) => { bar.width = 190 * v; });
    this.load.on('complete', () => { barBg.destroy(); bar.destroy(); });

    // World assets
    this.load.image('bg', w.background);
    if (w.ground) this.load.image('ground', w.ground);
    if (w.platform) this.load.image('platform', w.platform);

    w.decor.forEach((d, i) => this.load.image(`decor_${i}`, d.sprite));
    w.ambient.forEach((a, i) => this.load.image(`ambient_${i}`, a.sprite));

    const enemies = this.isBossStage ? [] : w.enemies;
    enemies.forEach((e, i) => this.load.image(`enemy_${i}`, e.sprite));

    if (this.isBossStage) this.load.image('boss', w.boss.sprite);

    w.collectibles.forEach((c, i) => this.load.image(`collect_${i}`, c.sprite));

    this.load.audio('music', w.music);

    this.load.image('fx_explosion', P('Super Pixel Effects Gigapack (Free Version)', 'PNG/Explosions/epic_explosion_001/epic_explosion_001_large_orange/frame0000.png'));
    this.load.image('fx_hit', P('Super Pixel Effects Gigapack (Free Version)', 'PNG/Impacts/impact_001/impact_001_large_yellow/frame0000.png'));
  }

  create() {
    const w = this.world;
    const char = getCharacter(SaveManager.get('character'));
    const { width, height } = this.cameras.main;

    this.cameras.main.setBackgroundColor(w.bgColor);
    this.score = 0;
    this.coins = 0;
    this.gameOver = false;
    this.levelComplete = false;

    if (this.textures.exists('bg')) {
      const bg = this.add.image(0, 0, 'bg').setOrigin(0);
      bg.setDisplaySize(w.levelLength, height);
      bg.setAlpha(0.5);
    }

    this.createLevel();
    this.createPlayer(char);

    this.enemies = this.physics.add.group();
    this.spawnEnemies();

    this.collectibles = this.physics.add.group();
    this.spawnCollectibles();

    if (this.isBossStage) this.spawnBoss();

    this.spawnDecor();
    this.createHUD();

    this.controls = new TouchControls(this);

    if (this.cache.audio.exists('music')) {
      this.music = this.sound.add('music', { volume: SaveManager.get('settings').music, loop: true });
      this.music.play();
    }

    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.player, this.platformGroup);
    this.physics.add.collider(this.enemies, this.groundGroup);
    this.physics.add.collider(this.enemies, this.platformGroup);
    this.physics.add.overlap(this.player, this.enemies, this.onPlayerEnemy, null, this);
    this.physics.add.overlap(this.player, this.collectibles, this.onCollect, null, this);
    if (this.boss) {
      this.physics.add.collider(this.boss, this.groundGroup);
      this.physics.add.overlap(this.player, this.boss, this.onPlayerBoss, null, this);
    }

    this.attackZone = this.add.zone(this.player.x, this.player.y, 40, 30);
    this.physics.add.existing(this.attackZone);

    this.cameras.main.setBounds(0, 0, w.levelLength, height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.showIntro();
  }

  createLevel() {
    const w = this.world;
    const { height } = this.cameras.main;
    const groundY = height - 30;

    this.groundGroup = this.physics.add.staticGroup();
    this.platformGroup = this.physics.add.staticGroup();

    const gapFrequency = w.shooter ? 0 : 800;
    let x = 0;
    while (x < w.levelLength) {
      const segWidth = Phaser.Math.Between(400, 700);
      if (this.textures.exists('ground')) {
        const ground = this.add.tileSprite(x + segWidth / 2, groundY + 15, segWidth, 30, 'ground');
        this.physics.add.existing(ground, true);
        this.groundGroup.add(ground);
      } else {
        for (let px = x; px < x + segWidth; px += 100) {
          if (Math.random() > 0.3) {
            const plat = this.add.tileSprite(px + 50, groundY, 100, 16, 'platform');
            this.physics.add.existing(plat, true);
            this.platformGroup.add(plat);
          }
        }
      }
      x += segWidth + (Math.random() > 0.6 ? gapFrequency : 0);
    }

    if (!w.shooter) {
      for (let px = 200; px < w.levelLength - 200; px += Phaser.Math.Between(200, 400)) {
        const py = groundY - Phaser.Math.Between(60, 120);
        const pw = Phaser.Math.Between(60, 150);
        if (this.textures.exists('platform')) {
          const plat = this.add.tileSprite(px, py, pw, 16, 'platform');
          this.physics.add.existing(plat, true);
          this.platformGroup.add(plat);
        }
      }
    }

    this.killZone = this.add.zone(w.levelLength / 2, height + 50, w.levelLength, 100);
    this.physics.add.existing(this.killZone);
    this.physics.add.overlap(this.player, this.killZone, this.onPlayerFall, null, this);

    this.portal = this.add.sprite(w.levelLength - 80, groundY - 30, 'fx_explosion');
    this.portal.setScale(1.5);
    this.portal.setTint(0x00ffcc);
    this.tweens.add({
      targets: this.portal,
      scale: 2,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    this.physics.add.existing(this.portal);
    this.physics.add.overlap(this.player, this.portal, this.onReachPortal, null, this);
  }

  createPlayer(char) {
    const { height } = this.cameras.main;
    const key = `char_${char.id}`;

    this.player = this.physics.add.sprite(50, height - 80, `${key}_0`);
    this.player.setScale(char.scale);
    this.player.setCollideWorldBounds(false);
    this.player.body.setSize(char.frameW * 0.6, char.frameH * 0.8);
    this.player.setTint(SaveManager.get('custom').tint);
    this.player.charData = char;
    this.player.health = 5;
    this.player.maxHealth = 5;
    this.player.invincible = false;
    this.player.attackCooldown = 0;
    this.player.facingRight = true;

    if (this.anims.exists(`${key}_idle`)) this.player.play(`${key}_idle`);
  }

  spawnEnemies() {
    const w = this.world;
    const { height } = this.cameras.main;
    const groundY = height - 50;
    const count = this.isBossStage ? 0 : Math.floor(w.levelLength / 400);

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(300, w.levelLength - 200);
      const enemyData = w.enemies[i % w.enemies.length];
      const key = `enemy_${i % w.enemies.length}`;

      if (!this.textures.exists(key)) continue;

      const enemy = this.enemies.create(x, groundY - 20, key);
      enemy.setScale(enemyData.scale || 1);
      enemy.hp = enemyData.hp * w.difficulty;
      enemy.speed = enemyData.speed;
      enemy.behavior = enemyData.behavior;
      enemy.score = enemyData.score;
      enemy.body.setSize(enemy.width * 0.7, enemy.height * 0.7);

      if (enemy.behavior === 'flyer') {
        this.tweens.add({
          targets: enemy,
          y: enemy.y + Phaser.Math.Between(-40, 40),
          duration: Phaser.Math.Between(1000, 2000),
          yoyo: true,
          repeat: -1,
        });
      }
    }
  }

  spawnBoss() {
    const w = this.world;
    const { height } = this.cameras.main;
    const groundY = height - 60;

    this.boss = this.physics.add.sprite(w.levelLength - 200, groundY - 40, 'boss');
    this.boss.setScale(w.boss.scale || 1.5);
    this.boss.hp = w.boss.hp * w.difficulty;
    this.boss.maxHp = this.boss.hp;
    this.boss.speed = w.boss.speed;
    this.boss.score = w.boss.score;
    this.boss.body.setSize(this.boss.width * 0.6, this.boss.height * 0.6);
    this.boss.setTint(0xff4444);

    this.bossBar = createBar(this, this.boss.x - 40, this.boss.y - 50, 80, 8, 0x333344, 0xff4444);
  }

  spawnCollectibles() {
    const w = this.world;
    const { height } = this.cameras.main;
    const groundY = height - 60;
    const count = Math.floor(w.levelLength / 200);

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(200, w.levelLength - 100);
      const y = groundY - Phaser.Math.Between(30, 100);
      const collData = w.collectibles[i % w.collectibles.length];
      const key = `collect_${i % w.collectibles.length}`;

      if (!this.textures.exists(key)) continue;

      const coll = this.collectibles.create(x, y, key);
      coll.setScale(0.8);
      coll.value = collData.value;
      coll.type = collData.type;
      coll.body.setSize(coll.width, coll.height);

      this.tweens.add({
        targets: coll,
        y: y - 8,
        duration: Phaser.Math.Between(800, 1500),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  spawnDecor() {
    const w = this.world;
    const { height } = this.cameras.main;

    w.decor.forEach((d, i) => {
      if (this.textures.exists(`decor_${i}`)) {
        const x = d.x * w.levelLength;
        const y = d.y * height;
        const sprite = this.add.image(x, y, `decor_${i}`);
        sprite.setScale(d.scale || 1);
        sprite.setAlpha(0.7);
        sprite.setDepth(-1);
      }
    });

    w.ambient.forEach((a, i) => {
      if (this.textures.exists(`ambient_${i}`)) {
        const x = a.x * w.levelLength;
        const y = a.y * height;
        const sprite = this.add.image(x, y, `ambient_${i}`);
        sprite.setScale(0.8);
        sprite.setAlpha(0.5);
      }
    });
  }

  createHUD() {
    const { width } = this.cameras.main;

    this.healthBar = createBar(this, 10, 10, 80, 8, 0x333344, 0xff4444);
    this.scoreText = createText(this, 100, 14, 'Score: 0', { fontSize: 8, color: '#ffffff', origin: 0 });
    this.coinText = createText(this, 100, 26, 'Coins: 0', { fontSize: 8, color: '#ffcc00', origin: 0 });
    createText(this, width / 2, 14, this.world.name, { fontSize: 8, color: '#aaaaaa' });

    if (this.bossBar) {
      this.bossBar.bg.setVisible(false);
      this.bossBar.fill.setVisible(false);
    }
  }

  showIntro() {
    const { width, height } = this.cameras.main;
    const text = this.isBossStage ? 'BOSS FIGHT!' : `${this.world.name} - Stage ${this.stageIdx + 1}`;
    const intro = createText(this, width / 2, height / 2, text, { fontSize: 20, color: '#00ffcc' });
    intro.setScrollFactor(0);
    this.tweens.add({
      targets: intro,
      alpha: 0,
      y: height / 2 - 30,
      duration: 2000,
      onComplete: () => intro.destroy(),
    });
  }

  update(time, delta) {
    if (this.gameOver || this.levelComplete) return;

    const char = this.player.charData;
    const { height } = this.cameras.main;

    // Player movement
    if (this.controls.getLeft()) {
      this.player.setVelocityX(-char.speed);
      this.player.setFlipX(true);
      this.player.facingRight = false;
      if (this.player.body.blocked.down && !this.player.anims.isPlaying) {
        const key = `char_${char.id}`;
        if (this.anims.exists(`${key}_run`)) this.player.play(`${key}_run`);
      }
    } else if (this.controls.getRight()) {
      this.player.setVelocityX(char.speed);
      this.player.setFlipX(false);
      this.player.facingRight = true;
      if (this.player.body.blocked.down && !this.player.anims.isPlaying) {
        const key = `char_${char.id}`;
        if (this.anims.exists(`${key}_run`)) this.player.play(`${key}_run`);
      }
    } else {
      this.player.setVelocityX(0);
      if (this.player.body.blocked.down) {
        const key = `char_${char.id}`;
        if (this.anims.exists(`${key}_idle`)) this.player.play(`${key}_idle`);
      }
    }

    // Jump
    if (this.controls.getJump() && this.player.body.blocked.down) {
      this.player.setVelocityY(-char.jump);
      const key = `char_${char.id}`;
      if (this.anims.exists(`${key}_jump`)) this.player.play(`${key}_jump`);
    }

    // Attack
    if (this.controls.getAttack() && time > this.player.attackCooldown) {
      this.player.attackCooldown = time + 400;
      this.performAttack();
    }

    // Update attack zone position
    this.attackZone.x = this.player.x + (this.player.facingRight ? 25 : -25);
    this.attackZone.y = this.player.y;

    // Enemy behavior
    this.enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.active) return;
      if (enemy.behavior === 'walker' || enemy.behavior === 'charger') {
        const dir = this.player.x > enemy.x ? 1 : -1;
        enemy.setVelocityX(dir * enemy.speed);
        enemy.setFlipX(dir < 0);
      } else if (enemy.behavior === 'shooter') {
        const dir = this.player.x > enemy.x ? 1 : -1;
        enemy.setVelocityX(dir * enemy.speed * 0.5);
        if (Math.random() < 0.01) {
          this.enemyShoot(enemy);
        }
      }
    });

    // Boss behavior
    if (this.boss && this.boss.active) {
      const dir = this.player.x > this.boss.x ? 1 : -1;
      this.boss.setVelocityX(dir * this.boss.speed);
      this.boss.setFlipX(dir < 0);
      this.bossBar.set(this.boss.hp / this.boss.maxHp);
      this.bossBar.bg.x = this.boss.x - 40;
      this.bossBar.bg.y = this.boss.y - 50;
      this.bossBar.fill.x = this.boss.x - 40;
      this.bossBar.fill.y = this.boss.y - 50;
    }

    // Update HUD
    this.healthBar.set(this.player.health / this.player.maxHealth);
    this.scoreText.setText(`Score: ${this.score}`);
    this.coinText.setText(`Coins: ${this.coins}`);

    // Check fall
    if (this.player.y > height + 100) {
      this.onPlayerFall();
    }
  }

  performAttack() {
    const char = this.player.charData;
    const key = `char_${char.id}`;
    if (this.anims.exists(`${key}_attack`)) {
      this.player.play(`${key}_attack`);
    }

    const attackX = this.player.x + (this.player.facingRight ? 30 : -30);
    const attackY = this.player.y;

    this.enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.active) return;
      const dist = Phaser.Math.Distance.Between(attackX, attackY, enemy.x, enemy.y);
      if (dist < 40) {
        this.damageEnemy(enemy, char.attack);
      }
    });

    if (this.boss && this.boss.active) {
      const dist = Phaser.Math.Distance.Between(attackX, attackY, this.boss.x, this.boss.y);
      if (dist < 50) {
        this.damageBoss(char.attack);
      }
    }

    if (this.textures.exists('fx_hit')) {
      const fx = this.add.image(attackX, attackY, 'fx_hit');
      fx.setScale(0.5);
      this.tweens.add({
        targets: fx,
        alpha: 0,
        scale: 1,
        duration: 200,
        onComplete: () => fx.destroy(),
      });
    }
  }

  damageEnemy(enemy, damage) {
    enemy.hp -= damage;
    enemy.setTint(0xffffff);
    this.time.delayedCall(100, () => enemy.clearTint());

    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    }
  }

  killEnemy(enemy) {
    this.score += enemy.score;
    SaveManager.addScore(this.score);

    if (this.textures.exists('fx_explosion')) {
      const fx = this.add.image(enemy.x, enemy.y, 'fx_explosion');
      fx.setScale(0.5);
      this.tweens.add({
        targets: fx,
        alpha: 0,
        scale: 1.5,
        duration: 300,
        onComplete: () => fx.destroy(),
      });
    }

    enemy.destroy();
  }

  damageBoss(damage) {
    this.boss.hp -= damage;
    this.boss.setTint(0xffffff);
    this.time.delayedCall(100, () => this.boss.setTint(0xff4444));

    if (this.boss.hp <= 0) {
      this.killBoss();
    }
  }

  killBoss() {
    this.score += this.boss.score;
    SaveManager.addScore(this.score);

    if (this.textures.exists('fx_explosion')) {
      for (let i = 0; i < 5; i++) {
        const fx = this.add.image(
          this.boss.x + Phaser.Math.Between(-30, 30),
          this.boss.y + Phaser.Math.Between(-30, 30),
          'fx_explosion'
        );
        fx.setScale(1);
        this.tweens.add({
          targets: fx,
          alpha: 0,
          scale: 2,
          duration: 500,
          onComplete: () => fx.destroy(),
        });
      }
    }

    this.boss.destroy();
    this.bossBar.bg.destroy();
    this.bossBar.fill.destroy();

    this.time.delayedCall(1000, () => {
      this.levelComplete = true;
      this.onLevelComplete();
    });
  }

  enemyShoot(enemy) {
    const bullet = this.physics.add.sprite(enemy.x, enemy.y, 'fx_hit');
    bullet.setScale(0.3);
    bullet.setTint(0xff0000);
    const dir = this.player.x > enemy.x ? 1 : -1;
    bullet.setVelocityX(dir * 200);
    this.time.delayedCall(2000, () => bullet.destroy());

    this.physics.add.overlap(this.player, bullet, () => {
      this.damagePlayer(1);
      bullet.destroy();
    });
  }

  onPlayerEnemy(player, enemy) {
    if (player.invincible) return;
    this.damagePlayer(1);
  }

  onPlayerBoss(player, boss) {
    if (player.invincible) return;
    this.damagePlayer(1);
  }

  damagePlayer(damage) {
    if (this.player.invincible) return;
    this.player.health -= damage;
    this.player.invincible = true;
    this.player.setTint(0xff0000);

    if (SaveManager.get('settings').shake) {
      this.cameras.main.shake(100, 0.01);
    }

    this.time.delayedCall(1000, () => {
      this.player.invincible = false;
      this.player.setTint(SaveManager.get('custom').tint);
    });

    if (this.player.health <= 0) {
      this.onPlayerDeath();
    }
  }

  onPlayerFall() {
    this.damagePlayer(1);
    if (this.player.health > 0) {
      this.player.setVelocity(0, 0);
      this.player.setPosition(
        Math.max(50, this.player.x - 100),
        this.cameras.main.height - 100
      );
    }
  }

  onPlayerDeath() {
    this.gameOver = true;
    this.player.setTint(0x333333);
    this.player.setVelocity(0, 0);

    this.time.delayedCall(1500, () => {
      this.scene.start('GameOver', {
        score: this.score,
        coins: this.coins,
        world: this.worldIdx,
        stage: this.stageIdx,
      });
    });
  }

  onCollect(player, coll) {
    if (coll.type === 'coin' || coll.type === 'gem') {
      this.coins += coll.value;
      this.score += coll.value;
      SaveManager.addCoins(coll.value);
    } else if (coll.type === 'health') {
      this.player.health = Math.min(this.player.health + 1, this.player.maxHealth);
    } else if (coll.type === 'powerup') {
      this.score += 500;
    }

    const fx = this.add.image(coll.x, coll.y, 'fx_hit');
    fx.setScale(0.3);
    fx.setTint(0xffff00);
    this.tweens.add({
      targets: fx,
      alpha: 0,
      scale: 0.8,
      duration: 200,
      onComplete: () => fx.destroy(),
    });

    coll.destroy();
  }

  onReachPortal() {
    if (this.levelComplete || this.gameOver) return;
    if (this.isBossStage) return;

    this.levelComplete = true;
    this.onLevelComplete();
  }

  onLevelComplete() {
    const stars = this.player.health >= 4 ? 3 : this.player.health >= 2 ? 2 : 1;
    SaveManager.setStars(this.worldIdx, this.stageIdx, stars);

    if (this.stageIdx < 2) {
      SaveManager.unlockWorld(this.worldIdx + 2);
    }

    this.time.delayedCall(500, () => {
      this.scene.start('Victory', {
        score: this.score,
        coins: this.coins,
        stars,
        world: this.worldIdx,
        stage: this.stageIdx,
      });
    });
  }
}
