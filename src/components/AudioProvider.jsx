import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const AudioCtx = createContext(null);

export function AudioProvider({ children, src = '/music/theme.m4a', volume = 0.5 }) {
  // Enable audio with better error handling
  const DISABLE_AUDIO = false;
  
  const audioRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const [hasError, setHasError] = useState(false);
  const [muted, setMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('audio_muted');
      if (saved !== null) return saved === '1';
    } catch {}
    return true; // Default muted for safety
  });
  const [needsInteract, setNeedsInteract] = useState(() => {
    try { return localStorage.getItem('audio_ack') !== '1'; } catch { return true; }
  });

  // Check audio format support and file existence
  useEffect(() => {
    if (DISABLE_AUDIO) {
      console.log('Audio disabled');
      setReady(true);
      return;
    }

    const checkAudioSupport = async () => {
      try {
        const audio = document.createElement('audio');
        
        // Check if M4A is supported
        const canPlayM4A = audio.canPlayType('audio/mp4; codecs="mp4a.40.2"');
        if (canPlayM4A === '') {
          console.warn('M4A not supported, falling back gracefully');
          setReady(true); // Allow app to continue without audio
          setHasError(true);
          return;
        }
        
        console.log('M4A format supported, loading:', src);
        setAudioSrc(src);
      } catch (error) {
        console.error('Error checking audio support:', error);
        setReady(true); // Allow app to continue
        setHasError(true);
      }
    };

    checkAudioSupport();
  }, [src, DISABLE_AUDIO]);

  // Create audio element once per src
  useEffect(() => {
    if (!audioSrc || hasError || DISABLE_AUDIO) return;
    
    const setupAudio = () => {
      try {
        const el = document.createElement('audio');
        el.src = audioSrc;
        el.preload = 'auto';
        el.loop = true;
        el.volume = volume;
        el.muted = muted;
        
        const onCanPlay = () => {
          console.log('Audio ready:', audioSrc);
          setReady(true);
        };
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        const onError = (e) => {
          console.warn('Audio error:', e.type, e.target?.error);
          setHasError(true);
          setReady(true); // Still mark ready so app doesn't hang
        };
        
        el.addEventListener('canplaythrough', onCanPlay, { once: true });
        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onPause);
        el.addEventListener('error', onError);
        
        audioRef.current = el;
        
        return () => {
          try {
            if (el) {
              el.pause();
              el.removeEventListener('canplaythrough', onCanPlay);
              el.removeEventListener('play', onPlay);
              el.removeEventListener('pause', onPause);
              el.removeEventListener('error', onError);
              el.remove();
            }
          } catch (error) {
            console.warn('Error cleaning up audio:', error);
          }
        };
      } catch (error) {
        console.error('Error creating audio element:', error);
        setHasError(true);
        setReady(true); // Allow app to continue
      }
    };

    return setupAudio();
  }, [audioSrc, volume, muted, hasError, DISABLE_AUDIO]);

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

  // Safe functions that won't throw
  const play = async () => {
    if (DISABLE_AUDIO) {
      console.log('Audio play called (disabled for debugging)');
      return;
    }
    if (hasError) return;
    try {
      if (!audioRef.current) return;
      await audioRef.current.play();
      setPlaying(true);
      setNeedsInteract(false);
      try { localStorage.setItem('audio_ack', '1'); } catch {}
    } catch (e) {
      setNeedsInteract(true);
      const handler = async () => {
        try { 
          if (audioRef.current && !hasError) {
            await audioRef.current.play(); 
            setPlaying(true);
            setNeedsInteract(false); 
          }
        } catch {}
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

  const pause = () => { 
    try { 
      if (audioRef.current && !hasError) {
        audioRef.current.pause(); 
      }
    } catch {} 
  };
  
  const toggleMute = () => {
    try {
      setMuted(m => !m);
    } catch {}
  };
  
  const unmute = () => {
    try {
      setMuted(false);
    } catch {}
  };
  
  const setVol = (v) => { 
    try {
      if (audioRef.current && !hasError) {
        audioRef.current.volume = v; 
      }
    } catch {}
  };

  const value = useMemo(() => ({ 
    ready, 
    playing, 
    muted, 
    needsInteract, 
    play, 
    pause, 
    toggleMute, 
    unmute, 
    setVolume: setVol 
  }), [ready, playing, muted, needsInteract]);

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
    try {
      window.__audioPlayHook = value.play;
      window.__audioUnmuteHook = value.unmute;
      window.__audioNeedsInteract = () => value.needsInteract;
      return () => { 
        try { 
          delete window.__audioPlayHook; 
          delete window.__audioUnmuteHook; 
          delete window.__audioNeedsInteract;
        } catch {} 
      };
    } catch (error) {
      console.warn('Error setting up audio global bridge:', error);
    }
  }, [value.play, value.unmute, value.needsInteract]);
  return null;
}
