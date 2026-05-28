import { Link, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function CheckoutCancel() {
  const [params] = useSearchParams();
  const bookingId = params.get('bookingId');

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-amber-700">
        <XCircle className="h-8 w-8" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Payment cancelled</h1>
      <p className="mt-2 text-gray-600">
        Your booking is saved as pending. You can retry payment from your trips at any time.
      </p>
      {bookingId && <p className="mt-1 text-xs text-gray-400">Booking ID: {bookingId}</p>}
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/trips" className="btn-primary">
          Go to trips
        </Link>
        <Link to="/" className="btn-outline">
          Back home
        </Link>
      </div>
    </div>
  );
}
