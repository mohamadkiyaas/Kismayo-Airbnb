import { Globe, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4 md:px-6">
        <div>
          <h4 className="mb-3 font-semibold">Support</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Help Centre</li>
            <li>AirCover</li>
            <li>Safety information</li>
            <li>Cancellation options</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Community</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Diversity & belonging</li>
            <li>Refugee stays</li>
            <li>Combating discrimination</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Hosting</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Try hosting</li>
            <li>AirCover for Hosts</li>
            <li>Explore hosting resources</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">About</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Newsroom</li>
            <li>Careers</li>
            <li>Investors</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-gray-600 md:flex-row md:px-6">
          <div>© {new Date().getFullYear()} Kismayo Airbnb · Privacy · Terms · Sitemap</div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-1 font-semibold">
              <Globe className="h-4 w-4" /> English (US)
            </button>
            <span>$ USD</span>
            <div className="flex items-center gap-3">
              <Facebook className="h-4 w-4" />
              <Twitter className="h-4 w-4" />
              <Instagram className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
