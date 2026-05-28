import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useRequireAuth } from '../hooks/useAuth.js';
import { api, extractError } from '../lib/api.js';
import { formatMoney } from '../lib/constants.js';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-gray-200 text-gray-700',
  completed: 'bg-sky-100 text-sky-800',
};

export default function HostDashboard() {
  useRequireAuth();
  const [tab, setTab] = useState('listings');
  const qc = useQueryClient();

  const { data: listings = [], isLoading: lLoading } = useQuery({
    queryKey: ['host-listings'],
    queryFn: async () => (await api.get('/listings/mine')).data.data,
  });

  const { data: bookings = [], isLoading: bLoading } = useQuery({
    queryKey: ['host-bookings'],
    queryFn: async () => (await api.get('/bookings/host')).data.data,
  });

  const remove = async (id) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/listings/${id}`);
      toast.success('Listing deleted');
      qc.invalidateQueries({ queryKey: ['host-listings'] });
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  const setStatus = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status}`);
      qc.invalidateQueries({ queryKey: ['host-bookings'] });
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  const earnings = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Host dashboard</h1>
        <Link to="/host/listings/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New listing
        </Link>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <Stat label="Listings" value={listings.length} />
        <Stat label="Bookings" value={bookings.length} />
        <Stat label="Earnings" value={formatMoney(earnings)} />
      </div>

      <div className="mb-4 flex gap-2 border-b border-gray-200">
        <Tab active={tab === 'listings'} onClick={() => setTab('listings')}>
          Listings
        </Tab>
        <Tab active={tab === 'bookings'} onClick={() => setTab('bookings')}>
          Bookings
        </Tab>
      </div>

      {tab === 'listings' ? (
        lLoading ? (
          <p className="text-gray-500">Loading…</p>
        ) : !listings.length ? (
          <div className="card p-10 text-center text-gray-600">
            You have no listings yet.
            <Link to="/host/listings/new" className="ml-2 text-brand-500 underline">
              Create one
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <li key={l._id} className="card overflow-hidden">
                <Link to={`/listings/${l._id}`}>
                  <img
                    src={l.images?.[0]?.url}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                </Link>
                <div className="p-4">
                  <div className="truncate font-semibold">{l.title}</div>
                  <div className="text-sm text-gray-500">
                    {l.location.city}, {l.location.country}
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-semibold">
                      {formatMoney(l.pricePerNight, l.currency)}
                    </span>{' '}
                    / night
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/host/listings/${l._id}/edit`} className="btn-outline flex-1 text-xs">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => remove(l._id)}
                      className="btn-outline text-xs text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : bLoading ? (
        <p className="text-gray-500">Loading…</p>
      ) : !bookings.length ? (
        <div className="card p-10 text-center text-gray-600">No bookings yet.</div>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li key={b._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img
                src={b.listing?.images?.[0]?.url}
                alt=""
                className="h-20 w-28 shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold">{b.listing?.title}</div>
                <div className="text-sm text-gray-600">
                  Guest: {b.guest?.name} ({b.guest?.email})
                </div>
                <div className="text-sm text-gray-600">
                  {format(new Date(b.checkIn), 'MMM d')} — {format(new Date(b.checkOut), 'MMM d, yyyy')} ·{' '}
                  {b.guests} guests
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatMoney(b.totalPrice, b.currency)}</div>
                <span
                  className={clsx(
                    'mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize',
                    STATUS_COLORS[b.status]
                  )}
                >
                  {b.status}
                </span>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {b.status === 'pending' && (
                  <button onClick={() => setStatus(b._id, 'confirmed')} className="btn-primary text-xs">
                    Confirm
                  </button>
                )}
                {['pending', 'confirmed'].includes(b.status) && (
                  <button onClick={() => setStatus(b._id, 'cancelled')} className="btn-outline text-xs">
                    Cancel
                  </button>
                )}
                {b.status === 'confirmed' && (
                  <button onClick={() => setStatus(b._id, 'completed')} className="btn-outline text-xs">
                    Mark completed
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Tab({ active, ...props }) {
  return (
    <button
      {...props}
      className={clsx(
        '-mb-px border-b-2 px-3 py-2 text-sm font-semibold',
        active
          ? 'border-gray-900 text-gray-900'
          : 'border-transparent text-gray-500 hover:text-gray-800'
      )}
    />
  );
}
