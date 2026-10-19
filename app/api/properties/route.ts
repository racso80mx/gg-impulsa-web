import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const soloMias = searchParams.get('solo_mias');
    const user = getCurrentUser();

    let query = 'SELECT * FROM properties';
    let params: any[] = [];

    // Si el usuario es vendedor y filtra sus propiedades, o si queremos restringir en panel
    if (user.role === 'vendedor' || soloMias === 'true') {
      query += ' WHERE user_id = ?';
      params.push(user.id);
    }

    query += ' ORDER BY id DESC';

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    return NextResponse.json({ error: 'Error al consultar la base de datos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUser();
    
    // Validación de seguridad de roles
    if (!user || (user.role !== 'super_admin' && user.role !== 'vendedor')) {
      return NextResponse.json({ error: 'No autorizado para registrar propiedades' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title, description, operation_type, property_type, price, currency,
      maintenance_fee, maintenance_included, country, state, municipality,
      location, street_address, postal_code, hide_exact_address,
      lat, lng, total_area, built_area, bedrooms, bathrooms, half_bathrooms,
      parking_spots, property_condition, floor_number, total_floors,
      amenities, images_json, video_url, virtual_tour_url,
      min_contract_term, required_guarantees, pet_policy, furnished_status,
      internal_code, legal_status, commission_details, owner_name, owner_phone, owner_email
    } = body;

    const query = `
      INSERT INTO properties (
        title, description, operation_type, property_type, price, currency,
        maintenance_fee, maintenance_included, country, state, municipality,
        location, street_address, postal_code, hide_exact_address,
        lat, lng, total_area, built_area, bedrooms, bathrooms, half_bathrooms,
        parking_spots, property_condition, floor_number, total_floors,
        amenities, images_json, video_url, virtual_tour_url,
        min_contract_term, required_guarantees, pet_policy, furnished_status,
        internal_code, legal_status, commission_details, owner_name, owner_phone, owner_email, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result]: any = await pool.query(query, [
      title, description || '', operation_type || 'venta', property_type || 'casa', price || 0, currency || 'MXN',
      maintenance_fee || 0, maintenance_included ? 1 : 0, country || 'México', state || 'Tabasco', municipality || '',
      location || '', street_address || '', postal_code || '', hide_exact_address ? 1 : 0,
      lat || 17.9892, lng || -92.9283, total_area || 0, built_area || 0, bedrooms || 0, bathrooms || 0, half_bathrooms || 0,
      parking_spots || 0, property_condition || 'A estrenar', floor_number || 0, total_floors || 0,
      JSON.stringify(amenities || []), JSON.stringify(images_json || []), video_url || '', virtual_tour_url || '',
      min_contract_term || '1 año', required_guarantees || '', pet_policy || 'No acepta', furnished_status || 'Sin amueblar',
      internal_code || '', legal_status || '', commission_details || '', owner_name || '', owner_phone || '', owner_email || '',
      user.id
    ]);

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error al guardar propiedad:', error);
    return NextResponse.json({ error: 'Error al guardar la propiedad en MySQL' }, { status: 500 });
  }
}