// data.js
// Music Box Dream — 空靈、夢幻、柔和的音樂盒風格

export const NOTE_FREQUENCIES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,

  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99
};

// 環境音設定
// active: 是否啟用
// volume: 相對音量，建議範圍 0–1
export const AMBIENT_CONFIGS = {
  rain: {
    active: true,
    volume: 0.20
  },

  fire: {
    active: false,
    volume: 0.18
  },

  cafe: {
    active: false,
    volume: 0.12
  },

  waves: {
    active: false,
    volume: 0.20
  },

  crickets: {
    active: false,
    volume: 0.10
  },

  wind: {
    active: false,
    volume: 0.12
  }
};

// delay 是相對於該段旋律開始的毫秒數。
// notes 中的多個音符會同時播放；單一音符更有音樂盒的透明感。
export const PRESET_SCENARIOS = {
  cozy_corner: {
    name: "Cozy Corner",
    description: "雨夜窗邊，暖燈下的微小夢境",
    ambient: ["rain"],
    melody: [
      { notes: ["E5"], delay: 0 },
      { notes: ["G5"], delay: 1050 },
      { notes: ["E5"], delay: 1550 },
      { notes: ["C5", "E5"], delay: 2650 },
      { notes: ["D5"], delay: 4200 },
      { notes: ["G5"], delay: 4950 },
      { notes: ["E5"], delay: 5700 },
      { notes: ["D5", "G5"], delay: 7150 },
      { notes: ["C5"], delay: 8900 },
      { notes: ["D5"], delay: 10100 },
      { notes: ["C5"], delay: 11600 },
      { notes: ["G4"], delay: 13200 }
    ]
  },

  midnight_cabin: {
    name: "Midnight Cabin",
    description: "深夜木屋，遠方星光緩緩閃爍",
    ambient: ["fire", "wind"],
    melody: [
      { notes: ["A4"], delay: 0 },
      { notes: ["E5"], delay: 1550 },
      { notes: ["A5"], delay: 3200 },
      { notes: ["E5"], delay: 3900 },
      { notes: ["C5"], delay: 5550 },
      { notes: ["B4", "E5"], delay: 7350 },
      { notes: ["A4"], delay: 9500 },
      { notes: ["C5"], delay: 11100 },
      { notes: ["E5"], delay: 12700 },
      { notes: ["B4"], delay: 14800 },
      { notes: ["A4", "E5"], delay: 16800 },
      { notes: ["A4"], delay: 19000 }
    ]
  },

  midnight_library: {
    name: "Midnight Library",
    description: "靜謐書頁間，微光漂浮在空氣裡",
    ambient: ["rain"],
    melody: [
      { notes: ["F4", "C5"], delay: 0 },
      { notes: ["E5"], delay: 1850 },
      { notes: ["D5"], delay: 3700 },
      { notes: ["F5"], delay: 5650 },
      { notes: ["E5", "G5"], delay: 6500 },
      { notes: ["C5"], delay: 8750 },
      { notes: ["D5"], delay: 10600 },
      { notes: ["A4"], delay: 12700 },
      { notes: ["C5", "F5"], delay: 14900 },
      { notes: ["G4"], delay: 17200 },
      { notes: ["F4"], delay: 19500 }
    ]
  },

  sunset_balcony: {
    name: "Sunset Balcony",
    description: "粉紫色暮光，星塵隨海風升起",
    ambient: ["waves", "wind"],
    melody: [
      { notes: ["F5"], delay: 0 },
      { notes: ["G5"], delay: 800 },
      { notes: ["E5"], delay: 1450 },
      { notes: ["C5", "F5"], delay: 2600 },
      { notes: ["A4"], delay: 4400 },
      { notes: ["C5"], delay: 5250 },
      { notes: ["E5"], delay: 6300 },
      { notes: ["G5"], delay: 7900 },
      { notes: ["F5", "A5"], delay: 9200 },
      { notes: ["E5"], delay: 11100 },
      { notes: ["C5"], delay: 12800 },
      { notes: ["F4"], delay: 14800 }
    ]
  },

  ocean_breeze: {
    name: "Ocean Breeze",
    description: "月光映照海面，音符如潮汐般起伏",
    ambient: ["waves"],
    melody: [
      { notes: ["G4"], delay: 0 },
      { notes: ["D5"], delay: 1350 },
      { notes: ["G5"], delay: 2850 },
      { notes: ["E5"], delay: 3750 },
      { notes: ["D5", "G5"], delay: 5550 },
      { notes: ["C5"], delay: 7900 },
      { notes: ["E5"], delay: 9000 },
      { notes: ["D5"], delay: 10900 },
      { notes: ["A4"], delay: 12800 },
      { notes: ["C5", "E5"], delay: 15000 },
      { notes: ["D5"], delay: 17200 },
      { notes: ["G4"], delay: 19600 }
    ]
  },

  silence_all: {
    name: "Silence",
    description: "純粹的寧靜，讓思緒自由漂浮",
    ambient: [],
    melody: []
  }
};
