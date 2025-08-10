import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const AudioCtx = createContext(null);

export function AudioProvider({ children, src = '/music/theme.mp3', volume = 0.5 }) {
  const audioRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('audio_muted');
      if (saved !== null) return saved === '1';
    } catch {}
    // Default: mute on mobile, unmute on desktop
    try {
      const ua = navigator.userAgent || '';
      const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
      return isMobile; // true => muted on mobile, false => unmuted on desktop
    } catch { return false; }
  });
  const [needsInteract, setNeedsInteract] = useState(() => {
    try { return localStorage.getItem('audio_ack') !== '1'; } catch { return true; }
  });

  // Create audio element once per src
  useEffect(() => {
    const el = new Audio();
    el.src = src;
    el.preload = 'auto';
    el.loop = true;
    el.volume = volume;
    el.muted = muted;
    const onCanPlay = () => setReady(true);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener('canplaythrough', onCanPlay, { once: true });
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    audioRef.current = el;
    return () => {
      el.pause();
      el.removeEventListener('canplaythrough', onCanPlay);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, [src]);

  // Volume updates without recreating element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Persist and apply mute
  useEffect(() => {
    try { localStorage.setItem('audio_muted', muted ? '1' : '0'); } catch {}
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  // Auto-resume when unmuted if previously paused and not blocked
  useEffect(() => {
    if (!muted && audioRef.current && audioRef.current.paused && !needsInteract) {
      audioRef.current.play().catch(() => {});
    }
  }, [muted, needsInteract]);

  const play = async () => {
    try {
      await audioRef.current?.play();
      setNeedsInteract(false);
      try { localStorage.setItem('audio_ack', '1'); } catch {}
    } catch (e) {
      // Autoplay blocked; require a short user gesture
      setNeedsInteract(true);
      const handler = async () => {
        try { await audioRef.current?.play(); setNeedsInteract(false); } catch {}
        try { localStorage.setItem('audio_ack', '1'); } catch {}
        document.removeEventListener('pointerdown', handler);
        document.removeEventListener('keydown', handler);
        document.removeEventListener('touchstart', handler);
      };
      document.addEventListener('pointerdown', handler, { once: true });
      document.addEventListener('keydown', handler, { once: true });
      document.addEventListener('touchstart', handler, { once: true });
    }
  };

  const pause = () => { try { audioRef.current?.pause(); } catch {} };
  const toggleMute = () => setMuted(m => !m);
  const unmute = () => setMuted(false);
  const setVol = (v) => { if (audioRef.current) audioRef.current.volume = v; };

  const value = useMemo(() => ({ ready, playing, muted, needsInteract, play, pause, toggleMute, unmute, setVolume: setVol }), [ready, playing, muted, needsInteract]);

  return (
    <AudioCtx.Provider value={value}>
      <AudioGlobalBridge value={value} />
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio(){
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within <AudioProvider>');
  return ctx;
}

function AudioGlobalBridge({ value }){
  useEffect(()=>{
  window.__audioPlayHook = value.play;
  window.__audioUnmuteHook = value.unmute;
  window.__audioNeedsInteract = () => value.needsInteract;
  return () => { try { delete window.__audioPlayHook; delete window.__audioUnmuteHook; } catch {} };
  }, [value.play]);
  return null;
}
