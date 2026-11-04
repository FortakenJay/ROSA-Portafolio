"use client";

import { useEffect } from "react";

function applyLook(next: "cutesy" | "creepy", animate = true) {
  const root = document.documentElement;
  const current = root.dataset.look === "creepy" ? "creepy" : "cutesy";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const change = () => {
    if (next === "creepy") root.dataset.look = "creepy";
    else delete root.dataset.look;
    try {
      localStorage.setItem("rosa-look", next);
    } catch {
      /* The look still changes for this view. */
    }
    document.querySelector<HTMLButtonElement>("[data-look-choice='cutesy']")?.setAttribute("aria-pressed", next === "cutesy" ? "true" : "false");
    document.querySelector<HTMLButtonElement>("[data-look-choice='creepy']")?.setAttribute("aria-pressed", next === "creepy" ? "true" : "false");
  };

  if (!animate || reduced || next === current) {
    change();
    return;
  }

  const start = document.startViewTransition?.bind(document);
  if (!start) {
    root.classList.add("look-animate");
    window.setTimeout(() => root.classList.remove("look-animate"), 700);
    change();
    return;
  }

  root.classList.add("look-wipe");
  start(() => {
    change();
  }).finished.finally(() => root.classList.remove("look-wipe"));
}

export function LookSwitch() {
  useEffect(() => {
    applyLook(document.documentElement.dataset.look === "creepy" ? "creepy" : "cutesy", false);
  }, []);

  return (
    <div role="group" aria-label="Look" className="look-switch">
      <button type="button" data-look-choice="cutesy" className="look-option look-option-cute" aria-pressed="true" onClick={() => applyLook("cutesy")}>
        Cutesy
      </button>
      <button type="button" data-look-choice="creepy" className="look-option look-option-creep" aria-pressed="false" onClick={() => applyLook("creepy")}>
        Creepy
      </button>
    </div>
  );
}
