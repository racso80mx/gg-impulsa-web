'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/propiedades/nuevo');
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4 font-sans">
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src="/logo.png" alt="G Impulsa Logo" width={180} height={50} className="object-contain mx-auto" priority />
          </Link>
          <h2 className="text-2xl font-black text-gray-900 uppercase">Portal Staff CRM</h2>
          <p className="text-sm text-gray-500 mt-1">Inicia sesión con tu cuenta autorizada</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5" suppressHydrationWarning>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              placeholder="admin@ggimpulsa.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-[#2E1A47]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contraseña</label>
            <div className="relative" suppressHydrationWarning>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-[#2E1A47] pr-16"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 px-2.5 py-1 rounded-lg transition"
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2E1A47] text-white font-bold py-4 rounded-xl hover:bg-[#C5A059] hover:text-black transition shadow-lg text-sm tracking-wider uppercase mt-2"
          >
            {loading ? 'Validando acceso...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          <p>Credenciales de prueba predeterminadas:</p>
          <p className="font-semibold text-gray-700 mt-1">Admin: admin@ggimpulsa.com / admin123</p>
          <p className="font-semibold text-gray-700">Vendedor: carlos@ggimpulsa.com / vendedor123</p>
        </div>
      </div>

    </div>
  );
}