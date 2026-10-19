'use client';

import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2E1A47] text-white flex flex-col">
        <div className="p-6 border-b border-purple-900">
          <h2 className="text-xl font-bold tracking-wider">G IMPULSA</h2>
          <p className="text-xs text-purple-300 mt-1">Panel de Administración</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block px-4 py-3 rounded-xl bg-[#C5A059] text-black font-semibold text-sm">Dashboard General</a>
          <a href="#" className="block px-4 py-3 rounded-xl hover:bg-purple-900/50 text-gray-300 text-sm transition">Gestión de Usuarios</a>
          <a href="#" className="block px-4 py-3 rounded-xl hover:bg-purple-900/50 text-gray-300 text-sm transition">Propiedades y Leads</a>
        </nav>
        <div className="p-4 border-t border-purple-900">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white py-3 rounded-xl text-sm font-semibold transition text-center"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Bienvenido, Administrador</h1>
            <p className="text-sm text-gray-500 mt-1">Aquí tienes el resumen operativo general del sistema.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-sm font-medium text-gray-700">
            🟢 MySQL Conectado (Local)
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-400">Usuarios Registrados</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">1</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-400">Propiedades Activas</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">0</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-400">Leads Nuevos</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">0</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Estado del Servidor</h3>
          <p className="text-sm text-gray-600">El sistema de autenticación conectado a Laragon responde correctamente a las peticiones del App Router de Next.js.</p>
        </div>
      </main>
    </div>
  );
}