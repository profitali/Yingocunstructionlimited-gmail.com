/**
 * Web Audio API sound synthesizer for tactile UI clicks, craftsman wood taps,
 * success chimes, and subtle ambient workshop atmosphere.
 */

let audioCtx: AudioContext | null = null;
let ambientGainNode: GainNode | null = null;
let ambientOscillator: OscillatorNode | null = null;
let isSoundEnabled = true;
let isAmbientPlaying = false;

// Check localStorage for saved sound preference
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("yingo_sound_enabled");
  if (saved !== null) {
    isSoundEnabled = saved === "true";
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean) {
  isSoundEnabled = enabled;
  if (typeof window !== "undefined") {
    localStorage.setItem("yingo_sound_enabled", enabled.toString());
  }
  if (!enabled && isAmbientPlaying) {
    stopAmbientSound();
  }
}

export function toggleSoundEnabled(): boolean {
  const next = !isSoundEnabled;
  setSoundEnabled(next);
  if (next) {
    playClickSound();
  }
  return next;
}

export function getSoundEnabled(): boolean {
  return isSoundEnabled;
}

/**
 * Resume AudioContext on initial user gesture to comply with browser autoplay policies
 */
export function initAudioOnUserGesture() {
  getAudioContext();
}

/**
 * Standard tactile UI click sound (crisp, subtle snap)
 */
export function playClickSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Ignore audio context autoplay restrictions
  }
}

/**
 * Carpenter's resonant wood-tap sound for furniture items
 */
export function playWoodTapSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Ignore
  }
}

/**
 * Harmonic chime for notifications, additions to cart, modal openings
 */
export function playChimeSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);

      gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.04);
      osc.stop(ctx.currentTime + idx * 0.04 + 0.25);
    });
  } catch (e) {
    // Ignore
  }
}

/**
 * Success fanfare for completed quote submissions
 */
export function playSuccessSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chord = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
    });
  } catch (e) {
    // Ignore
  }
}

/**
 * Toggle subtle ambient workshop acoustic tone
 */
export function toggleAmbientSound(): boolean {
  if (isAmbientPlaying) {
    stopAmbientSound();
    return false;
  } else {
    startAmbientSound();
    return true;
  }
}

export function startAmbientSound() {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (isAmbientPlaying) return;

    ambientOscillator = ctx.createOscillator();
    ambientGainNode = ctx.createGain();

    ambientOscillator.type = "sine";
    ambientOscillator.frequency.setValueAtTime(140, ctx.currentTime);

    ambientGainNode.gain.setValueAtTime(0.015, ctx.currentTime);

    ambientOscillator.connect(ambientGainNode);
    ambientGainNode.connect(ctx.destination);

    ambientOscillator.start();
    isAmbientPlaying = true;
  } catch (e) {
    // Ignore
  }
}

export function stopAmbientSound() {
  try {
    if (ambientOscillator) {
      ambientOscillator.stop();
      ambientOscillator.disconnect();
      ambientOscillator = null;
    }
    if (ambientGainNode) {
      ambientGainNode.disconnect();
      ambientGainNode = null;
    }
  } catch (e) {
    // Ignore
  }
  isAmbientPlaying = false;
}

export function isAmbientActive(): boolean {
  return isAmbientPlaying;
}
