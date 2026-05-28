import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../lib/api.js';

export default function Reviews({ listingId }) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', listingId],
    queryFn: async () => (await api.get(`/listings/${listingId}/reviews`)).data.data,
  });

  if (isLoading) return <div className="text-gray-500">Loading reviews…</div>;
  if (!reviews.length) return <div className="text-gray-500">No reviews yet — be the first!</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {reviews.map((r) => (
        <article key={r._id} className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-200 text-sm font-semibold">
              {r.author?.avatar?.url ? (
                <img src={r.author.avatar.url} className="h-10 w-10 rounded-full object-cover" alt="" />
              ) : (
                r.author?.name?.[0] || '?'
              )}
            </div>
            <div>
              <div className="font-semibold">{r.author?.name || 'Anonymous'}</div>
              <div className="text-xs text-gray-500">
                {format(new Date(r.createdAt), 'MMMM yyyy')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{r.comment}</p>
        </article>
      ))}
    </div>
  );
}
