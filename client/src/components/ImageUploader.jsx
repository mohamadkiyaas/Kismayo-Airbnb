import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, extractError } from '../lib/api.js';

export default function ImageUploader({ value = [], onChange, max = 12 }) {
  const [uploading, setUploading] = useState(false);

  const upload = async (files) => {
    if (!files?.length) return;
    if (value.length + files.length > max) {
      toast.error(`You can upload up to ${max} images`);
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append('files', f));
      const { data } = await api.post('/uploads', form);
      onChange([...value, ...data.data]);
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((img, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
              aria-label="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-50">
            <div className="text-center text-xs">
              <Upload className="mx-auto h-5 w-5" />
              <div className="mt-1">{uploading ? 'Uploading…' : 'Add photos'}</div>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => upload(e.target.files)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
