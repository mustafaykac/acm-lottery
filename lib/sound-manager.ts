type SoundKind = "draw-start" | "tick" | "tension" | "winner" | "celebration";

const SOUND_FILE_MAP: Record<SoundKind, string> = {
  "draw-start": "/sounds/draw-start.mp3",
  tick: "/sounds/tick.mp3",
  tension: "/sounds/tension.mp3",
  winner: "/sounds/winner.mp3",
  celebration: "/sounds/celebration.mp3",
};

let audioContext: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType,
  peakGain: number
): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(peakGain, startTime + duration * 0.15);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function synthesize(kind: SoundKind): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  switch (kind) {
    case "draw-start": {
      playTone(ctx, 220, now, 0.5, "sawtooth", 0.05);
      playTone(ctx, 440, now + 0.05, 0.45, "sine", 0.05);
      break;
    }
    case "tick": {
      playTone(ctx, 880, now, 0.06, "square", 0.03);
      break;
    }
    case "tension": {
      playTone(ctx, 130, now, 1.2, "sawtooth", 0.04);
      playTone(ctx, 196, now + 0.1, 1.0, "triangle", 0.03);
      break;
    }
    case "winner": {
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        playTone(ctx, frequency, now + index * 0.12, 0.5, "sine", 0.06);
      });
      break;
    }
    case "celebration": {
      for (let i = 0; i < 10; i += 1) {
        const frequency = 600 + Math.floor((i * 37) % 400);
        playTone(ctx, frequency, now + i * 0.05, 0.18, "triangle", 0.035);
      }
      break;
    }
  }
}

// Her ses türü için dosyanın var olup olmadığını yalnızca bir kez (ilk çağrıda)
// yoklar; sonraki tüm çağrılar aynı sonucu bekler. Bu sayede animasyon sırasında
// hızlıca art arda tetiklenen (ör. "tick") seslerin her biri ayrı ayrı başarısız
// bir ağ isteği başlatıp konsolu 404 kayıtlarıyla doldurmaz.
const fileProbeCache = new Map<SoundKind, Promise<boolean>>();

function probeFile(kind: SoundKind): Promise<boolean> {
  const cached = fileProbeCache.get(kind);
  if (cached) return cached;

  const probe = new Promise<boolean>((resolve) => {
    const audio = new Audio(SOUND_FILE_MAP[kind]);
    audio.addEventListener("error", () => resolve(false), { once: true });
    audio.addEventListener("canplaythrough", () => resolve(true), { once: true });
    audio.load();
  });

  fileProbeCache.set(kind, probe);
  return probe;
}

function tryPlayFile(kind: SoundKind): Promise<boolean> {
  return probeFile(kind).then((isAvailable) => {
    if (isAvailable) {
      // Dosya mevcut olduğu onaylandıktan sonraki tekrar çağrılarında
      // yeni bir <audio> örneği ile tekrar oynatılır.
      const audio = new Audio(SOUND_FILE_MAP[kind]);
      audio.volume = 0.6;
      audio.play().catch(() => undefined);
    }
    return isAvailable;
  });
}

export async function playSound(kind: SoundKind): Promise<void> {
  if (!soundEnabled) return;
  try {
    const playedFromFile = await tryPlayFile(kind);
    if (!playedFromFile) {
      synthesize(kind);
    }
  } catch {
    synthesize(kind);
  }
}
