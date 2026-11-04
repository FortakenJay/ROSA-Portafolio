"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";

export function VideoStill({
  src,
  poster,
  width,
  height,
  alt,
  className,
  controls = true,
}: {
  src: string;
  poster: string | null;
  width: number;
  height: number;
  alt: string;
  className?: string;
  controls?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  function showFrame(node: HTMLVideoElement) {
    if (node.dataset.framed === "1" || !Number.isFinite(node.duration) || node.duration <= 0) return;
    const mark = Math.min(0.1, node.duration / 2);
    node.dataset.framed = "1";
    if (node.currentTime < mark) node.currentTime = mark;
  }

  function toggle() {
    const node = video.current;
    if (!node) return;
    if (!node.getAttribute("src")) {
      node.src = src;
      setStarted(true);
    }
    if (node.paused) {
      const play = node.play();
      if (play) void play.then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }
    node.pause();
    setPlaying(false);
  }

  const showingFile = started || !poster;

  return (
    <span className={`relative block ${className ?? ""}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <video
        ref={video}
        src={showingFile ? src : undefined}
        poster={poster ?? undefined}
        playsInline
        preload={showingFile ? "metadata" : "none"}
        aria-label={alt}
        className={showingFile ? "h-full w-full bg-paper object-contain" : "absolute h-px w-px overflow-hidden"}
        onLoadedMetadata={(event) => {
          if (!started) showFrame(event.currentTarget);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!started && poster ? <img src={poster} alt={alt} className="h-full w-full object-contain" /> : null}
      {controls ? (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Pause" : "Play"}
          className="absolute top-1/2 left-1/2 z-10 grid size-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-ink bg-lace text-ink hover:bg-rose hover:text-lace"
        >
          {playing ? <PauseIcon weight="light" size={28} aria-hidden="true" /> : <PlayIcon weight="light" size={28} aria-hidden="true" />}
        </button>
      ) : null}
    </span>
  );
}
