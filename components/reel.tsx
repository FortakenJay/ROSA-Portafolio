"use client";

import { ArrowsInIcon, ArrowsOutIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ArtworkImage } from "@/components/artwork-image";
import { Plate } from "@/components/plate";
import type { Shot } from "@/lib/shots";

function useReelChrome(playing: boolean) {
  const stage = useRef<HTMLDivElement>(null);
  const idle = useRef<number | null>(null);
  const held = useRef(false);
  const fromPointer = useRef(false);
  const playingRef = useRef(playing);
  const [full, setFull] = useState(false);
  const [open, setOpen] = useState(false);
  const [lit, setLit] = useState(true);
  playingRef.current = playing;

  function clearIdle() {
    if (idle.current === null) return;
    window.clearTimeout(idle.current);
    idle.current = null;
  }

  function fadeLater() {
    clearIdle();
    if (held.current || !playingRef.current) return;
    idle.current = window.setTimeout(() => {
      idle.current = null;
      if (!playingRef.current) return;
      setLit(false);
    }, 1600);
  }

  function showControls() {
    setLit(true);
    fadeLater();
  }

  function holdControls() {
    if (fromPointer.current) {
      fromPointer.current = false;
      fadeLater();
      return;
    }
    held.current = true;
    setLit(true);
    clearIdle();
  }

  function notePointer() {
    fromPointer.current = true;
  }

  function releaseControls() {
    held.current = false;
    fadeLater();
  }

  function restorePlate(node: HTMLElement) {
    const plate = node.closest("[data-flow='plate']");
    if (!(plate instanceof HTMLElement)) return;
    plate.style.transform = "";
    ScrollTrigger.refresh();
  }

  useEffect(() => {
    function onChange() {
      const node = stage.current;
      const active = document.fullscreenElement === node;
      setFull(active);
      if (!active && node) restorePlate(node);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      const node = stage.current;
      if (node) restorePlate(node);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!playing) {
      setLit(true);
      clearIdle();
      return;
    }
    fadeLater();
    return clearIdle;
  }, [playing]);

  async function toggleFull() {
    const node = stage.current;
    if (!node) return;
    if (document.fullscreenElement || open) {
      setOpen(false);
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          restorePlate(node);
        }
      } else {
        restorePlate(node);
      }
      return;
    }
    const plate = node.closest("[data-flow='plate']");
    if (plate instanceof HTMLElement) plate.style.transform = "none";
    try {
      await node.requestFullscreen();
    } catch {
      restorePlate(node);
      setOpen(true);
      showControls();
    }
  }

  return { stage, full, open, lit, showControls, holdControls, notePointer, releaseControls, toggleFull };
}

export function Reel({ frames, priority = false }: { frames: Shot[]; priority?: boolean }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const chrome = useReelChrome(playing);
  const expanded = chrome.full || chrome.open;
  const frame = frames[index];

  useEffect(() => {
    if (!playing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % frames.length);
    }, 1600);
    return () => window.clearInterval(timer);
  }, [playing, frames.length]);

  function onPlay() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIndex((current) => (current + 1) % frames.length);
      return;
    }
    setPlaying((current) => !current);
  }

  if (!frame) return null;
  const stageView = (
    <ReelStage
      stage={chrome.stage}
      open={chrome.open}
      lit={chrome.lit}
      expanded={expanded}
      frame={frame}
      priority={priority && index === 0}
      playing={playing}
      onPlay={onPlay}
      onPointer={chrome.notePointer}
      onFocus={chrome.holdControls}
      onBlur={chrome.releaseControls}
      onMove={chrome.showControls}
      onFull={chrome.toggleFull}
    />
  );

  return (
    <figure>
      {stageView}
      <figcaption className="mt-3 font-body text-lg leading-relaxed text-plum">{frame.caption}</figcaption>
    </figure>
  );
}

function ReelStage({
  stage,
  open,
  lit,
  expanded,
  frame,
  priority,
  playing,
  onPlay,
  onPointer,
  onFocus,
  onBlur,
  onMove,
  onFull,
}: {
  stage: RefObject<HTMLDivElement | null>;
  open: boolean;
  lit: boolean;
  expanded: boolean;
  frame: Shot;
  priority: boolean;
  playing: boolean;
  onPlay: () => void;
  onPointer: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onMove: () => void;
  onFull: () => void;
}) {
  const video = frame.kind === "image" && Boolean(frame.image.variants.video);
  return (
    <div ref={stage} className={`reel-stage relative border-2 border-ink p-1.5 ${open ? "is-open" : ""}`} style={playing && !lit ? { cursor: "none" } : undefined}>
      <div className="reel-frame relative border-2 border-ink" onPointerMove={onMove}>
        {frame.kind === "image" ? (
          <ArtworkImage image={frame.image} sizes="(min-width: 56rem) 56rem, 100vw" priority={priority} controls={video} fullscreen={false} className="w-full" />
        ) : (
          <Plate spec={frame.spec} className="aspect-video w-full" />
        )}
        {video ? null : (
          <button
            type="button"
            onClick={onPlay}
            onPointerDown={onPointer}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-pressed={playing}
            aria-label={playing ? "Pause reel" : "Play reel"}
            className={`player-control player-play absolute top-1/2 left-1/2 z-10 grid size-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full transition-opacity duration-500 motion-reduce:transition-none ${lit ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {playing ? <PauseIcon weight="light" size={28} aria-hidden="true" /> : <PlayIcon weight="light" size={28} aria-hidden="true" />}
          </button>
        )}
        <button
          type="button"
          onClick={onFull}
          onPointerDown={onPointer}
          aria-label={expanded ? "Exit full screen" : "Full screen"}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`player-control absolute right-3 bottom-3 z-10 grid size-11 cursor-pointer place-items-center transition-opacity duration-500 motion-reduce:transition-none ${lit ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {expanded ? <ArrowsInIcon weight="light" size={22} aria-hidden="true" /> : <ArrowsOutIcon weight="light" size={22} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
