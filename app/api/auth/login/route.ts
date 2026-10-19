import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Buscar usuario en MySQL
    const [rows]: any = await pool.query(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    const user = rows[0];

    // Guardar la sesión en una cookie segura (válida por 7 días)
    const cookieStore = await cookies();
    cookieStore.set('session_user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/'
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno en el servidor' }, { status: 500 });
  }
}