import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useRequireAuth } from '../hooks/useAuth.js';
import { api, extractError } from '../lib/api.js';
import { formatMoney } from '../lib/constants.js';
import ReviewForm from '../components/ReviewForm.jsx';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-gray-200 text-gray-700',
  completed: 'bg-sky-100 text-sky-800',
};

export default function Trips() {
  useRequireAuth();
  const qc = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-trips'],
    queryFn: async () => (await api.get('/bookings/me')).data.data,
  });
  const [reviewingId, setReviewingId] = useState(null);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/status`, { status: 'cancelled' });
      toast.success('Booking cancelled');
      qc.invalidateQueries({ queryKey: ['my-trips'] });
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  const payNow = async (id) => {
    try {
      const { data } = await api.post('/payments/checkout', { bookingId: id });
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">My trips</h1>
      {isLoading ? (
        <div className="text-gray-500">Loading…</div>
      ) : !bookings.length ? (
        <div className="card p-10 text-center">
          <p className="text-gray-600">You don't have any trips yet.</p>
          <Link to="/" className="mt-3 inline-block text-brand-500 underline">
            Explore homes →
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b._id} className="card flex flex-col gap-4 p-4 sm:flex-row">
              {b.listing?.images?.[0]?.url && (
                <Link to={`/listings/${b.listing._id}`} className="block w-full shrink-0 sm:w-48">
                  <img
                    src={b.listing.images[0].url}
                    alt=""
                    className="h-32 w-full rounded-xl object-cover sm:h-32"
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      to={`/listings/${b.listing?._id}`}
                      className="font-semibold hover:underline"
                    >
                      {b.listing?.title}
                    </Link>
                    <div className="text-sm text-gray-500">
                      {b.listing?.location?.city}, {b.listing?.location?.country}
                    </div>
                  </div>
                  <span
                    className={clsx(
                      'rounded-full px-2 py-0.5 text-xs font-semibold capitalize',
                      STATUS_COLORS[b.status]
                    )}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
                  <div>
                    <div className="text-xs text-gray-500">Check-in</div>
                    <div>{format(new Date(b.checkIn), 'MMM d, yyyy')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Check-out</div>
                    <div>{format(new Date(b.checkOut), 'MMM d, yyyy')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-semibold">{formatMoney(b.totalPrice, b.currency)}</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {b.paymentStatus === 'unpaid' && b.status !== 'cancelled' && (
                    <button onClick={() => payNow(b._id)} className="btn-primary text-xs">
                      Pay now
                    </button>
                  )}
                  {['pending', 'confirmed'].includes(b.status) && (
                    <button onClick={() => cancel(b._id)} className="btn-outline text-xs">
                      Cancel
                    </button>
                  )}
                  {(b.status === 'confirmed' || b.status === 'completed') && (
                    <button
                      onClick={() => setReviewingId(reviewingId === b._id ? null : b._id)}
                      className="btn-outline text-xs"
                    >
                      {reviewingId === b._id ? 'Close' : 'Leave a review'}
                    </button>
                  )}
                </div>

                {reviewingId === b._id && (
                  <div className="mt-3">
                    <ReviewForm bookingId={b._id} onSubmitted={() => setReviewingId(null)} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
