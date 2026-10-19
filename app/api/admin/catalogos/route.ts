import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET: Obtener elementos de un catálogo específico
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo'); // ej. 'tipo_inmuebles', 'municipios', 'amenidades', 'entidades_federativas'

    if (!tipo) {
      return NextResponse.json({ error: 'Tipo de catálogo no especificado' }, { status: 400 });
    }

    // Validar tabla permitida para seguridad
    const tablasPermitidas = ['tipo_inmuebles', 'municipios', 'entidades_federativas', 'amenidades'];
    if (!tablasPermitidas.includes(tipo)) {
      return NextResponse.json({ error: 'Catálogo no válido' }, { status: 400 });
    }

    const [rows] = await pool.query(`SELECT * FROM ${tipo} ORDER BY id DESC`);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error al obtener catálogo:', error);
    return NextResponse.json({ error: 'Error al consultar la base de datos' }, { status: 500 });
  }
}

// POST: Agregar un elemento o procesar importación masiva
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'No autorizado. Se requiere rol de Super Administrador.' }, { status: 403 });
    }

    const body = await request.json();
    const { accion, tipo, nombre, slug, entidad_id, itemsMasivos } = body;

    const tablasPermitidas = ['tipo_inmuebles', 'municipios', 'entidades_federativas', 'amenidades'];
    if (!tablasPermitidas.includes(tipo)) {
      return NextResponse.json({ error: 'Catálogo no válido' }, { status: 400 });
    }

    // ACCIÓN 1: Importación masiva desde Excel
    if (accion === 'masivo' && Array.isArray(itemsMasivos)) {
      for (const item of itemsMasivos) {
        if (tipo === 'tipo_inmuebles' || tipo === 'amenidades') {
          await pool.query(
            `INSERT INTO ${tipo} (id, nombre, slug) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), slug = VALUES(slug)`,
            [
              item.id || null,
              item.nombre, 
              item.slug || item.nombre.toLowerCase().replace(/[\s\/]+/g, '-')
            ]
          );
        } else if (tipo === 'municipios') {
          await pool.query(
            `INSERT INTO municipios (id, entidad_id, nombre) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE entidad_id = VALUES(entidad_id), nombre = VALUES(nombre)`,
            [
              item.id || null,
              item.entidad_id || 1, 
              item.nombre
            ]
          );
        } else if (tipo === 'entidades_federativas') {
          await pool.query(
            `INSERT INTO entidades_federativas (id, nombre, abreviatura) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), abreviatura = VALUES(abreviatura)`,
            [
              item.id || null, 
              item.nombre, 
              item.abreviatura || item.slug || 'TAB'
            ]
          );
        }
      }
      return NextResponse.json({ success: true, mensaje: 'Importación masiva exitosa' });
    }

    // ACCIÓN 2: Alta individual
    if (tipo === 'tipo_inmuebles' || tipo === 'amenidades') {
      const generatedSlug = slug || nombre.toLowerCase().replace(/[\s\/]+/g, '-');
      await pool.query(`INSERT INTO ${tipo} (nombre, slug) VALUES (?, ?)`, [nombre, generatedSlug]);
    } else if (tipo === 'municipios') {
      await pool.query(`INSERT INTO municipios (entidad_id, nombre) VALUES (?, ?)`, [entidad_id || 1, nombre]);
    } else if (tipo === 'entidades_federativas') {
      await pool.query(
        `INSERT INTO entidades_federativas (id, nombre, abreviatura) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), abreviatura = VALUES(abreviatura)`,
        [
          entidad_id || null, 
          nombre, 
          slug || 'TAB'
        ]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al guardar en catálogo:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}

// DELETE: Eliminar un elemento del catálogo
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const id = searchParams.get('id');

    const tablasPermitidas = ['tipo_inmuebles', 'municipios', 'entidades_federativas', 'amenidades'];
    if (!tipo || !id || !tablasPermitidas.includes(tipo)) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    await pool.query(`DELETE FROM ${tipo} WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al eliminar elemento:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return NextResponse.json({ error: 'No se puede eliminar este registro porque está vinculado a otras tablas.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al eliminar el registro de la base de datos' }, { status: 500 });
  }
}