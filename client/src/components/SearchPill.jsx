import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

export default function SearchPill() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [where, setWhere] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setActive(null);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const today = format(new Date(), 'yyyy-MM-dd');

  const submit = (e) => {
    e?.preventDefault?.();
    const params = new URLSearchParams();
    if (where) params.set('city', where);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', String(guests));
    setOpen(false);
    setActive(null);
    navigate(`/search?${params.toString()}`);
  };

  const focusSegment = (segment) => {
    setOpen(true);
    setActive(segment);
  };

  const datesLabel =
    checkIn && checkOut
      ? `${format(new Date(checkIn), 'MMM d')} – ${format(new Date(checkOut), 'MMM d')}`
      : checkIn
        ? format(new Date(checkIn), 'MMM d')
        : 'Add dates';

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={clsx(
          'mx-auto flex max-w-3xl items-center rounded-full border border-gray-200 bg-white text-sm shadow-[0_1px_2px_rgba(0,0,0,0.08),_0_4px_12px_rgba(0,0,0,0.05)] transition hover:shadow-md',
          open && 'shadow-md'
        )}
      >
        <button
          type="button"
          onClick={() => focusSegment('where')}
          className={clsx(
            'flex-[1.2] rounded-full px-7 py-3 text-left transition',
            active === 'where' ? 'bg-white shadow-md' : 'hover:bg-gray-50'
          )}
        >
          <div className="text-[12px] font-semibold text-gray-900">Where</div>
          <div
            className={clsx(
              'truncate text-sm',
              where ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            {where || 'Search destinations'}
          </div>
        </button>
        <div className="h-7 w-px shrink-0 bg-gray-200" />
        <button
          type="button"
          onClick={() => focusSegment('when')}
          className={clsx(
            'flex-1 rounded-full px-7 py-3 text-left transition',
            active === 'when' ? 'bg-white shadow-md' : 'hover:bg-gray-50'
          )}
        >
          <div className="text-[12px] font-semibold text-gray-900">When</div>
          <div
            className={clsx(
              'truncate text-sm',
              checkIn ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            {datesLabel}
          </div>
        </button>
        <div className="h-7 w-px shrink-0 bg-gray-200" />
        <button
          type="button"
          onClick={() => focusSegment('who')}
          className={clsx(
            'flex flex-1 items-center justify-between rounded-full py-2 pl-7 pr-2 text-left transition',
            active === 'who' ? 'bg-white shadow-md' : 'hover:bg-gray-50'
          )}
        >
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-gray-900">Who</div>
            <div
              className={clsx(
                'truncate text-sm',
                guests > 1 ? 'text-gray-900' : 'text-gray-500'
              )}
            >
              {guests > 1 ? `${guests} guests` : 'Add guests'}
            </div>
          </div>
          <span
            onClick={submit}
            role="button"
            aria-label="Search"
            className="ml-3 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-500 text-white shadow transition hover:bg-brand-600"
          >
            <Search className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </button>
      </div>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
          {active === 'where' && (
            <div>
              <div className="label">Search destinations</div>
              <input
                autoFocus
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="Kismayo, Mogadishu, Nairobi…"
                className="input"
              />
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase text-gray-500">Suggestions</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Kismayo', 'Mogadishu', 'Nairobi', 'Lamu', 'Diani', 'Zanzibar', 'Cape Town'].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setWhere(c);
                          setActive('when');
                        }}
                        className="chip"
                      >
                        {c}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
          {active === 'when' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="label">Check in</div>
                <input
                  autoFocus
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <div className="label">Check out</div>
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="input"
                />
              </div>
            </div>
          )}
          {active === 'who' && (
            <div>
              <div className="label">Guests</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="grid h-9 w-9 place-items-center rounded-full border border-gray-300 text-lg"
                >
                  –
                </button>
                <span className="min-w-[2ch] text-center font-semibold">{guests}</span>
                <button
                  type="button"
                  onClick={() => setGuests((g) => Math.min(20, g + 1))}
                  className="grid h-9 w-9 place-items-center rounded-full border border-gray-300 text-lg"
                >
                  +
                </button>
              </div>
            </div>
          )}
          <div className="mt-5 flex justify-end">
            <button type="button" onClick={submit} className="btn-primary">
              <Search className="h-4 w-4" /> Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
