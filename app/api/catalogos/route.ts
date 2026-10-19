import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [tipos]: any = await pool.query('SELECT * FROM tipo_inmuebles');
    const [entidades]: any = await pool.query('SELECT * FROM entidades_federativas');
    const [municipios]: any = await pool.query('SELECT * FROM municipios');

    return NextResponse.json({
      tipos,
      entidades,
      municipios
    });
  } catch (error) {
    console.error('Error al obtener catálogos:', error);
    return NextResponse.json({ error: 'Error al obtener catálogos' }, { status: 500 });
  }
}