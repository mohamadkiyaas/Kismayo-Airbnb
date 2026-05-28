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
  { city: 'Dallas', subtitle: 'House rentals' },
  { city: 'Cleveland', subtitle: 'Villa rentals' },
  { city: 'North Myrtle Beach', subtitle: 'Monthly rentals' },
  { city: 'Portland', subtitle: 'Apartment rentals' },
  { city: 'Nice', subtitle: 'House rentals' },
  { city: 'Barcelona', subtitle: 'Condo rentals' },
  { city: 'Galveston', subtitle: 'Monthly rentals' },
  { city: 'Kauai', subtitle: 'House rentals' },
  { city: 'Portland', subtitle: 'Monthly rentals' },
  { city: 'Minneapolis', subtitle: 'Vacation rentals' },
  { city: 'Raleigh', subtitle: 'Vacation rentals' },
  { city: 'Philadelphia', subtitle: 'Vacation rentals' },
  { city: 'Orange Beach', subtitle: 'Vacation rentals' },
  { city: 'Amsterdam', subtitle: 'House rentals' },
  { city: 'Gulf Shores', subtitle: 'Vacation rentals' },
  { city: 'Tokyo', subtitle: 'House rentals' },
  { city: 'West Palm Beach', subtitle: 'Condo rentals' },
];

const ARTS = [
  { city: 'Paris', subtitle: 'Museums & galleries' },
  { city: 'Florence', subtitle: 'Renaissance art' },
  { city: 'Lamu', subtitle: 'UNESCO old town' },
  { city: 'Kyoto', subtitle: 'Temples & gardens' },
  { city: 'Berlin', subtitle: 'Modern art scene' },
  { city: 'Nairobi', subtitle: 'Museums & galleries' },
];

const BEACH = [
  { city: 'Malibu', subtitle: 'Pacific Coast' },
  { city: 'Kismayo', subtitle: 'Lido Beach' },
  { city: 'Bali', subtitle: 'Tropical shores' },
  { city: 'Diani', subtitle: 'White sand' },
  { city: 'Zanzibar', subtitle: 'Nungwi' },
  { city: 'Maui', subtitle: 'North Shore' },
];

const MOUNTAINS = [
  { city: 'Aspen', subtitle: 'Ski lodges' },
  { city: 'Banff', subtitle: 'Canadian Rockies' },
  { city: 'Cape Town', subtitle: 'Table Mountain' },
  { city: 'Addis Ababa', subtitle: 'Entoto Hills' },
];

const OUTDOORS = [
  { city: 'Aspen', subtitle: 'Hiking trails' },
  { city: 'Banff', subtitle: 'Lakes & forests' },
  { city: 'Bali', subtitle: 'Surfing' },
  { city: 'Merzouga', subtitle: 'Sahara dunes' },
  { city: 'Nairobi', subtitle: 'Safari gateways' },
];

const TAB_DATA = {
  Popular: POPULAR,
  'Arts & culture': ARTS,
  Beach: BEACH,
  Mountains: MOUNTAINS,
  Outdoors: OUTDOORS,
  'Things to do': POPULAR.slice(0, 10),
  'Travel tips & inspiration': POPULAR.slice(0, 6),
  'Airbnb-friendly apartments': [
    { city: 'New York', subtitle: 'Apartments' },
    { city: 'Paris', subtitle: 'Apartments' },
    { city: 'London', subtitle: 'Apartments' },
    { city: 'Tokyo', subtitle: 'Apartments' },
    { city: 'Barcelona', subtitle: 'Apartments' },
  ],
};

export default function Inspiration() {
  const [tab, setTab] = useState('Popular');
  const items = TAB_DATA[tab] || [];

  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h2 className="text-xl font-bold md:text-2xl">
          Inspiration for future getaways
        </h2>

        <div className="no-scrollbar -mx-4 mt-4 flex gap-6 overflow-x-auto border-b border-gray-200 px-4 md:mx-0 md:px-0">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={clsx(
                'shrink-0 border-b-2 pb-3 text-sm transition',
                tab === t
                  ? 'border-gray-900 font-semibold text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item, i) => (
            <Link
              key={`${item.city}-${item.subtitle}-${i}`}
              to={`/search?city=${encodeURIComponent(item.city)}`}
              className="group"
            >
              <div className="font-semibold text-gray-900 group-hover:underline">
                {item.city}
              </div>
              <div className="text-gray-500">{item.subtitle}</div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-gray-800 hover:underline"
        >
          Show more
          <span aria-hidden>›</span>
        </button>
      </div>
    </section>
  );
}
