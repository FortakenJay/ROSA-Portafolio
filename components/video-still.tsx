"use client";

import { ArrowsInIcon, ArrowsOutIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type RefObject } from "react";

const chrome =
  "player-control absolute z-10 grid place-items-center transition-opacity duration-500 motion-reduce:transition-none";

function usePlayerChrome(enabled: boolean) {
  const frame = useRef<HTMLDivElement>(null);
  const idle = useRef<number | null>(null);
  const [lit, setLit] = useState(true);
  const [full, setFull] = useState(false);

  function clearIdle() {
    if (idle.current === null) return;
    window.clearTimeout(idle.current);
    idle.current = null;
  }

  function fadeLater() {
    clearIdle();
    idle.current = window.setTimeout(() => setLit(false), 1600);
  }

  function showControls() {
    setLit(true);
    fadeLater();
  }

  useEffect(() => {
    if (!enabled) return;
    fadeLater();
    return clearIdle;
  }, [enabled]);

  useEffect(() => {
    function onChange() {
      const node = frame.current;
      const active = document.fullscreenElement === node;
      setFull(active);
      if (active || !node) return;
      const plate = node.closest("[data-flow='plate']");
      if (!(plate instanceof HTMLElement)) return;
      plate.style.transform = "";
      ScrollTrigger.refresh();
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  async function toggleFull() {
    const node = frame.current;
    if (!node) return;
    if (document.fullscreenElement === node) {
      try {
        await document.exitFullscreen();
      } catch {
        setFull(false);
      }
      return;
    }
    const plate = node.closest("[data-flow='plate']");
    if (plate instanceof HTMLElement) plate.style.transform = "none";
    try {
      await node.requestFullscreen();
    } catch {
      if (plate instanceof HTMLElement) plate.style.transform = "";
    }
  }

  return { frame, lit, full, showControls, toggleFull };
}

function markFirstFrame(node: HTMLVideoElement) {
  if (node.dataset.framed === "1" || !Number.isFinite(node.duration) || node.duration <= 0) return;
  const mark = Math.min(0.1, node.duration / 2);
  node.dataset.framed = "1";
  if (node.currentTime < mark) node.currentTime = mark;
}

function playOrPause(node: HTMLVideoElement | null, src: string, onStart: () => void, onPlaying: (playing: boolean) => void) {
  if (!node) return;
  if (!node.getAttribute("src")) {
    node.src = src;
    onStart();
  }
  if (!node.paused) {
    node.pause();
    onPlaying(false);
    return;
  }
  const play = node.play();
  if (play) void play.then(() => onPlaying(true)).catch(() => onPlaying(false));
}

function StillMedia({
  video,
  src,
  poster,
  alt,
  started,
  onPlaying,
}: {
  video: RefObject<HTMLVideoElement | null>;
  src: string;
  poster: string | null;
  alt: string;
  started: boolean;
  onPlaying: (playing: boolean) => void;
}) {
  const showingFile = started || !poster;
  return (
    <>
      <video
        ref={video}
        src={showingFile ? src : undefined}
        poster={poster ?? undefined}
        playsInline
        preload={showingFile ? "metadata" : "none"}
        aria-label={alt}
        className={showingFile ? "h-full w-full bg-paper object-contain" : "absolute h-px w-px overflow-hidden"}
        onLoadedMetadata={(event) => {
          if (!started) markFirstFrame(event.currentTarget);
        }}
        onPlay={() => onPlaying(true)}
        onPause={() => onPlaying(false)}
        onEnded={() => onPlaying(false)}
      />
      {started || !poster ? null : <img src={poster} alt="" className="h-full w-full object-contain" />}
    </>
  );
}

function PlayerButtons({
  controls,
  fullscreen,
  lit,
  full,
  playing,
  hidden,
  showControls,
  toggle,
  toggleFull,
}: {
  controls: boolean;
  fullscreen: boolean;
  lit: boolean;
  full: boolean;
  playing: boolean;
  hidden: string;
  showControls: () => void;
  toggle: () => void;
  toggleFull: () => Promise<void>;
}) {
  if (!controls) return null;
  return (
    <>
      <button
        type="button"
        onClick={toggle}
        onFocus={showControls}
        aria-pressed={playing}
        aria-label={playing ? "Pause" : "Play"}
        className="absolute inset-0 z-10"
        style={{ cursor: lit ? "pointer" : "none" }}
      />
      <span aria-hidden="true" className={`${chrome} pointer-events-none player-play top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full ${hidden}`}>
        {playing ? <PauseIcon weight="light" size={28} /> : <PlayIcon weight="light" size={28} />}
      </span>
      {fullscreen ? (
        <button
          type="button"
          onClick={() => {
            showControls();
            void toggleFull();
          }}
          onFocus={showControls}
          aria-label={full ? "Exit full screen" : "Full screen"}
          className={`${chrome} right-3 bottom-3 z-20 size-11 ${hidden}`}
        >
          {full ? <ArrowsInIcon weight="light" size={22} aria-hidden="true" /> : <ArrowsOutIcon weight="light" size={22} aria-hidden="true" />}
        </button>
      ) : null}
    </>
  );
}

function PlayerStage({
  frame,
  video,
  src,
  poster,
  alt,
  className,
  width,
  height,
  controls,
  fullscreen,
  lit,
  full,
  started,
  playing,
  hidden,
  showControls,
  toggle,
  toggleFull,
  onPlaying,
}: {
  frame: RefObject<HTMLDivElement | null>;
  video: RefObject<HTMLVideoElement | null>;
  src: string;
  poster: string | null;
  alt: string;
  className?: string;
  width: number;
  height: number;
  controls: boolean;
  fullscreen: boolean;
  lit: boolean;
  full: boolean;
  started: boolean;
  playing: boolean;
  hidden: string;
  showControls: () => void;
  toggle: () => void;
  toggleFull: () => Promise<void>;
  onPlaying: (playing: boolean) => void;
}) {
  return (
    <div
      ref={frame}
      className={`relative block ${full ? "grid h-full w-full place-items-center bg-ink" : ""} ${className ?? ""}`}
      style={{
        ...(full ? {} : { aspectRatio: `${width} / ${height}` }),
        cursor: controls && !lit ? "none" : undefined,
      }}
      onPointerMove={controls ? showControls : undefined}
    >
      <StillMedia video={video} src={src} poster={poster} alt={alt} started={started} onPlaying={onPlaying} />
      <PlayerButtons
        controls={controls}
        fullscreen={fullscreen}
        lit={lit}
        full={full}
        playing={playing}
        hidden={hidden}
        showControls={showControls}
        toggle={toggle}
        toggleFull={toggleFull}
      />
    </div>
  );
}

export function VideoStill({
  src,
  poster,
  width,
  height,
  alt,
  className,
  controls = true,
  fullscreen = true,
}: {
  src: string;
  poster: string | null;
  width: number;
  height: number;
  alt: string;
  className?: string;
  controls?: boolean;
  fullscreen?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const { frame, lit, full, showControls, toggleFull } = usePlayerChrome(controls);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <PlayerStage
      frame={frame}
      video={video}
      src={src}
      poster={poster}
      alt={alt}
      className={className}
      width={width}
      height={height}
      controls={controls}
      fullscreen={fullscreen}
      lit={lit}
      full={full}
      started={started}
      playing={playing}
      hidden={lit ? "opacity-100" : "pointer-events-none opacity-0"}
      showControls={showControls}
      toggle={() => {
        showControls();
        playOrPause(video.current, src, () => setStarted(true), setPlaying);
      }}
      toggleFull={toggleFull}
      onPlaying={setPlaying}
    />
  );
}
