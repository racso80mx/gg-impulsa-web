'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { ssr: false });

export default function NuevaPropiedadCompletaPage() {
  const router = useRouter();
  const [catalogos, setCatalogos] = useState<{ tipos: any[], entidades: any[], municipios: any[] }>({
    tipos: [], entidades: [], municipios: []
  });

  const [formData, setFormData] = useState({
    title: '', description: '', operation_type: 'venta', property_type: 'casa',
    price: '', currency: 'MXN', maintenance_fee: '0', maintenance_included: false,
    country: 'México', state: 'Tabasco', municipality: '', location: '',
    street_address: '', postal_code: '', hide_exact_address: false,
    lat: 17.9892, lng: -92.9283, total_area: '', built_area: '',
    bedrooms: '0', bathrooms: '0', half_bathrooms: '0', parking_spots: '0',
    property_condition: 'A estrenar', floor_number: '0', total_floors: '0',
    amenities: [] as string[],
    images_url_input: '',
    images_json: [] as string[],
    video_url: '', virtual_tour_url: '',
    min_contract_term: '1 año', required_guarantees: '', pet_policy: 'No acepta', furnished_status: 'Sin amueblar',
    internal_code: '', legal_status: '', commission_details: '', owner_name: '', owner_phone: '', owner_email: ''
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('/api/catalogos')
      .then((res) => res.json())
      .then((data) => { if (data.tipos) setCatalogos(data); })
      .catch((err) => console.error('Error cargando catálogos:', err));
  }, []);

  const handleAmenityToggle = (amenity: string) => {
    const exists = formData.amenities.includes(amenity);
    if (exists) {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  const handleAddImage = () => {
    if (formData.images_url_input.trim()) {
      setFormData({
        ...formData,
        images_json: [...formData.images_json, formData.images_url_input.trim()],
        images_url_input: ''
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images_json: formData.images_json.filter((_, i) => i !== index)
    });
  };

// Función para actualizar coordenadas y consultar automáticamente la dirección postal
  const handlePositionChange = async (newLat: number, newLng: number) => {
    const latFixed = Number(newLat.toFixed(6));
    const lngFixed = Number(newLng.toFixed(6));

    setFormData(prev => ({
      ...prev,
      lat: latFixed,
      lng: lngFixed
    }));

    try {
      // Usar el servicio público y gratuito de Nominatim (OpenStreetMap) para Geocodificación Inversa
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latFixed}&lon=${lngFixed}&zoom=18&addressdetails=1`);
      const data = await res.json();

      if (data && data.address) {
        const addr = data.address;
        
        // Extraer los componentes de la dirección de manera inteligente
        const calle = addr.road || addr.pedestrian || addr.suburb || '';
        const numero = addr.house_number ? `#${addr.house_number}` : '';
        const streetAddressClean = `${calle} ${numero}`.trim();
        
        const coloniaClean = addr.neighbourhood || addr.suburb || addr.residential || addr.hamlet || '';
        const municipioClean = addr.municipality || addr.city || addr.town || addr.county || '';
        const cpClean = addr.postcode || '';

        setFormData(prev => ({
          ...prev,
          street_address: streetAddressClean || prev.street_address,
          location: coloniaClean || prev.location,
          municipality: municipioClean || prev.municipality,
          postal_code: cpClean || prev.postal_code,
          state: addr.state || 'Tabasco',
          country: addr.country || 'México'
        }));
      }
    } catch (error) {
      console.error('Error al obtener la dirección por geocodificación:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMensaje('¡Inmueble registrado y publicado con éxito!');
        setTimeout(() => router.push('/propiedades'), 1500);
      } else {
        setMensaje('Error al registrar: ' + (data.error || ''));
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const listAmenidades = [
    'Cocina Integral', 'Cocina Equipada', 'Sala y Comedor Independientes',
    'Cuarto de Servicio', 'Área de Lavado', 'Estudio / Home Office',
    'Family Room / Sala TV', 'Bodega Privada', 'Walk-in Closet',
    'Balcón', 'Terraza', 'Jardín Privado', 'Alberca'
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* HEADER */}
      <header className="bg-black text-white py-4 px-8 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Image src="/logo.png" alt="G Impulsa Logo" width={140} height={38} className="object-contain" priority />
          <span className="bg-[#C5A059] text-black text-xs font-bold px-3 py-1 rounded-full uppercase">CRM Inmobiliario</span>
        </div>
        <Link href="/propiedades" className="text-sm text-gray-300 hover:text-white transition">
          Ver Mapa &rarr;
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200">
          
          <h1 className="text-3xl font-black text-black mb-2 uppercase">Alta de Propiedad / Inmueble</h1>
          <p className="text-sm text-gray-600 mb-8">Sistema completo de registro con geolocalización interactiva, catálogos y contenido multimedia.</p>

          {mensaje && (
            <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${mensaje.includes('éxito') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* 1. INFORMACIÓN BÁSICA Y OPERACIÓN */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2E1A47] border-b pb-2">1. Información Básica y de Operación</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Título del Anuncio *</label>
                  <input type="text" required placeholder="Ej. Casa Residencial en Renta en Tabasco 2000" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Operación *</label>
                  <select value={formData.operation_type} onChange={e => setFormData({...formData, operation_type: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3">
                    <option value="venta">Venta</option>
                    <option value="renta">Renta</option>
                    <option value="renta_temporal">Renta Temporal</option>
                    <option value="traspaso">Traspaso</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Inmueble *</label>
                  <select value={formData.property_type} onChange={e => setFormData({...formData, property_type: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3">
                    {catalogos.tipos.map(t => <option key={t.id} value={t.slug}>{t.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Divisa</label>
                  <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3">
                    <option value="MXN">MXN ($)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio Principal *</label>
                  <input type="number" required placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cuota Mantenimiento</label>
                  <input type="number" placeholder="0.00" value={formData.maintenance_fee} onChange={e => setFormData({...formData, maintenance_fee: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
              </div>
            </div>

            {/* 2. UBICACIÓN EXACTA Y MAPA INTERACTIVO */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2E1A47] border-b pb-2">2. Ubicación y Geolocalización Interactiva</h3>
              <p className="text-xs text-gray-500">💡 <strong>Tip:</strong> Puedes arrastrar el marcador en el mapa o hacer clic en cualquier punto para ubicar con precisión el inmueble.</p>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Municipio *</label>
                  <select value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3">
                    <option value="">Selecciona Municipio</option>
                    {catalogos.municipios.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Colonia / Barrio</label>
                  <input type="text" placeholder="Ej. Fracc. Carrizal" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Código Postal</label>
                  <input type="text" placeholder="86038" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Calle y Número Exterior</label>
                  <input type="text" placeholder="Av. Paseo Usumacinta #405" value={formData.street_address} onChange={e => setFormData({...formData, street_address: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={formData.hide_exact_address} onChange={e => setFormData({...formData, hide_exact_address: e.target.checked})} className="w-5 h-5 accent-[#2E1A47]" />
                    <span className="text-sm font-medium text-gray-700">Ocultar dirección exacta en el portal público</span>
                  </label>
                </div>
              </div>

              {/* Mapa interactivo con pin arrastrable */}
              <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Latitud (Automática)</label>
                  <input 
                    type="number" 
                    step="any"
                    value={formData.lat} 
                    onChange={e => setFormData({...formData, lat: parseFloat(e.target.value) || 0})} 
                    className="w-full bg-white border rounded-xl p-2.5 text-sm font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Longitud (Automática)</label>
                  <input 
                    type="number" 
                    step="any"
                    value={formData.lng} 
                    onChange={e => setFormData({...formData, lng: parseFloat(e.target.value) || 0})} 
                    className="w-full bg-white border rounded-xl p-2.5 text-sm font-mono" 
                  />
                </div>
                <div className="md:col-span-2 h-[300px] rounded-xl overflow-hidden mt-2 border shadow-inner">
                  <PropertyMap 
                    properties={[{ id: 999, title: 'Arrastra el pin a la ubicación exacta', price: 0, location: formData.location || 'Tabasco', lat: formData.lat, lng: formData.lng }]} 
                    draggable={true}
                    onPositionChange={handlePositionChange}
                  />
                </div>
              </div>
            </div>

            {/* 3. CARACTERÍSTICAS FÍSICAS Y DIMENSIONES */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2E1A47] border-b pb-2">3. Características Físicas y Dimensiones</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sup. Total (m²)</label>
                  <input type="number" placeholder="250" value={formData.total_area} onChange={e => setFormData({...formData, total_area: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sup. Construida (m²)</label>
                  <input type="number" placeholder="180" value={formData.built_area} onChange={e => setFormData({...formData, built_area: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Recámaras</label>
                  <input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Baños Completos</label>
                  <input type="number" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Medios Baños</label>
                  <input type="number" value={formData.half_bathrooms} onChange={e => setFormData({...formData, half_bathrooms: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Estacionamientos</label>
                  <input type="number" value={formData.parking_spots} onChange={e => setFormData({...formData, parking_spots: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Antigüedad / Condición</label>
                  <select value={formData.property_condition} onChange={e => setFormData({...formData, property_condition: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3">
                    <option value="A estrenar">A estrenar / Preventa</option>
                    <option value="1 a 5 años">1 a 5 años</option>
                    <option value="5 a 10 años">5 a 10 años</option>
                    <option value="Más de 20 años">Más de 20 años</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Piso / Niveles</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Piso" value={formData.floor_number} onChange={e => setFormData({...formData, floor_number: e.target.value})} className="w-1/2 bg-gray-50 border rounded-xl p-3 text-sm" />
                    <input type="number" placeholder="Total" value={formData.total_floors} onChange={e => setFormData({...formData, total_floors: e.target.value})} className="w-1/2 bg-gray-50 border rounded-xl p-3 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. AMENIDADES Y DISTRIBUCIÓN */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2E1A47] border-b pb-2">4. Distribución y Espacios Internos</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {listAmenidades.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border cursor-pointer hover:bg-gray-100 transition">
                    <input 
                      type="checkbox" 
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 accent-[#2E1A47]"
                    />
                    <span className="text-sm font-medium text-gray-800">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. CONTENIDO MULTIMEDIA (N - FOTOS) */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2E1A47] border-b pb-2">5. Contenido Multimedia (Galería de Imágenes)</h3>
              
              <div className="flex gap-2">
                <input 
                  type="url" 
                  placeholder="Pega la URL de la imagen (ej. https://.../foto1.jpg)"
                  value={formData.images_url_input}
                  onChange={e => setFormData({...formData, images_url_input: e.target.value})}
                  className="flex-1 bg-gray-50 border rounded-xl p-3 text-sm"
                />
                <button type="button" onClick={handleAddImage} className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-[#C5A059] hover:text-black transition">
                  Agregar Imagen
                </button>
              </div>

              {/* Vista previa de imágenes agregadas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {formData.images_json.map((img, idx) => (
                  <div key={idx} className="relative group bg-gray-100 rounded-xl overflow-hidden border h-32 flex items-center justify-center">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 text-xs font-bold flex items-center justify-center shadow hover:bg-red-700">
                      ✕
                    </button>
                    {idx === 0 && <span className="absolute bottom-2 left-2 bg-[#C5A059] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">Portada</span>}
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Enlace de Video (YouTube / Vimeo)</label>
                  <input type="url" placeholder="https://youtube.com/..." value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Recorrido Virtual 360° (Matterport / Link)</label>
                  <input type="url" placeholder="https://..." value={formData.virtual_tour_url} onChange={e => setFormData({...formData, virtual_tour_url: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
              </div>
            </div>

            {/* 6. DESCRIPCIÓN Y COPYWRITING */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2E1A47] border-b pb-2">6. Descripción Textual</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción detallada del inmueble</label>
                <textarea 
                  rows={5}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe las bondades de la propiedad..."
                  className="w-full bg-gray-50 border rounded-xl p-3 text-sm"
                ></textarea>
              </div>
            </div>

            {/* 7. CONDICIONES DE RENTA */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2E1A47] border-b pb-2">7. Datos Específicos para Rentas</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Plazo Mínimo</label>
                  <input type="text" placeholder="Ej. 1 año" value={formData.min_contract_term} onChange={e => setFormData({...formData, min_contract_term: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Garantías Requeridas</label>
                  <input type="text" placeholder="Aval / Póliza jurídica" value={formData.required_guarantees} onChange={e => setFormData({...formData, required_guarantees: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Política de Mascotas</label>
                  <select value={formData.pet_policy} onChange={e => setFormData({...formData, pet_policy: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3">
                    <option value="No acepta">No acepta</option>
                    <option value="Acepta mascotas">Acepta mascotas</option>
                    <option value="Solo pequeñas">Solo mascotas pequeñas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Amueblado</label>
                  <select value={formData.furnished_status} onChange={e => setFormData({...formData, furnished_status: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-3">
                    <option value="Sin amueblar">Sin amueblar</option>
                    <option value="Semi-amueblado">Semi-amueblado</option>
                    <option value="Amueblado">Amueblado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 8. DATOS ADMINISTRATIVOS INTERNOS (CRM) */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border">
              <h3 className="text-lg font-bold text-[#2E1A47] border-b pb-2">8. Datos Administrativos e Internos (Confidencial CRM)</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Clave Interna / ID</label>
                  <input type="text" placeholder="PROP-001" value={formData.internal_code} onChange={e => setFormData({...formData, internal_code: e.target.value})} className="w-full bg-white border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Comisión Acordada</label>
                  <input type="text" placeholder="5% o monto fijo" value={formData.commission_details} onChange={e => setFormData({...formData, commission_details: e.target.value})} className="w-full bg-white border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Propietario</label>
                  <input type="text" placeholder="Nombre completo" value={formData.owner_name} onChange={e => setFormData({...formData, owner_name: e.target.value})} className="w-full bg-white border rounded-xl p-3" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono Propietario</label>
                  <input type="tel" placeholder="993..." value={formData.owner_phone} onChange={e => setFormData({...formData, owner_phone: e.target.value})} className="w-full bg-white border rounded-xl p-3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Propietario</label>
                  <input type="email" placeholder="correo@..." value={formData.owner_email} onChange={e => setFormData({...formData, owner_email: e.target.value})} className="w-full bg-white border rounded-xl p-3" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#2E1A47] text-white font-bold py-4 rounded-2xl hover:bg-[#C5A059] hover:text-black transition shadow-xl text-lg"
            >
              {loading ? 'Guardando en Base de Datos...' : 'Guardar y Publicar Inmueble Completo'}
            </button>

          </form>

        </div>
      </main>

    </div>
  );
}