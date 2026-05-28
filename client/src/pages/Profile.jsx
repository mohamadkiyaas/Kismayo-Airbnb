import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRequireAuth, useAuth } from '../hooks/useAuth.js';
import { profileSchema } from '../lib/zodSchemas.js';
import { api, extractError } from '../lib/api.js';
import { useAuthStore } from '../store/auth.store.js';

export default function Profile() {
  useRequireAuth();
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', bio: user?.bio || '' },
  });

  if (!user) return null;

  const onSubmit = async (values) => {
    try {
      const { data } = await api.patch('/auth/me', values);
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  const onAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('files', file);
      const { data } = await api.post('/uploads', form);
      const avatar = data.data[0];
      const res = await api.patch('/auth/me', { avatar });
      setUser(res.data.user);
      toast.success('Avatar updated');
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setUploading(false);
    }
  };

  const becomeHost = async () => {
    try {
      const { data } = await api.patch('/auth/me', { role: 'host' });
      setUser(data.user);
      toast.success('You are now a host! Visit your dashboard.');
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <div className="card mb-6 flex items-center gap-4 p-6">
        <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-gray-200 text-xl font-semibold">
          {user.avatar?.url ? (
            <img src={user.avatar.url} className="h-full w-full object-cover" alt="" />
          ) : (
            user.name?.[0]
          )}
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">Role: {user.role}</div>
        </div>
        <label className="btn-outline cursor-pointer">
          {uploading ? 'Uploading…' : 'Change photo'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatar}
            disabled={uploading}
          />
        </label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div>
          <label className="label">Name</label>
          <input className="input" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea className="input" rows={4} {...register('bio')} />
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      {user.role === 'guest' && (
        <div className="card mt-6 p-6">
          <h2 className="text-lg font-semibold">Become a host</h2>
          <p className="mt-1 text-sm text-gray-600">
            Earn money by sharing your space. You'll get access to the host dashboard.
          </p>
          <button onClick={becomeHost} className="btn-primary mt-3">
            Switch to host
          </button>
        </div>
      )}
    </div>
  );
}
