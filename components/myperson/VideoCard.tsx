"use client";

import { useRef, useState } from "react";
import { site } from "@/lib/myperson/site";
import { ScriptCard, TranscriptToggle } from "./Transcript";

function aspectWidth(aspectRatio: string, maxHeight: string): string {
  const [w, h] = aspectRatio.split("/").map((part) => Number(part.trim()));
  if (!w || !h) return "100%";
  return `min(100%, calc(${maxHeight} * ${w} / ${h}))`;
}

export function VideoCard() {
  const { video } = site;
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  if (!video.src) {
    return (
      <div className="shell mt-7">
        <ScriptCard />
      </div>
    );
  }

  return (
    <figure className="shell mt-7">
      <div
        className="relative mx-auto overflow-hidden rounded-mp-card bg-mp-felt-2 shadow-mp-card ring-1 ring-mp-felt-line"
        style={{ aspectRatio: video.aspectRatio, width: aspectWidth(video.aspectRatio, "66svh") }}
      >
        <video
          ref={ref}
          className="h-full w-full object-cover"
          poster={video.poster || undefined}
          preload="metadata"
          playsInline
          controls={started}
          onPlay={() => setStarted(true)}
        >
          <source src={video.src} type="video/mp4" />
          {video.captions ? (
            <track kind="captions" src={video.captions} srcLang="en" label="English" default />
          ) : null}
          Your browser can&apos;t play this video. The written version is just below.
        </video>

        {!started ? (
          <button
            type="button"
            className="absolute inset-0 grid place-items-center bg-mp-felt/35 backdrop-blur-[1px] transition-colors mp-hover:bg-mp-felt/25"
            onClick={() => {
              void ref.current?.play();
              setStarted(true);
            }}
          >
            <span className="grid h-[72px] w-[72px] place-items-center rounded-full bg-mp-ember shadow-[0_10px_30px_rgba(0,0,0,.45)] transition-transform mp-hover:scale-105">
              <span className="ml-1 block h-0 w-0 border-y-[13px] border-l-[21px] border-y-transparent border-l-[#221008]" />
            </span>
            <span className="sr-only">Play Stefan&apos;s video</span>
            <span className="absolute bottom-4 rounded-mp-pill bg-mp-felt/80 px-3 py-1 text-sm font-semibold text-mp-mist">
              Watch · {video.durationLabel}
            </span>
          </button>
        ) : null}
      </div>
      <TranscriptToggle />
    </figure>
  );
}
