import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as Arrow } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingCard from './ListingCard.jsx';

export default function ListingRail({ title, subtitle, listings, seeAllHref }) {
  const ref = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [listings]);

  const scrollBy = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: 'smooth' });
  };

  if (!listings?.length) return null;

  return (
    <section className="py-4">
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-0.5 text-lg font-bold tracking-tight md:text-xl">
            {seeAllHref ? (
              <Link to={seeAllHref} className="inline-flex items-center gap-0.5 hover:underline">
                {title}
                <Arrow className="h-4 w-4" />
              </Link>
            ) : (
              <>
                {title}
                <Arrow className="h-4 w-4" />
              </>
            )}
          </h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="hidden gap-1 md:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:shadow disabled:opacity-30"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:shadow disabled:opacity-30"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0"
      >
        {listings.map((l) => (
          <div
            key={l._id}
            className="w-[60%] shrink-0 snap-start sm:w-[33%] md:w-[22%] lg:w-[16%] xl:w-[13.2%]"
          >
            <ListingCard listing={l} />
          </div>
        ))}
      </div>
    </section>
  );
}
