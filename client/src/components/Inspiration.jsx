import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const TABS = [
  'Popular',
  'Arts & culture',
  'Beach',
  'Mountains',
  'Outdoors',
  'Things to do',
  'Travel tips & inspiration',
  'Airbnb-friendly apartments',
];

const POPULAR = [
  { city: 'Kismayo', subtitle: 'Beach villas' },
  { city: 'Mogadishu', subtitle: 'Seaside suites' },
  { city: 'Nairobi', subtitle: 'City apartments' },
  { city: 'Lamu', subtitle: 'Swahili stone houses' },
  { city: 'Diani', subtitle: 'Beach bungalows' },
  { city: 'Zanzibar', subtitle: 'Island retreats' },
  { city: 'Addis Ababa', subtitle: 'Mountain lodges' },
  { city: 'Cape Town', subtitle: 'City studios' },
  { city: 'Dubai', subtitle: 'High-rises' },
  { city: 'Merzouga', subtitle: 'Desert glamping' },
];

const BEACH = [
  { city: 'Kismayo', subtitle: 'Lido Beach' },
  { city: 'Lamu', subtitle: 'Old town shoreline' },
  { city: 'Diani', subtitle: 'White sand' },
  { city: 'Zanzibar', subtitle: 'Nungwi' },
  { city: 'Mogadishu', subtitle: 'Liido Beach' },
];

const MOUNTAINS = [
  { city: 'Addis Ababa', subtitle: 'Entoto Hills' },
  { city: 'Cape Town', subtitle: 'Table Mountain' },
];

const DESERT = [{ city: 'Merzouga', subtitle: 'Sahara dunes' }];

const TAB_DATA = {
  Popular: POPULAR,
  'Arts & culture': [
    { city: 'Lamu', subtitle: 'UNESCO old town' },
    { city: 'Nairobi', subtitle: 'Museums & galleries' },
    { city: 'Cape Town', subtitle: 'V&A Waterfront' },
  ],
  Beach: BEACH,
  Mountains: MOUNTAINS,
  Outdoors: [...BEACH, ...MOUNTAINS, ...DESERT],
  'Things to do': POPULAR.slice(0, 6),
  'Travel tips & inspiration': POPULAR.slice(0, 4),
  'Airbnb-friendly apartments': [
    { city: 'Nairobi', subtitle: 'Westlands' },
    { city: 'Cape Town', subtitle: 'Gardens' },
    { city: 'Dubai', subtitle: 'Marina' },
  ],
};

export default function Inspiration() {
  const [tab, setTab] = useState('Popular');
  const items = TAB_DATA[tab] || [];

  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h2 className="text-xl font-bold md:text-2xl">Inspiration for future getaways</h2>

        <div className="no-scrollbar mt-4 -mx-4 flex gap-6 overflow-x-auto border-b border-gray-200 px-4 md:mx-0 md:px-0">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={clsx(
                'shrink-0 border-b-2 pb-3 text-sm font-semibold transition',
                tab === t
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item) => (
            <Link
              key={`${item.city}-${item.subtitle}`}
              to={`/search?city=${encodeURIComponent(item.city)}`}
              className="group"
            >
              <div className="font-semibold text-gray-900 group-hover:underline">{item.city}</div>
              <div className="text-gray-500">{item.subtitle}</div>
            </Link>
          ))}
        </div>

        <button type="button" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gray-800 hover:underline">
          Show more
          <span aria-hidden>›</span>
        </button>
      </div>
    </section>
  );
}
