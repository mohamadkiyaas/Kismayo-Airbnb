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
          <Link to="/" className="flex items-center gap-2 text-brand-500">
            <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden>
              <path d="M16 3c-.7 0-1.4.4-1.7 1l-9 16c-1.4 2.5.4 5.5 3.3 5.5h15c2.9 0 4.7-3 3.3-5.5l-9-16C17.4 3.4 16.7 3 16 3zm0 4.1L24 21H8l8-13.9z" />
            </svg>
            <span className="hidden text-xl font-extrabold tracking-tight md:inline">
              kismayo<span className="text-gray-900">airbnb</span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
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
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.label}</span>
                    {t.badge && (
                      <span className="rounded-full bg-blue-100 px-1.5 text-[10px] font-bold uppercase text-blue-700">
                        {t.badge}
                      </span>
                    )}
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
