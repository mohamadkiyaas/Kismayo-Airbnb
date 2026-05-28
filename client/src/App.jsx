import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Trips from './pages/Trips.jsx';
import Wishlist from './pages/Wishlist.jsx';
import HostDashboard from './pages/HostDashboard.jsx';
import HostListingForm from './pages/HostListingForm.jsx';
import Admin from './pages/Admin.jsx';
import CheckoutSuccess from './pages/CheckoutSuccess.jsx';
import CheckoutCancel from './pages/CheckoutCancel.jsx';
import ComingSoon from './pages/ComingSoon.jsx';
import NotFound from './pages/NotFound.jsx';
import { useAuthStore } from './store/auth.store.js';
import { api } from './lib/api.js';

export default function App() {
  const { accessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => logout());
  }, [accessToken, setUser, logout]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/host/listings/new" element={<HostListingForm />} />
          <Route path="/host/listings/:id/edit" element={<HostListingForm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route
            path="/experiences"
            element={
              <ComingSoon
                emoji="🎈"
                title="Experiences"
                description="Hot air balloon rides over Kismayo, dhow sailing in Lamu, safaris in the Mara — unforgettable activities led by local hosts."
              />
            }
          />
          <Route
            path="/services"
            element={
              <ComingSoon
                emoji="🛎️"
                title="Services"
                description="Private chefs, personal trainers, photographers and more — booked the same way you book a stay."
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
