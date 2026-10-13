"use client";

import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { GalleryPiece } from "@/lib/content";
import { Plate } from "@/components/plate";
import { Zoomable } from "@/components/zoomable";

export function Gallery({ pieces }: { pieces: GalleryPiece[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pieceIndex, setPieceIndex] = useState(0);
  const [pictureIndex, setPictureIndex] = useState(0);
  const [openToken, setOpenToken] = useState(0);
  const piece = pieces[pieceIndex];
  const picture = piece.pictures[pictureIndex] ?? piece.pictures[0];

  useEffect(() => {
    const dialogNode = dialog.current;
    if (dialogNode == null) return;
    const element: HTMLDialogElement = dialogNode;
    function onBackdropClick(event: MouseEvent) {
      if (event.target === element) element.close();
    }
    element.addEventListener("click", onBackdropClick);
    return () => element.removeEventListener("click", onBackdropClick);
  }, []);

  useEffect(() => {
    if (openToken === 0) return;
    const node = dialog.current;
    if (node && !node.open) node.showModal();
  }, [openToken]);

  function stepPiece(delta: number) {
    const next = pieceIndex + delta;
    if (next < 0 || next >= pieces.length) return;
    setPieceIndex(next);
    setPictureIndex(0);
  }

  function stepPicture(delta: number) {
    setPictureIndex((current) => {
      const next = current + delta;
      if (next < 0 || next >= piece.pictures.length) return current;
      return next;
    });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepPiece(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepPiece(1);
    }
  }

  return (
    <>
      <ul className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 sm:grid-cols-2">
        {pieces.map((item, index) => (
          <li key={item.title}>
            <button
              type="button"
              data-flow="plate"
              className="group block w-full cursor-pointer overflow-hidden rounded-[1.75rem] border-2 border-ink text-left transition-colors duration-500 hover:border-rose"
              aria-label={`Open ${item.title}`}
              onClick={() => {
                setPieceIndex(index);
                setPictureIndex(0);
                setOpenToken((current) => current + 1);
              }}
            >
              <Plate
                spec={item.pictures[0]}
                className="aspect-[16/10] w-full origin-center scale-125 transition-transform duration-700 ease-out group-hover:scale-150 motion-reduce:transition-none motion-reduce:group-hover:scale-125"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="bg-transparent"
        aria-label={piece.title}
      >
        <div className="bg-paper px-3 py-4 text-ink sm:px-8" onKeyDown={onKeyDown}>
          <div className="mb-4 flex justify-end">
            <button type="button" className="grid size-11 place-items-center border-2 border-ink" aria-label="Close" onClick={() => dialog.current?.close()}>
              <XIcon weight="light" size={22} aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-5">
            <button
              type="button"
              aria-label="Previous gallery piece"
              disabled={pieceIndex === 0}
              onClick={() => stepPiece(-1)}
              className="grid size-12 place-items-center text-ink disabled:opacity-30"
            >
              <CaretLeftIcon weight="light" size={36} aria-hidden="true" />
            </button>
            <Zoomable
              spec={picture}
              label={`Zoom in on ${piece.title}`}
              caption={picture.caption}
              className="mx-auto block max-w-full cursor-pointer"
              plateClassName="mx-auto h-auto max-h-[42dvh] w-auto max-w-full border-2 border-ink"
            />
            <button
              type="button"
              aria-label="Next gallery piece"
              disabled={pieceIndex === pieces.length - 1}
              onClick={() => stepPiece(1)}
              className="grid size-12 place-items-center text-ink disabled:opacity-30"
            >
              <CaretRightIcon weight="light" size={36} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5 flex flex-col items-center gap-3">
            {piece.pictures.length > 1 ? (
              <div className="inline-flex border-2 border-ink">
                <button
                  type="button"
                  aria-label="Previous picture in this piece"
                  disabled={pictureIndex === 0}
                  onClick={() => stepPicture(-1)}
                  className="grid size-11 place-items-center border-r-2 border-ink disabled:opacity-30"
                >
                  <CaretLeftIcon weight="light" size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next picture in this piece"
                  disabled={pictureIndex === piece.pictures.length - 1}
                  onClick={() => stepPicture(1)}
                  className="grid size-11 place-items-center disabled:opacity-30"
                >
                  <CaretRightIcon weight="light" size={20} aria-hidden="true" />
                </button>
              </div>
            ) : null}
            <div className="max-w-md text-center">
              <h2 className="pb-1 font-display text-3xl leading-[1.1]">{piece.title}</h2>
              <p className="font-body text-lg leading-relaxed text-plum">{picture.caption}</p>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
