// main.js - 整合模組與 DOM 互動事件 (完全相容版)
import { initAudio, playNoteWithAnimation, getAudioContext } from './audio.js';
import { startAmbientSound, stopAmbientSound, getAmbientGain } from './ambient.js';
import { initVisualizer, boostVisualizerEnergy } from './visualizer.js';
import { AMBIENT_CONFIGS, PRESET_SCENARIOS } from './data.js';

let currentMelodyInterval = null;
let activeTimeoutIds = [];

function clearAllTimeouts() {
  activeTimeoutIds.forEach(id => clearTimeout(id));
  activeTimeoutIds = [];
}

function playMelodyLoop(melodyArray) {
  if (currentMelodyInterval) {
    clearInterval(currentMelodyInterval);
    currentMelodyInterval = null;
  }
  clearAllTimeouts();

  if (!melodyArray || melodyArray.length === 0) return;

  const lastNote = melodyArray[melodyArray.length - 1];
  const loopDuration = lastNote.delay + 2500;

  triggerMelodySequence(melodyArray);

  currentMelodyInterval = setInterval(() => {
    triggerMelodySequence(melodyArray);
  }, loopDuration);
}

function triggerMelodySequence(melodyArray) {
  melodyArray.forEach(item => {
    const timeoutId = setTimeout(() => {
      if (item.notes && Array.isArray(item.notes)) {
        item.notes.forEach(note => {
          playNoteWithAnimation(note, boostVisualizerEnergy);
        });
      } else if (item.note) {
        playNoteWithAnimation(item.note, boostVisualizerEnergy);
      }
    }, item.delay);
    
    activeTimeoutIds.push(timeoutId);
  });
}

function savePreferences() {
  const prefs = {};
  Object.keys(AMBIENT_CONFIGS).forEach(key => {
    const toggle = document.getElementById(`toggle-${key}`);
    const vol = document.getElementById(`vol-${key}`);
    prefs[key] = {
      active: toggle ? toggle.checked : false,
      volume: vol ? vol.value : 0.2
    };
  });
  localStorage.setItem('lofi_chill_station_prefs', JSON.stringify(prefs));
}

function loadPreferences() {
  const saved = localStorage.getItem('lofi_chill_station_prefs');
  if (!saved) return;

  try {
    const prefs = JSON.parse(saved);
    Object.keys(prefs).forEach(key => {
      if (prefs[key]) {
        const toggle = document.getElementById(`toggle-${key}`);
        const vol = document.getElementById(`vol-${key}`);

        if (vol && prefs[key].volume !== undefined) {
          vol.value = prefs[key].volume;
        }

        if (toggle && prefs[key].active) {
          toggle.checked = true;
          const startOnInteraction = () => {
            if (toggle.checked) {
              startAmbientSound(key);
            }
            window.removeEventListener('click', startOnInteraction);
            window.removeEventListener('keydown', startOnInteraction);
          };
          window.addEventListener('click', startOnInteraction);
          window.addEventListener('keydown', startOnInteraction);
        }
      }
    });
  } catch (e) {
    console.error('Failed to load user preferences', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initVisualizer();
  loadPreferences();

  ['click', 'keydown', 'touchstart'].forEach(eventType => {
    window.addEventListener(eventType, () => {
      initAudio();
    }, { once: true });
  });

  // 綁定白噪音開關與滑桿事件
  Object.keys(AMBIENT_CONFIGS).forEach(key => {
    const toggle = document.getElementById(`toggle-${key}`);
    const volumeSlider = document.getElementById(`vol-${key}`);

    if (toggle) {
      toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          startAmbientSound(key);
        } else {
          stopAmbientSound(key);
        }
        savePreferences();
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const volValue = parseFloat(e.target.value);
        const gain = getAmbientGain(key);
        const audioCtx = getAudioContext();
        if (gain && audioCtx) {
          gain.gain.setValueAtTime(volValue, audioCtx.currentTime);
        }
        savePreferences();
      });
    }
  });

  // 綁定精選情境按鈕事件
  const presetButtons = document.querySelectorAll('.preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const audioCtx = initAudio();
      const presetKey = btn.getAttribute('data-preset');
      const scenario = PRESET_SCENARIOS[presetKey];
      if (!scenario) return;

      // 1. 移除所有情境按鈕的 active 高亮，並將當前點擊的按鈕加上 active
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 2. 根據情境設定更新所有白噪音開關與滑桿
      Object.keys(AMBIENT_CONFIGS).forEach(soundKey => {
        const toggle = document.getElementById(`toggle-${soundKey}`);
        const volSlider = document.getElementById(`vol-${soundKey}`);
        const isActive = scenario.ambient && scenario.ambient.includes(soundKey);

        if (toggle) {
          toggle.checked = isActive;
        }

        if (isActive) {
          startAmbientSound(soundKey);
        } else {
          stopAmbientSound(soundKey);
        }
      });

      // 3. 播放情境循環旋律
      playMelodyLoop(scenario.melody);
      savePreferences();
    });
  });

  // 綁定鍵盤琴鍵按鈕
  const pads = document.querySelectorAll('.pad');
  pads.forEach(pad => {
    const triggerPad = () => {
      const note = pad.getAttribute('data-note');
      playNoteWithAnimation(note, boostVisualizerEnergy);
    };

    pad.addEventListener('mousedown', triggerPad);
    pad.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerPad();
    });
  });

  // 綁定電腦鍵盤按鍵
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const code = e.code;
    const pad = document.querySelector(`.pad[data-key="${code}"]`);
    if (pad) {
      const note = pad.getAttribute('data-note');
      playNoteWithAnimation(note, boostVisualizerEnergy);
    }
  });

  window.addEventListener('keyup', (e) => {
    const code = e.code;
    const pad = document.querySelector(`.pad[data-key="${code}"]`);
    if (pad) {
      pad.classList.remove('active');
    }
  });
});