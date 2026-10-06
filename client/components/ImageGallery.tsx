"use client";

import Image from "next/image";
import { useState } from "react";
import type { VehicleImage } from "@/lib/api";

export default function ImageGallery({
  images,
  title,
}: {
  images: VehicleImage[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        Photos coming soon
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selected].url}
          alt={`${title} photo ${selected + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
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
