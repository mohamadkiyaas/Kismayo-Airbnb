import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { differenceInCalendarDays, format } from 'date-fns';
import { api, extractError } from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.js';
import { formatMoney } from '../lib/constants.js';

const SERVICE_FEE_RATE = 0.12;

export default function BookingWidget({ listing }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, differenceInCalendarDays(new Date(checkOut), new Date(checkIn)));
  }, [checkIn, checkOut]);

  const subtotal = nights * listing.pricePerNight;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  const { data: bookedRanges = [] } = useQuery({
    queryKey: ['avail', listing._id],
    queryFn: async () => {
      const { data } = await api.get(`/listings/${listing._id}/availability`);
      return data.data;
    },
    staleTime: 60_000,
  });

  const reserve = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/login?from=/listings/${listing._id}`);
      return;
    }
    if (!checkIn || !checkOut || nights < 1) return toast.error('Please pick valid dates');
    if (user?._id === listing.host?._id) return toast.error('You cannot book your own listing');
    setSubmitting(true);
    try {
      const { data: bookingRes } = await api.post('/bookings', {
        listing: listing._id,
        checkIn,
        checkOut,
        guests,
      });
      const bookingId = bookingRes.data._id;
      const { data: payRes } = await api.post('/payments/checkout', { bookingId });
      if (payRes.url) {
        window.location.href = payRes.url;
      } else {
        toast.success('Booking created!');
        navigate('/trips');
      }
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card sticky top-24 p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold">{formatMoney(listing.pricePerNight, listing.currency)}</span>
          <span className="ml-1 text-gray-600">night</span>
        </div>
        {listing.rating > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-semibold">{listing.rating.toFixed(1)}</span>
            <span className="text-gray-500">({listing.reviewCount})</span>
          </div>
        )}
      </div>
      <form onSubmit={reserve} className="space-y-3">
        <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-gray-300">
          <label className="border-r border-gray-300 p-3">
            <div className="text-[10px] font-bold uppercase">Check-in</div>
            <input
              type="date"
              min={today}
              required
              className="w-full bg-transparent text-sm outline-none"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </label>
          <label className="p-3">
            <div className="text-[10px] font-bold uppercase">Check-out</div>
            <input
              type="date"
              min={checkIn || today}
              required
              className="w-full bg-transparent text-sm outline-none"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </label>
        </div>
        <label className="block rounded-xl border border-gray-300 p-3">
          <div className="text-[10px] font-bold uppercase">Guests</div>
          <select
            className="w-full bg-transparent text-sm outline-none"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            {Array.from({ length: listing.maxGuests }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base">
          {submitting ? 'Processing…' : nights ? 'Reserve' : 'Check availability'}
        </button>
      </form>

      {nights > 0 && (
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="underline">
              {formatMoney(listing.pricePerNight, listing.currency)} × {nights} nights
            </span>
            <span>{formatMoney(subtotal, listing.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Service fee</span>
            <span>{formatMoney(serviceFee, listing.currency)}</span>
          </div>
          <div className="my-2 border-t border-gray-200" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatMoney(total, listing.currency)}</span>
          </div>
        </div>
      )}

      {bookedRanges.length > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          {bookedRanges.length} confirmed booking{bookedRanges.length > 1 ? 's' : ''} on this listing —
          some dates may be unavailable.
        </p>
      )}
    </div>
  );
}
