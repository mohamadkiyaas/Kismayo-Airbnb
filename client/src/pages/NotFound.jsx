import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid place-items-center py-20 text-center">
      <div>
        <div className="text-6xl">🧭</div>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-4 inline-block text-brand-500 underline">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
