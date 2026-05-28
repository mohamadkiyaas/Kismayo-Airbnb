import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import { loginSchema } from '../lib/zodSchemas.js';
import { extractError } from '../lib/api.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const from = params.get('from') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back!');
      navigate(from);
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card p-6">
        <h1 className="mb-1 text-2xl font-bold">Log in</h1>
        <p className="mb-6 text-sm text-gray-600">Welcome back to Kismayo Airbnb.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" autoComplete="email" {...register('email')} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Signing in…' : 'Log in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          New to Kismayo Airbnb?{' '}
          <Link to="/register" className="font-semibold text-brand-500 hover:underline">
            Create an account
          </Link>
        </p>
        <div className="mt-6 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          <div className="font-semibold">Try a demo account:</div>
          <div>guest@example.com / password123</div>
          <div>amina@example.com / password123 (host)</div>
          <div>admin@kismayo-airbnb.com / admin1234</div>
        </div>
      </div>
    </div>
  );
}
