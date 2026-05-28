import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

export default function SearchBar({ inline = false }) {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', String(guests));
    navigate(`/search?${params.toString()}`);
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <form
      onSubmit={submit}
      className={
        inline
          ? 'flex w-full flex-wrap items-end gap-3'
          : 'grid w-full max-w-4xl grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-2xl md:grid-cols-5'
      }
    >
      <div className={inline ? 'min-w-[160px] flex-1' : 'md:col-span-2'}>
        <label className="label">Where</label>
        <input
          className="input"
          placeholder="Kismayo, Mogadishu, Nairobi..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className={inline ? 'flex-1' : ''}>
        <label className="label">Check in</label>
        <input
          type="date"
          className="input"
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>
      <div className={inline ? 'flex-1' : ''}>
        <label className="label">Check out</label>
        <input
          type="date"
          className="input"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
      <div className={inline ? 'w-28' : ''}>
        <label className="label">Guests</label>
        <input
          type="number"
          min="1"
          max="50"
          className="input"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>
      <div className={inline ? '' : 'md:col-span-5'}>
        <button type="submit" className="btn-primary w-full">
          <Search className="h-4 w-4" /> Search
        </button>
      </div>
    </form>
  );
}
