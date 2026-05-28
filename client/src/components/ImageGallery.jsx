import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ImageGallery({ images = [] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  if (!images.length) {
    return (
      <div className="grid aspect-[2/1] place-items-center rounded-2xl bg-gray-100 text-gray-400">
        No images
      </div>
    );
  }

  const main = images[0]?.url;
  const rest = images.slice(1, 5);

  return (
    <>
      <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-2xl md:grid-cols-4 md:grid-rows-2">
        <button
          type="button"
          onClick={() => {
            setIdx(0);
            setOpen(true);
          }}
          className="md:col-span-2 md:row-span-2"
        >
          <img src={main} alt="" className="h-full max-h-[480px] w-full object-cover" />
        </button>
        {rest.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIdx(i + 1);
              setOpen(true);
            }}
            className="hidden md:block"
          >
            <img
              src={img.url}
              alt=""
              className="h-full max-h-[235px] w-full object-cover"
            />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X />
          </button>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft />
          </button>
          <img
            src={images[idx]?.url}
            alt=""
            className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain"
          />
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            {idx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
