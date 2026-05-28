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
  const typeLabel = listing.type ? listing.type.charAt(0).toUpperCase() + listing.type.slice(1) : 'Stay';
  const cityShort = listing.location?.city || listing.location?.country || '';
  const cardTitle = `${typeLabel} in ${cityShort}`;

  return (
    <Link to={`/listings/${listing._id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <img
          src={images[idx].url}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/600x600?text=Photo';
          }}
        />
        {isGuestFavorite && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-gray-900 shadow-sm">
            Guest favorite
          </span>
        )}
        <button
          onClick={onLike}
          aria-label="Add to wishlist"
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center text-white transition hover:scale-110"
        >
          <Heart
            className={clsx(
              'h-6 w-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]',
              liked ? 'fill-brand-500 stroke-white' : 'fill-black/40 stroke-white'
            )}
            strokeWidth={2}
          />
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
      <div className="mt-2">
        <h3 className="truncate text-[15px] font-semibold text-gray-900">{cardTitle}</h3>
        <div className="mt-0.5 flex items-center gap-1 text-[13px] text-gray-600">
          <span className="font-semibold text-gray-900">
            {formatMoney((listing.pricePerNight || 0) * 2, listing.currency)}
          </span>
          <span>for 2 nights</span>
          {listing.rating > 0 && (
            <>
              <span aria-hidden>·</span>
              <Star className="h-3 w-3 fill-current text-gray-900" />
              <span className="text-gray-900">{listing.rating.toFixed(2)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
