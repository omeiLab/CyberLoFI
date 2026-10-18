// visualizer.js - Canvas 視覺化波紋動畫
import { AMBIENT_CONFIGS } from './data.js';

let canvas, ctx;
let visualizerEnergy = 0;

export function initVisualizer() {
  canvas = document.getElementById('visualizerCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let phase = 0;

  function render() {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    let activeAmbientCount = 0;
    Object.keys(AMBIENT_CONFIGS).forEach(key => {
      const toggle = document.getElementById(AMBIENT_CONFIGS[key].toggleId);
      if (toggle && toggle.checked) activeAmbientCount++;
    });

    const baseEnergy = activeAmbientCount * 0.2 + 0.1;
    visualizerEnergy = Math.max(0, visualizerEnergy - 0.02);

    const totalEnergy = baseEnergy + visualizerEnergy;
    phase += 0.03 + totalEnergy * 0.02;

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      const opacity = (0.6 - i * 0.15);
      ctx.strokeStyle = i % 2 === 0 ? `rgba(230, 157, 69, ${opacity})` : `rgba(200, 125, 85, ${opacity})`;

      for (let x = 0; x < width; x += 5) {
        const y = centerY + Math.sin(x * 0.01 + phase + i) * (15 * totalEnergy) + Math.cos(x * 0.02 - phase) * (8 * totalEnergy);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }

  render();
}

export function boostVisualizerEnergy() {
  visualizerEnergy = Math.min(visualizerEnergy + 0.8, 2.5);
}