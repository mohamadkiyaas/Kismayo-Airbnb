import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useRequireAuth } from '../hooks/useAuth.js';
import { api } from '../lib/api.js';
import ListingGrid from '../components/ListingGrid.jsx';
import { useWishlistStore } from '../store/wishlist.store.js';

export default function Wishlist() {
  useRequireAuth();
  const { setIds } = useWishlistStore();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await api.get('/wishlist')).data.data,
  });

  useEffect(() => {
    setIds((listings || []).map((l) => l._id));
  }, [listings, setIds]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="mb-6 text-2xl font-bold">Wishlist</h1>
      {!isLoading && !listings.length ? (
        <div className="card p-10 text-center">
          <p className="text-gray-600">Save listings you love by tapping the heart icon.</p>
          <Link to="/" className="mt-3 inline-block text-brand-500 underline">
            Find your next home →
          </Link>
        </div>
      ) : (
        <ListingGrid listings={listings} loading={isLoading} />
      )}
    </div>
  );
}
