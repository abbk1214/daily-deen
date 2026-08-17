"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { RECITERS, type Reciter } from "@/lib/quran/types"
import { getQuranSettings, saveQuranSettings } from "@/lib/db"

type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5

interface UseQuranAudioOptions {
  /** Called when playback reaches the end of an ayah */
  onAyahEnd?: (ayahNumber: number) => void
  /** Called when an error occurs */
  onError?: (error: Error) => void
}

interface UseQuranAudioReturn {
  /** Currently playing ayah global number, or null */
  playingAyah: number | null
  /** Is audio currently playing */
  isPlaying: boolean
  /** Current playback speed */
  playbackSpeed: PlaybackSpeed
  /** Selected reciter */
  reciter: Reciter
  /** Play a specific ayah by its global number */
  playAyah: (globalAyahNumber: number) => Promise<void>
  /** Stop playback */
  stop: () => void
  /** Toggle play/pause for an ayah */
  toggleAyah: (globalAyahNumber: number) => Promise<void>
  /** Set playback speed */
  setSpeed: (speed: PlaybackSpeed) => void
  /** Change reciter */
  setReciter: (reciterId: string) => void
  /** Is audio loading/buffering */
  loading: boolean
}

export function useQuranAudio(options?: UseQuranAudioOptions): UseQuranAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playingAyah, setPlayingAyah] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1)
  const [reciterId, setReciterId] = useState<string>(RECITERS[0].id)
  const onAyahEndRef = useRef(options?.onAyahEnd)
  const onErrorRef = useRef(options?.onError)
  const currentAyahRef = useRef<number | null>(null)

  // Keep refs in sync
  useEffect(() => {
    onAyahEndRef.current = options?.onAyahEnd
  }, [options?.onAyahEnd])

  useEffect(() => {
    onErrorRef.current = options?.onError
  }, [options?.onError])

  // Load saved settings
  useEffect(() => {
    let cancelled = false
    getQuranSettings().then((settings) => {
      if (!cancelled && settings?.selectedReciter) {
        setReciterId(settings.selectedReciter)
      }
    })
    return () => { cancelled = true }
  }, [])

  const reciter = RECITERS.find((r) => r.id === reciterId) || RECITERS[0]

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeAttribute("src")
      audioRef.current.load()
      audioRef.current = null
    }
    setPlayingAyah(null)
    setIsPlaying(false)
    setLoading(false)
    currentAyahRef.current = null
  }, [])

  const playAyah = useCallback(async (globalAyahNumber: number) => {
    // Stop any existing playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeAttribute("src")
      audioRef.current.load()
    }

    const url = `${reciter.baseUrl}/${globalAyahNumber}.mp3`
    const audio = new Audio(url)
    audio.playbackRate = playbackSpeed
    audioRef.current = audio
    currentAyahRef.current = globalAyahNumber

    setPlayingAyah(globalAyahNumber)
    setLoading(true)

    return new Promise<void>((resolve) => {
      audio.onplay = () => {
        setIsPlaying(true)
        setLoading(false)
        resolve()
      }

      audio.onended = () => {
        setIsPlaying(false)
        setPlayingAyah(null)
        audioRef.current = null
        currentAyahRef.current = null
        onAyahEndRef.current?.(globalAyahNumber)
      }

      audio.onerror = () => {
        const err = new Error(`Failed to load audio for ayah ${globalAyahNumber}`)
        console.error(err)
        setIsPlaying(false)
        setPlayingAyah(null)
        setLoading(false)
        audioRef.current = null
        currentAyahRef.current = null
        onErrorRef.current?.(err)
        resolve()
      }

      audio.play().catch((err) => {
        console.error("Audio play failed:", err)
        setIsPlaying(false)
        setPlayingAyah(null)
        setLoading(false)
        audioRef.current = null
        currentAyahRef.current = null
        onErrorRef.current?.(err)
        resolve()
      })
    })
  }, [reciter, playbackSpeed])

  const toggleAyah = useCallback(async (globalAyahNumber: number) => {
    if (currentAyahRef.current === globalAyahNumber && isPlaying) {
      // Pause current
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    } else if (currentAyahRef.current === globalAyahNumber && !isPlaying) {
      // Resume
      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    } else {
      // Play new ayah
      await playAyah(globalAyahNumber)
    }
  }, [isPlaying, playAyah])

  const setSpeed = useCallback((speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed)
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }, [])

  const setReciter = useCallback((id: string) => {
    setReciterId(id)
    saveQuranSettings({ selectedReciter: id })
    // If currently playing, restart with new reciter
    if (currentAyahRef.current !== null) {
      const currentAyah = currentAyahRef.current
      stop()
      // Small delay to ensure cleanup
      setTimeout(() => playAyah(currentAyah), 50)
    }
  }, [stop, playAyah])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeAttribute("src")
        audioRef.current.load()
        audioRef.current = null
      }
    }
  }, [])

  return {
    playingAyah,
    isPlaying,
    playbackSpeed,
    reciter,
    playAyah,
    stop,
    toggleAyah,
    setSpeed,
    setReciter,
    loading,
  }
}
