import React from 'react';
import { useAudio } from './AudioProvider';
import { Volume2 } from 'lucide-react';

export default function AudioPrompt(){
  const { needsInteract, muted, play, toggleMute } = useAudio();

  if (!needsInteract) return null;

  return (
  <div className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <button
        onClick={async ()=>{ if (muted) toggleMute(); await play(); }}
    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-md border dark:border-white/10 border-lightaccent/40 dark:bg-black/50 bg-white/70 dark:text-white text-lighttext hover:scale-105 transition"
    aria-label="Aktifkan suara"
      >
        <Volume2 className="w-4 h-4" />
    Klik untuk mengaktifkan musik
      </button>
    </div>
  );
}
