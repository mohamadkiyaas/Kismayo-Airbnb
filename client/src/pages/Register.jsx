import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import { registerSchema } from '../lib/zodSchemas.js';
import { extractError } from '../lib/api.js';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { role: 'guest' } });

  const onSubmit = async (values) => {
    try {
      const { confirmPassword: _c, ...rest } = values;
      await registerUser(rest);
      toast.success('Welcome to Kismayo Airbnb!');
      navigate('/');
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card p-6">
        <h1 className="mb-1 text-2xl font-bold">Create your account</h1>
        <p className="mb-6 text-sm text-gray-600">Find homes you love around the world.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" autoComplete="email" {...register('email')} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                autoComplete="new-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="label">Confirm</label>
              <input
                type="password"
                className="input"
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="label">I want to</label>
            <select className="input" {...register('role')}>
              <option value="guest">Book stays as a guest</option>
              <option value="host">Host my home</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
