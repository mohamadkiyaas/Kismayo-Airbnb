import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRequireAuth } from '../hooks/useAuth.js';
import { listingFormSchema } from '../lib/zodSchemas.js';
import { api, extractError } from '../lib/api.js';
import { AMENITIES, CATEGORIES, PROPERTY_TYPES } from '../lib/constants.js';
import ImageUploader from '../components/ImageUploader.jsx';
import LocationPicker from '../components/LocationPicker.jsx';

export default function HostListingForm() {
  useRequireAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: existing } = useQuery({
    queryKey: ['listing-edit', id],
    queryFn: async () => (await api.get(`/listings/${id}`)).data.data,
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      type: 'apartment',
      category: 'city',
      country: '',
      city: '',
      address: '',
      lat: '',
      lng: '',
      pricePerNight: 100,
      bedrooms: 1,
      beds: 1,
      baths: 1,
      maxGuests: 2,
      amenities: [],
      images: [],
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        type: existing.type,
        category: existing.category,
        country: existing.location.country,
        city: existing.location.city,
        address: existing.location.address || '',
        lat: existing.location.coordinates?.coordinates?.[1] ?? '',
        lng: existing.location.coordinates?.coordinates?.[0] ?? '',
        pricePerNight: existing.pricePerNight,
        bedrooms: existing.bedrooms,
        beds: existing.beds,
        baths: existing.baths,
        maxGuests: existing.maxGuests,
        amenities: existing.amenities || [],
        images: existing.images || [],
      });
    }
  }, [existing, reset]);

  const images = watch('images');
  const amenities = watch('amenities');
  const lat = watch('lat');
  const lng = watch('lng');

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      type: values.type,
      category: values.category,
      location: {
        country: values.country,
        city: values.city,
        address: values.address,
        coordinates: { type: 'Point', coordinates: [Number(values.lng), Number(values.lat)] },
      },
      pricePerNight: Number(values.pricePerNight),
      bedrooms: Number(values.bedrooms),
      beds: Number(values.beds),
      baths: Number(values.baths),
      maxGuests: Number(values.maxGuests),
      amenities: values.amenities,
      images: values.images,
    };
    try {
      if (isEdit) {
        await api.patch(`/listings/${id}`, payload);
        toast.success('Listing updated');
      } else {
        await api.post('/listings', payload);
        toast.success('Listing created');
      }
      navigate('/host');
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{isEdit ? 'Edit listing' : 'Create a new listing'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Basics</h2>
          <div>
            <label className="label">Title</label>
            <input className="input" {...register('title')} />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={5} className="input" {...register('description')} />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Property type</label>
              <select className="input" {...register('type')}>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" {...register('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Location</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Country</label>
              <input className="input" {...register('country')} />
              {errors.country && (
                <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
              )}
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" {...register('city')} />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>}
            </div>
          </div>
          <div>
            <label className="label">Address (optional)</label>
            <input className="input" {...register('address')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Latitude</label>
              <input type="number" step="any" className="input" {...register('lat')} />
            </div>
            <div>
              <label className="label">Longitude</label>
              <input type="number" step="any" className="input" {...register('lng')} />
            </div>
          </div>
          <div>
            <div className="label">Click the map to set the location</div>
            <LocationPicker
              lat={lat}
              lng={lng}
              onPick={(la, ln) => {
                setValue('lat', la);
                setValue('lng', ln);
              }}
            />
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Capacity & pricing</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <div>
              <label className="label">Bedrooms</label>
              <input type="number" min="0" className="input" {...register('bedrooms')} />
            </div>
            <div>
              <label className="label">Beds</label>
              <input type="number" min="0" className="input" {...register('beds')} />
            </div>
            <div>
              <label className="label">Baths</label>
              <input type="number" min="0" step="0.5" className="input" {...register('baths')} />
            </div>
            <div>
              <label className="label">Max guests</label>
              <input type="number" min="1" className="input" {...register('maxGuests')} />
            </div>
            <div>
              <label className="label">Price / night (USD)</label>
              <input type="number" min="1" className="input" {...register('pricePerNight')} />
              {errors.pricePerNight && (
                <p className="mt-1 text-xs text-red-600">{errors.pricePerNight.message}</p>
              )}
            </div>
          </div>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-semibold">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => {
              const active = amenities.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() =>
                    setValue(
                      'amenities',
                      active ? amenities.filter((x) => x !== a.id) : [...amenities, a.id]
                    )
                  }
                  className={`chip ${active ? 'chip-active' : ''}`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-semibold">Photos</h2>
          <ImageUploader value={images} onChange={(imgs) => setValue('images', imgs)} />
          {errors.images && <p className="text-xs text-red-600">{errors.images.message}</p>}
        </section>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate('/host')} className="btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Publish listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
