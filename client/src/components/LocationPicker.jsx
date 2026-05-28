import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickCapture({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({ lat, lng, onPick }) {
  const center = useMemo(() => {
    const la = Number(lat);
    const ln = Number(lng);
    if (!Number.isNaN(la) && !Number.isNaN(ln) && (la || ln)) return [la, ln];
    return [-0.3582, 42.5454];
  }, [lat, lng]);
  const ref = useRef();

  useEffect(() => {
    if (ref.current && !Number.isNaN(+lat) && !Number.isNaN(+lng) && (+lat || +lng)) {
      ref.current.setView([+lat, +lng], 12);
    }
  }, [lat, lng]);

  return (
    <div className="h-64 overflow-hidden rounded-xl">
      <MapContainer center={center} zoom={6} whenCreated={(m) => (ref.current = m)}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCapture onPick={onPick} />
        {!Number.isNaN(+lat) && !Number.isNaN(+lng) && (
          <Marker position={[+lat, +lng]} icon={icon} />
        )}
      </MapContainer>
    </div>
  );
}
