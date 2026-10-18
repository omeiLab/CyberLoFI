// ambient.js - 管理環境白噪音與特徵音效
import { initAudio, getAudioContext } from './audio.js';
import { AMBIENT_CONFIGS } from './data.js';

const ambientNodes = {};
Object.keys(AMBIENT_CONFIGS).forEach(key => {
  ambientNodes[key] = { node: null, gain: null };
});

function createNoiseBuffer(durationSec = 5) {
  const audioCtx = getAudioContext();
  if (!audioCtx) return null;

  const bufferSize = audioCtx.sampleRate * durationSec;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.02;
    b6 = white * 0.115926;
  }
  return buffer;
}

export function startAmbientSound(type) {
  initAudio();
  const audioCtx = getAudioContext();
  if (!audioCtx) return;

  const configState = ambientNodes[type];
  const configDef = AMBIENT_CONFIGS[type];
  if (!configDef || !configState) return;

  if (configState.node) {
    stopAmbientSound(type);
  }

  // 取得對應的音量滑桿或直接採用 data.js 預設值
  const volumeSlider = document.getElementById(`vol-${type}`);
  const targetVol = volumeSlider ? parseFloat(volumeSlider.value) : (configDef.volume || 0.2);

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(targetVol, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);
  configState.gain = masterGain;

  const noiseBuffer = createNoiseBuffer(5);
  if (!noiseBuffer) return;

  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  noiseSource.connect(filter);
  filter.connect(masterGain);
  noiseSource.start();
  configState.node = noiseSource;
}

export function stopAmbientSound(type) {
  const configState = ambientNodes[type];
  if (configState) {
    if (configState.node) {
      try {
        configState.node.stop();
        configState.node.disconnect();
      } catch (e) {}
      configState.node = null;
    }
    configState.gain = null;
  }
}

export function getAmbientGain(type) {
  return ambientNodes[type] ? ambientNodes[type].gain : null;
}