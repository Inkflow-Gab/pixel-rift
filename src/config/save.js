// SaveManager - handles all localStorage persistence
const SAVE_KEY = 'pixel_rift_save_v1';

const DEFAULT_SAVE = {
  character: 'cute',
  custom: {
    tint: 0xffffff,
    name: 'Riftwalker',
    trail: 0x00ffcc,
  },
  unlockedWorlds: 1,
  worldStars: {}, // { "0-0": 3, "0-1": 2, ... }
  bestScore: 0,
  totalCoins: 0,
  settings: {
    music: 0.7,
    sfx: 0.8,
    shake: true,
  },
  seenIntro: false,
};

export class SaveManager {
  static data = null;

  static load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        this.data = { ...DEFAULT_SAVE, ...JSON.parse(raw) };
        this.data.custom = { ...DEFAULT_SAVE.custom, ...(this.data.custom || {}) };
        this.data.settings = { ...DEFAULT_SAVE.settings, ...(this.data.settings || {}) };
        return;
      }
    } catch (e) { /* corrupted save */ }
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.save();
  }

  static save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) {}
  }

  static get(key) { return this.data[key]; }
  static set(key, val) { this.data[key] = val; this.save(); }

  static unlockWorld(n) {
    if (n > this.data.unlockedWorlds) {
      this.data.unlockedWorlds = n;
      this.save();
    }
  }

  static setStars(worldIdx, stageIdx, stars) {
    const key = `${worldIdx}-${stageIdx}`;
    const prev = this.data.worldStars[key] || 0;
    if (stars > prev) {
      this.data.worldStars[key] = stars;
      this.save();
    }
  }

  static getStars(worldIdx, stageIdx) {
    return this.data.worldStars[`${worldIdx}-${stageIdx}`] || 0;
  }

  static addScore(score) {
    if (score > this.data.bestScore) {
      this.data.bestScore = score;
      this.save();
    }
  }

  static addCoins(n) {
    this.data.totalCoins += n;
    this.save();
  }

  static reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE));
    this.save();
  }
}
