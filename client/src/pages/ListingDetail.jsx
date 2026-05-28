import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, MapPin, Users, BedDouble, Bath, Heart, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, extractError } from '../lib/api.js';
import ImageGallery from '../components/ImageGallery.jsx';
import BookingWidget from '../components/BookingWidget.jsx';
import MapView from '../components/MapView.jsx';
import Reviews from '../components/Reviews.jsx';
import { AMENITIES } from '../lib/constants.js';
import { useAuthStore } from '../store/auth.store.js';
import { useWishlistStore } from '../store/wishlist.store.js';

export default function ListingDetail() {
  const { id } = useParams();
  const { accessToken } = useAuthStore();
  const { ids, toggle } = useWishlistStore();

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => (await api.get(`/listings/${id}`)).data.data,
  });

  if (isLoading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="aspect-[2/1] animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  if (error || !listing)
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h1 className="text-xl font-semibold">Listing not found</h1>
        <Link to="/" className="mt-4 inline-block text-brand-500 underline">
          ← Back home
        </Link>
      </div>
    );

  const liked = ids.includes(listing._id);
  const amenityLabels = Object.fromEntries(AMENITIES.map((a) => [a.id, a.label]));

  const onWishlist = async () => {
    toggle(listing._id);
    if (!accessToken) return;
    try {
      if (liked) await api.delete(`/wishlist/${listing._id}`);
      else await api.post(`/wishlist/${listing._id}`);
    } catch (err) {
      toggle(listing._id);
      toast.error(extractError(err));
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: listing.title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{listing.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-700">
            {listing.rating > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                {listing.rating.toFixed(1)} · {listing.reviewCount} reviews
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {listing.location.city}, {listing.location.country}
            </span>
          </div>
        </div>
        <div className="hidden gap-2 md:flex">
          <button onClick={share} className="btn-ghost text-sm underline">
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button onClick={onWishlist} className="btn-ghost text-sm underline">
            <Heart className={`h-4 w-4 ${liked ? 'fill-brand-500 text-brand-500' : ''}`} /> Save
          </button>
        </div>
      </div>

      <ImageGallery images={listing.images} />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-xl font-semibold">
                Hosted by {listing.host?.name}
              </h2>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-700">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" /> {listing.maxGuests} guests
                </span>
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="h-4 w-4" /> {listing.bedrooms} bedroom · {listing.beds} bed
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bath className="h-4 w-4" /> {listing.baths} bath
                </span>
                <span className="capitalize">· {listing.type}</span>
              </div>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gray-200 text-sm font-semibold">
              {listing.host?.avatar?.url ? (
                <img
                  src={listing.host.avatar.url}
                  className="h-12 w-12 rounded-full object-cover"
                  alt=""
                />
              ) : (
                listing.host?.name?.[0] || '?'
              )}
            </div>
          </div>

          <section className="border-b border-gray-200 py-6">
            <h3 className="mb-3 text-lg font-semibold">About this place</h3>
            <p className="whitespace-pre-line text-gray-700">{listing.description}</p>
          </section>

          <section className="border-b border-gray-200 py-6">
            <h3 className="mb-3 text-lg font-semibold">What this place offers</h3>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {listing.amenities?.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="text-lg">·</span>
                  <span>{amenityLabels[a] || a}</span>
                </li>
              ))}
              {!listing.amenities?.length && <li className="text-gray-500">None listed</li>}
            </ul>
          </section>

          <section className="border-b border-gray-200 py-6">
            <h3 className="mb-3 text-lg font-semibold">Where you'll be</h3>
            <div className="h-80 overflow-hidden rounded-2xl">
              <MapView listings={[listing]} zoom={13} />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {listing.location.address || `${listing.location.city}, ${listing.location.country}`}
            </p>
          </section>

          <section className="py-6">
            <h3 className="mb-4 text-lg font-semibold">Reviews</h3>
            <Reviews listingId={listing._id} />
          </section>
        </div>

        <aside>
          <BookingWidget listing={listing} />
        </aside>
      </div>
    </div>
  );
}
