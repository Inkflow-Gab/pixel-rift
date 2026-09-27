import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { CharacterScene } from './scenes/CharacterScene.js';
import { WorldMapScene } from './scenes/WorldMapScene.js';
import { LevelScene } from './scenes/LevelScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';
import { SaveManager } from './config/save.js';

// Load save data immediately
SaveManager.load();

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 480,
  height: 270,
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  backgroundColor: '#0a0a12',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 480,
    height: 270,
  },
  scene: [
    BootScene,
    MenuScene,
    CharacterScene,
    WorldMapScene,
    LevelScene,
    PauseScene,
    GameOverScene,
    VictoryScene,
    SettingsScene,
  ],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
