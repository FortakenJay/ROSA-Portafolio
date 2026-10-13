"use client";

import { ArrowsInIcon, ArrowsOutIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { Picture } from "@/lib/content";
import { Plate } from "@/components/plate";

export function Reel({ frames }: { frames: Picture[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [full, setFull] = useState(false);
  const frame = frames[index];

  useEffect(() => {
    function onChange() {
      setFull(document.fullscreenElement === stage.current);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  async function toggleFull() {
    const node = stage.current;
    if (!node) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      await node.requestFullscreen();
    } catch {
      return;
    }
  }

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

  return (
    <figure>
      <div ref={stage} className="reel-stage relative border-2 border-ink p-1.5">
        <div className="reel-frame relative border-2 border-ink">
          <Plate spec={frame} className="aspect-video w-full" />
          <button
            type="button"
            onClick={onPlay}
            aria-pressed={playing}
            aria-label={playing ? "Pause reel" : "Play reel"}
            className="absolute top-1/2 left-1/2 z-10 grid size-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-2 border-ink bg-lace text-ink hover:bg-rose hover:text-lace"
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
            aria-label={full ? "Exit full screen" : "Full screen"}
            className="absolute right-3 bottom-3 z-10 grid size-11 cursor-pointer place-items-center border-2 border-ink bg-lace text-ink hover:bg-ink hover:text-lace"
          >
            {full ? (
              <ArrowsInIcon weight="light" size={22} aria-hidden="true" />
            ) : (
              <ArrowsOutIcon weight="light" size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <figcaption className="mt-3 font-body text-lg leading-relaxed text-plum">{frame.caption}</figcaption>
    </figure>
  );
}
