import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { formatMoney } from '../lib/constants.js';

const createPriceIcon = (price, currency) =>
  L.divIcon({
    className: '',
    html: `<div style="background:white;color:#111;font-weight:700;font-size:12px;padding:4px 10px;border-radius:9999px;box-shadow:0 1px 4px rgba(0,0,0,.25);border:1px solid #d1d5db;white-space:nowrap;">${formatMoney(
      price,
      currency
    )}</div>`,
  });

function FitBounds({ listings }) {
  const map = useMap();
  useEffect(() => {
    if (!listings?.length) return;
    const valid = listings
      .map((l) => l.location?.coordinates?.coordinates)
      .filter((c) => Array.isArray(c) && c.length === 2);
    if (!valid.length) return;
    const bounds = L.latLngBounds(valid.map(([lng, lat]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [listings, map]);
  return null;
}

export default function MapView({ listings, center, zoom = 10, height = '100%' }) {
  const initialCenter = useMemo(() => {
    if (center) return center;
    const first = listings?.find((l) => l.location?.coordinates?.coordinates?.length === 2);
    if (first) {
      const [lng, lat] = first.location.coordinates.coordinates;
      return [lat, lng];
    }
    return [-0.3582, 42.5454];
  }, [listings, center]);

  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer center={initialCenter} zoom={zoom} scrollWheelZoom className="rounded-2xl">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds listings={listings} />
        {listings?.map((l) => {
          const coords = l.location?.coordinates?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const [lng, lat] = coords;
          return (
            <Marker
              key={l._id}
              position={[lat, lng]}
              icon={createPriceIcon(l.pricePerNight, l.currency)}
            >
              <Popup>
                <Link to={`/listings/${l._id}`} className="block w-48">
                  {l.images?.[0]?.url && (
                    <img src={l.images[0].url} alt="" className="mb-2 h-24 w-full rounded object-cover" />
                  )}
                  <div className="text-xs font-semibold">{l.title}</div>
                  <div className="text-xs text-gray-500">{l.location?.city}</div>
                  <div className="mt-1 text-xs">
                    <span className="font-semibold">{formatMoney(l.pricePerNight, l.currency)}</span> / night
                  </div>
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
