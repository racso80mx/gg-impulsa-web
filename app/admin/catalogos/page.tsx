'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as XLSX from 'xlsx';

export default function AdminCatalogosPage() {
  const [catalogoActivo, setCatalogoActivo] = useState('tipo_inmuebles');
  const [datos, setDatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoSlug, setNuevoSlug] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Estados de ordenamiento
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Cargar datos al cambiar de catálogo
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/catalogos?tipo=${catalogoActivo}`);
      const json = await res.json();
      if (Array.isArray(json)) setDatos(json);
    } catch (error) {
      console.error('Error cargando catálogo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [catalogoActivo]);

  // Manejar ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Datos ordenados
  const datosOrdenados = [...datos].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Alta individual
  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    try {
      const res = await fetch('/api/admin/catalogos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: catalogoActivo,
          nombre: nuevoNombre,
          slug: nuevoSlug || undefined
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setNuevoNombre('');
        setNuevoSlug('');
        setMensaje('¡Elemento agregado con éxito!');
        cargarDatos();
      } else {
        setMensaje('Error: ' + json.error);
      }
    } catch (error) {
      setMensaje('Error de conexión');
    }
  };

  // Eliminar elemento
  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;
    try {
      const res = await fetch(`/api/admin/catalogos?tipo=${catalogoActivo}&id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        cargarDatos();
      } else {
        alert(data.error || 'No se pudo eliminar el registro.');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error de conexión al intentar eliminar.');
    }
  };

  // Descargar Plantilla en Excel
  const descargarPlantilla = () => {
    let plantillaData = [
      { nombre: 'Ejemplo Inmueble / Amenidad', slug: 'ejemplo-slug' }
    ];
    if (catalogoActivo === 'municipios') {
      plantillaData = [{ nombre: 'Ejemplo Municipio', entidad_id: 1 } as any];
    } else if (catalogoActivo === 'entidades_federativas') {
      plantillaData = [{ nombre: 'Tabasco', abreviatura: 'TAB' }];
    }

    const worksheet = XLSX.utils.json_to_sheet(plantillaData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla');
    XLSX.writeFile(workbook, `plantilla_${catalogoActivo}.xlsx`);
  };

  // Cargar y Procesar Archivo Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          alert('El archivo Excel está vacío.');
          return;
        }

        const res = await fetch('/api/admin/catalogos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accion: 'masivo',
            tipo: catalogoActivo,
            itemsMasivos: data
          })
        });

        const json = await res.json();
        if (res.ok && json.success) {
          alert('¡Importación masiva completada con éxito!');
          cargarDatos();
        } else {
          alert('Error al importar: ' + json.error);
        }
      } catch (error) {
        console.error('Error leyendo Excel:', error);
        alert('Error al procesar el archivo Excel.');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* HEADER */}
      <header className="bg-black text-white py-4 px-8 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="G Impulsa Logo" width={140} height={38} className="object-contain" priority />
          <span className="bg-[#C5A059] text-black text-xs font-bold px-3 py-1 rounded-full uppercase">Super Admin - Catálogos</span>
        </div>
        <Link href="/admin/propiedades/nuevo" className="text-sm text-gray-300 hover:text-white transition">
          &larr; Volver al CRM
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
          
          <h1 className="text-2xl font-black text-black mb-2 uppercase">Gestor de Catálogos del Sistema</h1>
          <p className="text-sm text-gray-600 mb-8">Administra los valores dinámicos que alimentan los formularios de registro de propiedades.</p>

          {/* SELECTOR DE CATÁLOGO */}
          <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-2 rounded-2xl">
            {[
              { id: 'tipo_inmuebles', label: 'Tipos de Inmueble' },
              { id: 'municipios', label: 'Municipios' },
              { id: 'amenidades', label: 'Amenidades / Espacios' },
              { id: 'entidades_federativas', label: 'Estados' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCatalogoActivo(cat.id)}
                className={`flex-1 min-w-[150px] py-3 px-4 text-xs font-bold rounded-xl transition shadow-sm ${catalogoActivo === cat.id ? 'bg-[#2E1A47] text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ACCIONES DE EXCEL (PLANTILLA Y CARGA MASIVA) */}
          <div className="bg-gray-50 p-6 rounded-2xl border mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Carga Masiva con Excel</h3>
              <p className="text-xs text-gray-500">Descarga la plantilla oficial, llénala y súbela para registrar múltiples elementos de golpe.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={descargarPlantilla}
                className="bg-green-700 text-white font-bold text-xs px-4 py-3 rounded-xl hover:bg-green-800 transition shadow"
              >
                📥 Descargar Plantilla
              </button>
              <label className="bg-[#2E1A47] text-white font-bold text-xs px-4 py-3 rounded-xl hover:bg-[#C5A059] hover:text-black transition shadow cursor-pointer text-center">
                📤 Subir Excel
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* FORMULARIO DE ALTA INDIVIDUAL */}
          <form onSubmit={handleCrear} className="flex gap-3 mb-8">
            <input 
              type="text" 
              required
              placeholder={`Nuevo nombre para ${catalogoActivo.replace('_', ' ')}...`}
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              className="flex-1 bg-gray-50 border rounded-xl p-3 text-sm"
            />
            <button 
              type="submit"
              className="bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-[#C5A059] hover:text-black transition text-sm shadow"
            >
              + Agregar Registro
            </button>
          </form>

          {mensaje && <div className="mb-6 p-3 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl">{mensaje}</div>}

          {/* TABLA DE REGISTROS CON ORDENAMIENTO */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs uppercase font-bold">
                  <th 
                    onClick={() => handleSort('id')} 
                    className="p-4 cursor-pointer hover:bg-gray-200 transition select-none"
                  >
                    ID {sortField === 'id' ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th 
                    onClick={() => handleSort('nombre')} 
                    className="p-4 cursor-pointer hover:bg-gray-200 transition select-none"
                  >
                    Nombre / Valor {sortField === 'nombre' ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  {catalogoActivo !== 'municipios' && (
                    <th 
                      onClick={() => handleSort(catalogoActivo === 'entidades_federativas' ? 'abreviatura' : 'slug')} 
                      className="p-4 cursor-pointer hover:bg-gray-200 transition select-none"
                    >
                      Slug / Código {sortField === (catalogoActivo === 'entidades_federativas' ? 'abreviatura' : 'slug') ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                    </th>
                  )}
                  {catalogoActivo === 'municipios' && (
                    <th 
                      onClick={() => handleSort('entidad_id')} 
                      className="p-4 cursor-pointer hover:bg-gray-200 transition select-none"
                    >
                      Entidad ID {sortField === 'entidad_id' ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                    </th>
                  )}
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-500">Cargando registros...</td></tr>
                ) : datosOrdenados.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-500">No hay registros en este catálogo.</td></tr>
                ) : (
                  datosOrdenados.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-gray-500">#{item.id}</td>
                      <td className="p-4 font-semibold text-gray-800">{item.nombre}</td>
                      {catalogoActivo !== 'municipios' && <td className="p-4 text-gray-600 font-mono text-xs">{item.slug || item.abreviatura}</td>}
                      {catalogoActivo === 'municipios' && <td className="p-4 text-gray-600 font-mono text-xs">{item.entidad_id}</td>}
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleEliminar(item.id)}
                          className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

    </div>
  );
}