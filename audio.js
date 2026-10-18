// audio.js
// Music Box Dream — 柔和音樂盒、晶瑩泛音、夢幻殘響

import { NOTE_FREQUENCIES } from "./data.js";

let audioCtx = null;
let isAudioInitialized = false;

let reverbNode = null;
let reverbReturnGain = null;
let masterGain = null;
let compressor = null;

let recentNoteCount = 0;
let noteResetTimer = null;

// --------------------------------------------------
// AudioContext
// --------------------------------------------------

export function initAudio() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    console.warn("This browser does not support Web Audio API.");
    return null;
  }

  if (!audioCtx) {
    audioCtx = new AudioContextClass();

    // 主輸出音量
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.75;

    // 避免多音符同時播放時容易出現過大的峰值
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.008;
    compressor.release.value = 0.25;

    masterGain.connect(compressor);
    compressor.connect(audioCtx.destination);

    initReverb();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch((error) => {
      console.warn("Unable to resume AudioContext:", error);
    });
  }

  if (!isAudioInitialized) {
    isAudioInitialized = true;

    const statusEl = document.getElementById("visualizerStatus");

    if (statusEl) {
      statusEl.style.opacity = "0";
    }
  }

  return audioCtx;
}

export function getAudioContext() {
  return audioCtx;
}

// --------------------------------------------------
// Shared Reverb
// --------------------------------------------------

function initReverb() {
  if (!audioCtx || reverbNode) return;

  const sampleRate = audioCtx.sampleRate;
  const duration = 3.5;
  const decay = 2.2;
  const length = Math.floor(sampleRate * duration);

  const impulse = audioCtx.createBuffer(
    2,
    length,
    sampleRate
  );

  // 產生逐漸衰減的立體聲 impulse response
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);

    for (let i = 0; i < length; i++) {
      const progress = i / length;

      // 使用不同的隨機序列，增加左右聲道的差異
      data[i] =
        (Math.random() * 2 - 1) *
        Math.pow(1 - progress, decay);
    }
  }

  reverbNode = audioCtx.createConvolver();
  reverbNode.buffer = impulse;
  reverbNode.normalize = true;

  reverbReturnGain = audioCtx.createGain();
  reverbReturnGain.gain.value = 0.20;

  reverbNode.connect(reverbReturnGain);
  reverbReturnGain.connect(masterGain);
}

// 可選：讓其他 UI 控制整體殘響比例
export function setReverbAmount(amount) {
  if (!audioCtx || !reverbReturnGain) return;

  const value = Math.max(0, Math.min(1, amount));

  reverbReturnGain.gain.setTargetAtTime(
    value,
    audioCtx.currentTime,
    0.05
  );
}

// 可選：控制整體音量，範圍 0–1
export function setMasterVolume(volume) {
  if (!audioCtx || !masterGain) return;

  const value = Math.max(0, Math.min(1, volume));

  masterGain.gain.setTargetAtTime(
    value,
    audioCtx.currentTime,
    0.03
  );
}

// --------------------------------------------------
// Music Box Synth
// --------------------------------------------------

