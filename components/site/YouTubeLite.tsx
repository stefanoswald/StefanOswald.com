"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A YouTube thumbnail that turns into the real player on click. Ten embedded players would
 * load several megabytes of YouTube script before anyone presses play, and that was a big
 * part of why the old Watch page was slow.
 */
export function YouTubeLite({ id, title, priority = false }: { id: string; title: string; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // A thumbnail can fail before React is listening, so check once after the page wakes up.
  // YouTube answers a missing thumbnail with a tiny 120x90 gray placeholder, so treat that as failed too.
  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete && image.naturalWidth <= 120) setThumbFailed(true);
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[4px] bg-so-coal-2">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full text-left"
          aria-label={`Play video: ${title}`}
        >
          {thumbFailed ? (
            // Private or unlisted videos sometimes have no public thumbnail. Show the title instead of a broken image.
            <span className="absolute inset-0 flex items-end bg-[radial-gradient(120%_90%_at_30%_10%,#2a2622_0%,#141210_70%)] p-4 font-so-display text-[1.2rem] leading-tight text-so-paper/80">
              {title}
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              ref={imageRef}
              onError={() => setThumbFailed(true)}
              onLoad={(event) => {
                if (event.currentTarget.naturalWidth <= 120) setThumbFailed(true);
              }}
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 so-hover:opacity-100"
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden="true" />
          <span
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-so-ink/80 ring-1 ring-so-paper/30 transition-transform duration-200 group-hover:scale-105"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 text-so-paper" fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
