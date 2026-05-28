import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const qc = useQueryClient();
  const bookingId = params.get('bookingId');

  useEffect(() => {
    qc.invalidateQueries({ queryKey: ['my-trips'] });
  }, [qc]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Booking confirmed!</h1>
      <p className="mt-2 text-gray-600">
        Your stay is booked. We sent the details to your account. View it in your trips.
      </p>
      {bookingId && (
        <p className="mt-1 text-xs text-gray-400">Booking ID: {bookingId}</p>
      )}
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/trips" className="btn-primary">
          View my trips
        </Link>
        <Link to="/" className="btn-outline">
          Keep browsing
        </Link>
      </div>
    </div>
  );
}
