"use client";

import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { PlateSpec } from "@/lib/content";
import { Plate } from "@/components/plate";

const minScale = 1;
const maxScale = 4;

export function Zoomable({
  spec,
  label,
  caption,
  className,
  plateClassName,
}: {
  spec: PlateSpec;
  label: string;
  caption?: string;
  className?: string;
  plateClassName?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const scale = useRef(1);
  const point = useRef({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const [open, setOpen] = useState(false);
  const [percent, setPercent] = useState(100);

  function paint(next = scale.current) {
    const value = Math.min(maxScale, Math.max(minScale, next));
    scale.current = value;
    if (value === 1) point.current = { x: 0, y: 0 };
    if (view.current) {
      view.current.style.transform = `translate(${point.current.x}px, ${point.current.y}px) scale(${value})`;
    }
    setPercent(Math.round(value * 100));
  }

  useEffect(() => {
    const node = stage.current;
    if (!node || !open) return;
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const next = Math.min(maxScale, Math.max(minScale, scale.current + (event.deltaY < 0 ? 0.2 : -0.2)));
      scale.current = next;
      if (next === 1) point.current = { x: 0, y: 0 };
      if (view.current) {
        view.current.style.transform = `translate(${point.current.x}px, ${point.current.y}px) scale(${next})`;
      }
      setPercent(Math.round(next * 100));
    }
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [open]);

  function openViewer() {
    scale.current = 1;
    point.current = { x: 0, y: 0 };
    paint(1);
    const node = dialog.current;
    if (node && !node.open) node.showModal();
    setOpen(true);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    drag.current = {
      x: point.current.x,
      y: point.current.y,
      px: event.clientX,
      py: event.clientY,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || scale.current <= 1) return;
    const dx = event.clientX - current.px;
    const dy = event.clientY - current.py;
    if (Math.hypot(dx, dy) > 4) current.moved = true;
    point.current = { x: current.x + dx, y: current.y + dy };
    paint();
  }

  function onPointerUp() {
    const current = drag.current;
    drag.current = null;
    if (!current || current.moved) return;
    paint(scale.current >= maxScale ? 1 : scale.current + 0.5);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      paint(scale.current + 0.5);
    }
    if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      paint(scale.current - 0.5);
    }
    if (event.key === "0") {
      event.preventDefault();
      paint(1);
    }
  }

  return (
    <>
      <button type="button" className={className} aria-label={label} onClick={openViewer}>
        <Plate spec={spec} className={plateClassName} />
      </button>
      <dialog
        ref={dialog}
        className="zoom-dialog"
        aria-label={label}
        onClose={(event) => {
          event.stopPropagation();
          setOpen(false);
        }}
      >
        <div className="flex h-full flex-col bg-paper text-ink" onKeyDown={onKeyDown}>
          <div className="flex items-center justify-end gap-2 px-4 py-3">
            <button
              type="button"
              aria-label="Zoom out"
              disabled={percent <= 100}
              onClick={() => paint(scale.current - 0.5)}
              className="grid size-11 place-items-center border-2 border-ink disabled:opacity-30"
            >
              <MagnifyingGlassMinusIcon weight="light" size={22} aria-hidden="true" />
            </button>
            <span className="min-w-14 text-center font-body text-base">{percent}%</span>
            <button
              type="button"
              aria-label="Zoom in"
              disabled={percent >= 400}
              onClick={() => paint(scale.current + 0.5)}
              className="grid size-11 place-items-center border-2 border-ink disabled:opacity-30"
            >
              <MagnifyingGlassPlusIcon weight="light" size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={() => dialog.current?.close()}
              className="grid size-11 place-items-center border-2 border-ink"
            >
              <XIcon weight="light" size={22} aria-hidden="true" />
            </button>
          </div>
          <div
            ref={stage}
            className={`flex flex-1 items-center justify-center overflow-hidden px-4 ${percent > 100 ? "cursor-grab" : "cursor-pointer"}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div ref={view} className="w-[min(100%,56rem)]">
              <Plate spec={spec} className="w-full border-2 border-ink" />
            </div>
          </div>
          {caption ? (
            <p className="px-4 py-4 text-center font-body text-lg leading-relaxed text-plum">{caption}</p>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
