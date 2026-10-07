"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { VehicleImage } from "@/lib/api";

const SWIPE_DISTANCE = 50; // pixels

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function ImageGallery({
  images,
  title,
}: {
  images: VehicleImage[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        Photos coming soon
      </div>
    );
  }

  const count = images.length;
  const prev = () => setSelected((i) => (i - 1 + count) % count);
  const next = () => setSelected((i) => (i + 1) % count);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || count < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Only count mostly horizontal swipes, so scrolling the page still works
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (count < 2) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  }

  return (
    <div>
      <div
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${title} photos`}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative aspect-[4/3] touch-pan-y select-none overflow-hidden rounded-lg bg-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        <Image
          src={images[selected].url}
          alt={`${title} photo ${selected + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          draggable={false}
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="gallery-arrow gallery-arrow-left"
            >
              <Arrow direction="left" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="gallery-arrow gallery-arrow-right"
            >
              <Arrow direction="right" />
            </button>
            <span className="gallery-counter">
              {selected + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img._id}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded border-2 ${
                i === selected ? "border-orange-500" : "border-transparent"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
