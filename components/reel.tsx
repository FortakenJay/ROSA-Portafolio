"use client";

import { ArrowsInIcon, ArrowsOutIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Picture } from "@/lib/content";
import { Plate } from "@/components/plate";

export function Reel({ frames }: { frames: Picture[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const idle = useRef<number | null>(null);
  const held = useRef(false);
  const fromPointer = useRef(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [full, setFull] = useState(false);
  const [open, setOpen] = useState(false);
  const [lit, setLit] = useState(true);
  const expanded = full || open;
  const frame = frames[index];

  function clearIdle() {
    if (idle.current === null) return;
    window.clearTimeout(idle.current);
    idle.current = null;
  }

  function fadeLater() {
    clearIdle();
    if (held.current) return;
    idle.current = window.setTimeout(() => setLit(false), 1600);
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

  function plateOf(node: HTMLElement) {
    const plate = node.closest("[data-flow='plate']");
    return plate instanceof HTMLElement ? plate : null;
  }

  function restorePlate(node: HTMLElement) {
    const plate = plateOf(node);
    if (!plate) return;
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
    const plate = plateOf(node);
    if (plate) plate.style.transform = "none";
    try {
      await node.requestFullscreen();
    } catch {
      restorePlate(node);
      setOpen(true);
      showControls();
    }
  }

  useEffect(() => {
    fadeLater();
    return clearIdle;
  }, []);

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

  const stageView = (
    <div ref={stage} className={`reel-stage relative border-2 border-ink p-1.5 ${open ? "is-open" : ""}`}>
      <div className="reel-frame relative border-2 border-ink" onPointerMove={showControls}>
        <Plate spec={frame} className="aspect-video w-full" />
        <button
          type="button"
          onClick={onPlay}
          onPointerDown={notePointer}
          onFocus={holdControls}
          onBlur={releaseControls}
          aria-pressed={playing}
          aria-label={playing ? "Pause reel" : "Play reel"}
          className={`absolute top-1/2 left-1/2 z-10 grid size-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-ink bg-lace text-ink transition-opacity duration-500 hover:bg-rose hover:text-lace motion-reduce:transition-none ${lit ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {playing ? (
            <PauseIcon weight="light" size={28} aria-hidden="true" />
          ) : (
            <PlayIcon weight="light" size={28} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={toggleFull}
          onPointerDown={notePointer}
          aria-label={expanded ? "Exit full screen" : "Full screen"}
          onFocus={holdControls}
          onBlur={releaseControls}
          className={`absolute right-3 bottom-3 z-10 grid size-11 cursor-pointer place-items-center border-2 border-ink bg-lace text-ink transition-opacity duration-500 hover:bg-ink hover:text-lace motion-reduce:transition-none ${lit ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {expanded ? (
            <ArrowsInIcon weight="light" size={22} aria-hidden="true" />
          ) : (
            <ArrowsOutIcon weight="light" size={22} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <figure>
      {open ? createPortal(stageView, document.body) : stageView}
      <figcaption className="mt-3 font-body text-lg leading-relaxed text-plum">{frame.caption}</figcaption>
    </figure>
  );
}
