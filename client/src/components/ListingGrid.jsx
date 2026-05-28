import ListingCard from './ListingCard.jsx';

export default function ListingGrid({ listings, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[1/1] animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }
  if (!listings?.length) {
    return (
      <div className="grid place-items-center py-20 text-center text-gray-500">
        <div>
          <div className="text-2xl">😔</div>
          <p className="mt-2 font-semibold">No homes match your search</p>
          <p className="text-sm">Try changing your dates or removing filters.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {listings.map((l) => (
        <ListingCard key={l._id} listing={l} />
      ))}
    </div>
  );
}
