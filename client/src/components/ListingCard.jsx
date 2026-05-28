import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/auth.store.js';
import { useWishlistStore } from '../store/wishlist.store.js';
import { api } from '../lib/api.js';
import { formatMoney } from '../lib/constants.js';
import toast from 'react-hot-toast';

export default function ListingCard({ listing }) {
  const [idx, setIdx] = useState(0);
  const { accessToken } = useAuthStore();
  const { ids, toggle } = useWishlistStore();
  const liked = ids.includes(listing._id);

  useEffect(() => {
    setIdx(0);
  }, [listing._id]);

  const images = listing.images?.length ? listing.images : [{ url: 'https://placehold.co/600x400?text=No+image' }];
  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + 1) % images.length);
  };
  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i - 1 + images.length) % images.length);
  };

  const onLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(listing._id);
    if (!accessToken) {
      toast('Sign in to save your wishlist', { icon: '♡' });
      return;
    }
    try {
      if (liked) await api.delete(`/wishlist/${listing._id}`);
      else await api.post(`/wishlist/${listing._id}`);
    } catch {
      toggle(listing._id);
      toast.error('Could not update wishlist');
    }
  };

  const isGuestFavorite = listing.rating >= 4.8 && listing.reviewCount >= 5;

  return (
    <Link to={`/listings/${listing._id}`} className="group block">
      <div className="relative aspect-[1/1] overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={images[idx].url}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {isGuestFavorite && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-900 shadow">
            Guest favorite
          </span>
        )}
        <button
          onClick={onLike}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur transition hover:scale-110"
        >
          <Heart className={clsx('h-5 w-5', liked && 'fill-brand-500 text-brand-500')} />
        </button>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-1 shadow group-hover:block"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-1 shadow group-hover:block"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={clsx(
                    'h-1.5 w-1.5 rounded-full',
                    i === idx ? 'bg-white' : 'bg-white/60'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-2 space-y-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-900">
            {listing.location?.city}, {listing.location?.country}
          </h3>
          {listing.rating > 0 && (
            <div className="flex shrink-0 items-center gap-1 text-sm">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{listing.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="truncate text-sm text-gray-500">{listing.title}</div>
        <div className="text-sm text-gray-500 capitalize">
          {listing.type} · {listing.maxGuests} guests
        </div>
        <div className="pt-1 text-sm">
          <span className="font-semibold text-gray-900">
            {formatMoney(listing.pricePerNight, listing.currency)}
          </span>{' '}
          <span className="text-gray-600">night</span>
        </div>
      </div>
    </Link>
  );
}
