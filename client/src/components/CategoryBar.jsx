import clsx from 'clsx';
import { CATEGORIES } from '../lib/constants.js';

export default function CategoryBar({ value, onChange }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 py-3 md:mx-0 md:px-0">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={clsx(
          'flex shrink-0 flex-col items-center gap-1 border-b-2 pb-2 text-xs font-semibold text-gray-500 transition',
          !value ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-800'
        )}
      >
        <span className="text-2xl">🌍</span>
        <span>All</span>
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id === value ? undefined : c.id)}
          className={clsx(
            'flex shrink-0 flex-col items-center gap-1 border-b-2 pb-2 text-xs font-semibold transition',
            value === c.id
              ? 'border-gray-900 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          )}
        >
          <span className="text-2xl">{c.icon}</span>
          <span>{c.label}</span>
        </button>
      ))}
    </div>
  );
}
