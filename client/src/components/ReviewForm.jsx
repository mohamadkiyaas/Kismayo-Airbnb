import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { reviewSchema } from '../lib/zodSchemas.js';
import { api, extractError } from '../lib/api.js';

export default function ReviewForm({ bookingId, onSubmitted }) {
  const [hover, setHover] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 5, comment: '' } });
  const rating = watch('rating');

  const onSubmit = async (values) => {
    try {
      await api.post('/reviews', { booking: bookingId, ...values });
      toast.success('Review submitted');
      reset();
      onSubmitted?.();
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-xl border border-gray-200 p-4">
      <div>
        <div className="label">Your rating</div>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const filled = (hover || rating) >= value;
            return (
              <button
                key={value}
                type="button"
                onMouseEnter={() => setHover(value)}
                onClick={() => setValue('rating', value)}
                className="rounded p-0.5"
                aria-label={`${value} stars`}
              >
                <Star className={clsx('h-6 w-6', filled ? 'fill-current text-yellow-500' : 'text-gray-300')} />
              </button>
            );
          })}
        </div>
        <input type="hidden" {...register('rating', { valueAsNumber: true })} />
      </div>
      <div>
        <label className="label">Your review</label>
        <textarea
          className="input"
          rows={3}
          placeholder="Share details of your experience…"
          {...register('comment')}
        />
        {errors.comment && <p className="mt-1 text-xs text-red-600">{errors.comment.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
