import { Link } from 'react-router-dom';

export default function ComingSoon({ title, emoji, description }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <div className="text-7xl">{emoji}</div>
      <h1 className="mt-4 text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-gray-600">{description}</p>
      <span className="mt-4 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700">
        Coming soon
      </span>
      <Link to="/" className="mt-6 inline-flex items-center text-brand-500 underline">
        ← Back to Homes
      </Link>
    </div>
  );
}
