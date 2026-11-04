"use client";

import { useEffect } from "react";

function applyLook(next: "cutesy" | "creepy") {
  const root = document.documentElement;
  if (next === "creepy") root.dataset.look = "creepy";
  else delete root.dataset.look;
  try {
    localStorage.setItem("rosa-look", next);
  } catch {
    /* The look still changes for this view. */
  }
  document.querySelector<HTMLButtonElement>("[data-look-choice='cutesy']")?.setAttribute("aria-pressed", next === "cutesy" ? "true" : "false");
  document.querySelector<HTMLButtonElement>("[data-look-choice='creepy']")?.setAttribute("aria-pressed", next === "creepy" ? "true" : "false");
}

export function LookSwitch() {
  useEffect(() => {
    applyLook(document.documentElement.dataset.look === "creepy" ? "creepy" : "cutesy");
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
