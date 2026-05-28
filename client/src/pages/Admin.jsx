import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { useRequireAuth } from '../hooks/useAuth.js';
import { api, extractError } from '../lib/api.js';
import { formatMoney } from '../lib/constants.js';

export default function Admin() {
  useRequireAuth('admin');
  const [tab, setTab] = useState('overview');
  const qc = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data.data,
  });
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admin/users')).data.data,
    enabled: tab === 'users',
  });
  const { data: listings = [] } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: async () => (await api.get('/admin/listings')).data.data,
    enabled: tab === 'listings',
  });

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  const deleteListing = async (id) => {
    if (!confirm('Delete this listing permanently?')) return;
    try {
      await api.delete(`/admin/listings/${id}`);
      toast.success('Listing deleted');
      qc.invalidateQueries({ queryKey: ['admin-listings'] });
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="mb-6 text-2xl font-bold">Admin</h1>

      <div className="mb-4 flex gap-2 border-b border-gray-200">
        {[
          ['overview', 'Overview'],
          ['users', 'Users'],
          ['listings', 'Listings'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              '-mb-px border-b-2 px-3 py-2 text-sm font-semibold',
              tab === id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <Stat label="Total users" value={stats.users} />
          <Stat label="Hosts" value={stats.hosts} />
          <Stat label="Listings" value={stats.listings} />
          <Stat label="Bookings" value={stats.bookings} />
          <Stat label="Reviews" value={stats.reviews} />
          <Stat label="Revenue (paid)" value={formatMoney(stats.revenue)} />
        </div>
      )}

      {tab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Joined</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-2 font-medium">{u.name}</td>
                  <td className="px-4 py-2 text-gray-600">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'listings' && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Host</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((l) => (
                <tr key={l._id}>
                  <td className="px-4 py-2 font-medium">{l.title}</td>
                  <td className="px-4 py-2 text-gray-600">{l.host?.name}</td>
                  <td className="px-4 py-2">{l.location?.city}</td>
                  <td className="px-4 py-2">{formatMoney(l.pricePerNight, l.currency)}</td>
                  <td className="px-4 py-2 capitalize">{l.status}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => deleteListing(l._id)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
