import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Globe, User as UserIcon, Heart, Home as HomeIcon } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../hooks/useAuth.js';
import SearchPill from './SearchPill.jsx';

const TOP_TABS = [
  { id: 'homes', label: 'Homes', icon: '🏠', to: '/' },
  { id: 'experiences', label: 'Experiences', icon: '🎈', to: '/experiences', badge: 'NEW' },
  { id: 'services', label: 'Services', icon: '🛎️', to: '/services', badge: 'NEW' },
];

export default function Navbar() {
  const { user, isAuthenticated, isHost, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-1 text-brand-500" aria-label="Home">
            <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" fill="currentColor" aria-hidden>
              <path d="M16 1c-2.5 0-4.4 1.5-6 4l-7.5 13.4C1.2 20.7 1 22 1 23.4 1 27.6 4.1 31 8.4 31c1.7 0 3.3-.5 4.7-1.5 1 .7 2 1.2 3 1.2s2-.5 3-1.2c1.4 1 3 1.5 4.7 1.5 4.3 0 7.4-3.4 7.4-7.6 0-1.4-.2-2.7-1.5-5L22 5c-1.6-2.5-3.5-4-6-4zm0 2.5c1.7 0 3 1 4.2 3l7.5 13.4c1 1.8 1.3 2.7 1.3 3.6 0 2.8-2 4.8-4.8 4.8-1.4 0-2.5-.5-3.7-1.5 2-2 3.5-4.5 3.5-7.3 0-2-1.5-3.5-3.5-3.5s-3.5 1.5-3.5 3.5c0 .8.2 1.5.5 2.3-1 1.2-2 2.3-3 3-1-.7-2-1.8-3-3 .3-.8.5-1.5.5-2.3 0-2-1.5-3.5-3.5-3.5S5 16.5 5 18.5c0 2.8 1.5 5.3 3.5 7.3-1.2 1-2.3 1.5-3.7 1.5-2.8 0-4.8-2-4.8-4.8 0-.9.3-1.8 1.3-3.6L8.8 5.5c1.2-2 2.5-3 4.2-3z"/>
            </svg>
            <span className="hidden text-2xl font-bold tracking-tight md:inline">airbnb</span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
            {TOP_TABS.map((t) => (
              <NavLink
                key={t.id}
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition',
                    isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {t.badge && (
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 -rotate-12 rounded-md bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tight text-white shadow-sm">
                        {t.badge}
                      </span>
                    )}
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.label}</span>
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-3 h-0.5 rounded-full bg-gray-900" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isHost ? (
              <NavLink
                to="/host"
                className={({ isActive }) =>
                  clsx(
                    'hidden rounded-full px-3 py-2 text-sm font-semibold md:inline-flex',
                    isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
                  )
                }
              >
                Host dashboard
              </NavLink>
            ) : (
              <NavLink
                to="/host/listings/new"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-gray-100 md:inline-flex"
              >
                Become a host
              </NavLink>
            )}
            <button
              className="hidden rounded-full p-2 hover:bg-gray-100 md:inline-flex"
              aria-label="Language"
            >
              <Globe className="h-4 w-4" />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-gray-300 p-1 pl-3 shadow-sm hover:shadow-md"
                aria-haspopup="menu"
              >
                <Menu className="h-4 w-4" />
                <div className="grid h-7 w-7 place-items-center rounded-full bg-gray-700 text-xs font-semibold text-white">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="" className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                </div>
              </button>

              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                >
                  {isAuthenticated ? (
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      <div className="my-1 border-t border-gray-100" />
                      <MenuLink to="/trips" label="Trips" />
                      <MenuLink to="/wishlist" label="Wishlist" icon={<Heart className="h-4 w-4" />} />
                      <MenuLink to="/profile" label="Profile" />
                      <div className="my-1 border-t border-gray-100" />
                      {isHost && (
                        <MenuLink to="/host" label="Host dashboard" icon={<HomeIcon className="h-4 w-4" />} />
                      )}
                      <MenuLink to="/host/listings/new" label="List your home" />
                      {isAdmin && <MenuLink to="/admin" label="Admin" />}
                      <div className="my-1 border-t border-gray-100" />
                      <button
                        onClick={() => {
                          setOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <MenuLink to="/login" label="Log in" bold />
                      <MenuLink to="/register" label="Sign up" />
                      <div className="my-1 border-t border-gray-100" />
                      <MenuLink to="/host/listings/new" label="List your home" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pb-3">
          <SearchPill />
        </div>
      </div>
    </header>
  );
}

function MenuLink({ to, label, icon, bold }) {
  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100',
        bold && 'font-semibold'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
