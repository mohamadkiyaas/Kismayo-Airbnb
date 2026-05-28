import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import CategoryBar from '../components/CategoryBar.jsx';
import ListingGrid from '../components/ListingGrid.jsx';
import ListingRail from '../components/ListingRail.jsx';
import Inspiration from '../components/Inspiration.jsx';

const RAIL_ORDER = [
  { city: 'Kismayo', title: 'Popular homes in Kismayo' },
  { city: 'Mogadishu', title: 'Stay in Mogadishu' },
  { city: 'Nairobi', title: 'Homes in Nairobi' },
  { city: 'Lamu', title: 'Featured stays in Lamu' },
  { city: 'Zanzibar', title: 'Islands of Zanzibar' },
  { city: 'Cape Town', title: 'Cape Town favorites' },
  { city: 'Dubai', title: 'Dubai high-rises' },
];

export default function Home() {
  const [category, setCategory] = useState();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['home-listings', category],
    queryFn: async () => {
      const params = { limit: 60, sort: 'newest' };
      if (category) params.category = category;
      const { data } = await api.get('/listings', { params });
      return data.data;
    },
  });

  const railSections = useMemo(() => {
    if (!listings.length) return [];
    const byCity = new Map();
    for (const l of listings) {
      const city = l.location?.city;
      if (!city) continue;
      if (!byCity.has(city)) byCity.set(city, []);
      byCity.get(city).push(l);
    }
    const ordered = RAIL_ORDER.filter((r) => byCity.has(r.city)).map((r) => ({
      ...r,
      listings: byCity.get(r.city),
    }));
    const seen = new Set(ordered.map((r) => r.city));
    const leftover = [...byCity.entries()]
      .filter(([city]) => !seen.has(city))
      .map(([city, ls]) => ({ city, title: `Homes in ${city}`, listings: ls }));
    return [...ordered, ...leftover];
  }, [listings]);

  const showRails = !category && railSections.length > 0;

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <CategoryBar value={category} onChange={setCategory} />

        <div className="pb-12">
          {isLoading ? (
            <ListingGrid loading />
          ) : showRails ? (
            <div className="divide-y divide-gray-100">
              {railSections.map((s) => (
                <ListingRail
                  key={s.city}
                  title={s.title}
                  subtitle={s.subtitle}
                  listings={s.listings}
                  seeAllHref={`/search?city=${encodeURIComponent(s.city)}`}
                />
              ))}
            </div>
          ) : (
            <div className="pt-4">
              <ListingGrid listings={listings} />
            </div>
          )}
        </div>
      </section>

      <Inspiration />
    </div>
  );
}