export function playLoFiPiano(freq, onVisualizerEnergyBoost) {
  const ctx = initAudio();
  if (!ctx || !masterGain || !reverbNode) return;

  const now = ctx.currentTime;

  // 簡易的短時間多音符音量補償。
  // 這是觸發密度估計，不是精確的同時發聲數量。
  recentNoteCount++;

  if (noteResetTimer) {
    clearTimeout(noteResetTimer);
  }

  noteResetTimer = setTimeout(() => {
    recentNoteCount = 0;
    noteResetTimer = null;
  }, 40);

  const polyphonyScale =
    recentNoteCount > 1 ? 0.65 : 1.0;

  // 每個音符獨立建立聲部
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const oscHigh = ctx.createOscillator();
  const oscSaw = ctx.createOscillator();

  // Bell Attack：音符起始時短促、清脆的敲擊聲
  const bellOsc = ctx.createOscillator();
  const bellGain = ctx.createGain();

  bellOsc.type = "sine";
  bellOsc.frequency.setValueAtTime(freq * 4, now);

  bellGain.gain.setValueAtTime(0.0001, now);
  bellGain.gain.exponentialRampToValueAtTime(
    0.018 * polyphonyScale,
    now + 0.004
  );
  bellGain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.22
  );

  bellOsc.connect(bellGain);
  bellGain.connect(masterGain);
  bellGain.connect(reverbNode);

  bellOsc.start(now);
  bellOsc.stop(now + 0.25);

  // 1. 主音：純正弦波，維持圓潤底色
  const harmonicWave = ctx.createPeriodicWave(
    new Float32Array([0, 1, 0.22, 0.09, 0.035, 0.012]),
    new Float32Array([0, 0, 0, 0, 0, 0])
  );

  oscHigh.setPeriodicWave(harmonicWave);
  oscHigh.frequency.setValueAtTime(freq * 2, now);

  // 2. 少量三角波：補充音色輪廓
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(freq * 1.002, now);

  // 3. 高八度泛音：音樂盒般的晶瑩感
  oscHigh.type = "sine";
  oscHigh.frequency.setValueAtTime(freq * 2, now);

  // 4. 微量鋸齒波：只補充極少量金屬感
  oscSaw.type = "sawtooth";
  oscSaw.frequency.setValueAtTime(freq, now);

  // ------------------------------------------------
  // Filters
  // ------------------------------------------------

  const mainFilter = ctx.createBiquadFilter();
  mainFilter.type = "lowpass";
  mainFilter.frequency.setValueAtTime(2600, now);
  mainFilter.Q.setValueAtTime(0.7, now);

  const sawFilter = ctx.createBiquadFilter();
  sawFilter.type = "lowpass";
  sawFilter.frequency.setValueAtTime(900, now);
  sawFilter.Q.setValueAtTime(0.7, now);

  // ------------------------------------------------
  // Voice Gains
  // ------------------------------------------------

  const mainGain = ctx.createGain();
  const sawGain = ctx.createGain();
  const highGain = ctx.createGain();

  const mainPeak = 0.10 * polyphonyScale;
  const sawPeak = 0.008 * polyphonyScale;
  const highPeak = 0.035 * polyphonyScale;

  // Envelope (主音)
  mainGain.gain.setValueAtTime(0, now);
  mainGain.gain.linearRampToValueAtTime(mainPeak, now + 0.012);
  mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

  // Envelope (鋸齒波)
  sawGain.gain.setValueAtTime(0, now);
  sawGain.gain.linearRampToValueAtTime(sawPeak, now + 0.01);
  sawGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

  // Envelope (高音泛音)
  highGain.gain.setValueAtTime(0, now);
  highGain.gain.linearRampToValueAtTime(highPeak, now + 0.008);
  highGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

  // ------------------------------------------------
  // Connections
  // ------------------------------------------------

  osc1.connect(mainFilter);
  osc2.connect(mainFilter);
  mainFilter.connect(mainGain);

  oscSaw.connect(sawFilter);
  sawFilter.connect(sawGain);

  oscHigh.connect(highGain);

  // 乾訊號連接到主輸出
  mainGain.connect(masterGain);
  sawGain.connect(masterGain);
  sawGain.connect(reverbNode);
  highGain.connect(masterGain);

  // 傳送到殘響 (Reverb)
  mainGain.connect(reverbNode);
  highGain.connect(reverbNode);

  // ------------------------------------------------
  // Start / Stop
  // ------------------------------------------------

  osc1.start(now);
  osc2.start(now);
  oscHigh.start(now);
  oscSaw.start(now);

  const stopTime = now + 2.5;
  osc1.stop(stopTime);
  osc2.stop(stopTime);
  oscHigh.stop(stopTime);
  oscSaw.stop(stopTime);

  if (typeof onVisualizerEnergyBoost === "function") {
    onVisualizerEnergyBoost();
  }
}

export function playNoteWithAnimation(note, onVisualizerEnergyBoost) {
  if (NOTE_FREQUENCIES[note]) {
    playLoFiPiano(NOTE_FREQUENCIES[note], onVisualizerEnergyBoost);
  }

  const pad = document.querySelector(`.pad[data-note="${note}"]`);
  if (pad) {
    pad.classList.add("active");
    setTimeout(() => pad.classList.remove("active"), 250);
  }
}