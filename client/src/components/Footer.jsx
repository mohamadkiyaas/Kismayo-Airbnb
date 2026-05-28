import { Globe, Facebook, Twitter, Instagram } from 'lucide-react';

const SUPPORT = [
  'Help Center',
  'Get help with a safety issue',
  'AirCover',
  'Travel insurance',
  'Anti-discrimination',
  'Disability support',
  'Cancellation options',
  'Report neighborhood concern',
];

const HOSTING = [
  'Airbnb your home',
  'Airbnb your experience',
  'Airbnb your service',
  'AirCover for Hosts',
  'Hosting resources',
  'Community forum',
  'Hosting responsibly',
  'Airbnb-friendly apartments',
  'Join a free hosting class',
  'Find an co-host',
  'Refer a Host',
];

const AIRBNB = [
  '2026 Summer Release',
  'Newsroom',
  'Careers',
  'Investors',
  'Gift cards',
  'Airbnb.org emergency stays',
];

function Column({ heading, items }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-gray-900">{heading}</h4>
      <ul className="space-y-3 text-sm text-gray-700">
        {items.map((label) => (
          <li key={label} className="hover:underline cursor-pointer">
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-3 md:px-6">
        <Column heading="Support" items={SUPPORT} />
        <Column heading="Hosting" items={HOSTING} />
        <Column heading="Airbnb" items={AIRBNB} />
      </div>
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-gray-700 md:flex-row md:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} Airbnb, Inc.</span>
            <span aria-hidden>·</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span aria-hidden>·</span>
            <span className="hover:underline cursor-pointer">Terms</span>
            <span aria-hidden>·</span>
            <span className="hover:underline cursor-pointer">Your Privacy Choices</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-1 font-semibold hover:underline">
              <Globe className="h-4 w-4" />
              English (US)
            </button>
            <span className="font-semibold">$ USD</span>
            <div className="flex items-center gap-3 text-gray-700">
              <Facebook className="h-4 w-4 cursor-pointer" />
              <Twitter className="h-4 w-4 cursor-pointer" />
              <Instagram className="h-4 w-4 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
