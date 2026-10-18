"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A silent drone video. On the travel page it plays on a loop like a moving photo. People who ask their
 * device for less motion get a still frame instead, and anyone can pause it.
 */
export function DroneReel({
  src,
  poster,
  label,
  autoPlay = false
}: {
  src: string;
  poster: string;
  label: string;
  autoPlay?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!autoPlay || !video.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.current.play().catch(() => setPlaying(false));
  }, [autoPlay]);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) element.play().catch(() => setPlaying(false));
    else element.pause();
  };

  return (
    <div className="relative overflow-hidden rounded-[3px] bg-so-coal-2">
      <video
        ref={video}
        className="aspect-video h-auto w-full"
        poster={poster}
        muted
        loop
        playsInline
        preload={autoPlay ? "metadata" : "none"}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-3 right-3 inline-flex h-10 items-center gap-2 rounded-[3px] bg-so-ink/70 px-3 text-[0.85rem] font-medium text-so-paper backdrop-blur transition-colors so-hover:bg-so-ink/90"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" /> : <path d="M4 2.5v11l9-5.5z" />}
        </svg>
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
