let audioContext: AudioContext | null = null
let currentSource: AudioBufferSourceNode | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

function createAdhanTone(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const duration = 8
  const length = sampleRate * duration
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  const frequencies = [261.63, 329.63, 392.0, 523.25]
  const noteDuration = duration / frequencies.length

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate
    const noteIndex = Math.min(Math.floor(t / noteDuration), frequencies.length - 1)
    const freq = frequencies[noteIndex]
    const noteProgress = (t % noteDuration) / noteDuration

    const envelope = Math.sin(noteProgress * Math.PI) * 0.3
    const fadeOut = noteIndex === frequencies.length - 1 ? 1 - noteProgress : 1

    data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * fadeOut
  }

  return buffer
}

export function playAdhanSound(volume: number = 0.5): void {
  try {
    stopAdhanSound()

    const ctx = getAudioContext()
    if (ctx.state === "suspended") {
      ctx.resume()
    }

    const buffer = createAdhanTone(ctx)
    const source = ctx.createBufferSource()
    source.buffer = buffer

    const gain = ctx.createGain()
    gain.gain.value = Math.max(0, Math.min(1, volume))

    source.connect(gain)
    gain.connect(ctx.destination)

    source.onended = () => {
      currentSource = null
    }

    source.start()
    currentSource = source
  } catch {
    // Audio playback can fail in some environments
  }
}

export function stopAdhanSound(): void {
  if (currentSource) {
    try {
      currentSource.stop()
    } catch {
      // Already stopped
    }
    currentSource = null
  }
}
