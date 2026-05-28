import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Map as MapIcon, List as ListIcon, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api.js';
import CategoryBar from '../components/CategoryBar.jsx';
import ListingGrid from '../components/ListingGrid.jsx';
import MapView from '../components/MapView.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { AMENITIES, PROPERTY_TYPES } from '../lib/constants.js';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = useMemo(() => {
    const obj = {};
    for (const [k, v] of params.entries()) obj[k] = v;
    if (obj.amenities) obj.amenities = obj.amenities.split(',');
    return obj;
  }, [params]);

  const { data, isLoading } = useQuery({
    queryKey: ['search', queryParams],
    queryFn: async () => {
      const { data } = await api.get('/listings', { params: { ...queryParams, limit: 60 } });
      return data.data;
    },
  });

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) {
      next.delete(key);
    } else {
      next.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
    setParams(next);
  };

  const category = params.get('category') || undefined;
  const selectedAmenities = (params.get('amenities') || '').split(',').filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
      <div className="mb-3 rounded-2xl bg-white p-3 shadow-card">
        <SearchBar inline />
      </div>

      <div className="flex items-center justify-between gap-2">
        <CategoryBar value={category} onChange={(c) => setParam('category', c)} />
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => setShowFilters((v) => !v)} className="btn-outline">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <button
            onClick={() => setShowMap((v) => !v)}
            className="btn-outline"
            aria-pressed={showMap}
          >
            {showMap ? <ListIcon className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
            {showMap ? 'List' : 'Show map'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 grid gap-4 rounded-2xl border border-gray-200 p-4 md:grid-cols-3">
          <div>
            <label className="label">Type</label>
            <select
              className="input"
              value={params.get('type') || ''}
              onChange={(e) => setParam('type', e.target.value || undefined)}
            >
              <option value="">Any</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Min price (USD)</label>
            <input
              type="number"
              min="0"
              className="input"
              value={params.get('minPrice') || ''}
              onChange={(e) => setParam('minPrice', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Max price (USD)</label>
            <input
              type="number"
              min="0"
              className="input"
              value={params.get('maxPrice') || ''}
              onChange={(e) => setParam('maxPrice', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Bedrooms</label>
            <input
              type="number"
              min="0"
              className="input"
              value={params.get('bedrooms') || ''}
              onChange={(e) => setParam('bedrooms', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Beds</label>
            <input
              type="number"
              min="0"
              className="input"
              value={params.get('beds') || ''}
              onChange={(e) => setParam('beds', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Baths</label>
            <input
              type="number"
              min="0"
              className="input"
              value={params.get('baths') || ''}
              onChange={(e) => setParam('baths', e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <label className="label">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => {
                const active = selectedAmenities.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      const next = active
                        ? selectedAmenities.filter((x) => x !== a.id)
                        : [...selectedAmenities, a.id];
                      setParam('amenities', next);
                    }}
                    className={`chip ${active ? 'chip-active' : ''}`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label">Sort by</label>
            <select
              className="input"
              value={params.get('sort') || 'newest'}
              onChange={(e) => setParam('sort', e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
        <div>{isLoading ? 'Searching…' : `${data?.length || 0} homes found`}</div>
      </div>

      {showMap ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="max-h-[80vh] overflow-y-auto pr-1">
            <ListingGrid listings={data} loading={isLoading} />
          </div>
          <div className="sticky top-20 h-[80vh] overflow-hidden rounded-2xl">
            <MapView listings={data || []} />
          </div>
        </div>
      ) : (
        <ListingGrid listings={data} loading={isLoading} />
      )}
    </div>
  );
}
