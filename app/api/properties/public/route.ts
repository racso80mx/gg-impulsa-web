import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Consultar todas las propiedades registradas en el CRM de forma pública
    const [rows]: any = await pool.query(
      'SELECT id, title, description, operation_type, property_type, price, currency, location, municipality, state, lat, lng, total_area, built_area, bedrooms, bathrooms, images_json FROM properties ORDER BY id DESC'
    );

    // Asegurar que las imágenes JSON se parseen correctamente para el frontend
    const propiedadesFormateadas = rows.map((prop: any) => ({
      ...prop,
      images_json: typeof prop.images_json === 'string' ? JSON.parse(prop.images_json || '[]') : (prop.images_json || [])
    }));

    return NextResponse.json({ success: true, properties: propiedadesFormateadas });
  } catch (error) {
    console.error('Error al obtener propiedades públicas:', error);
    return NextResponse.json({ error: 'Error al cargar el inventario' }, { status: 500 });
  }
}