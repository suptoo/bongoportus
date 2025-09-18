import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // TODO: Replace with real user lookup (e.g., MongoDB). For now, simple rule:
    const role = email === 'umorfaruksupto@gmail.com' ? 'admin' : 'user';

    // Very basic password presence check (replace with hashing & real validation)
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
    }

    const secret = process.env.AUTH_SECRET || 'dev-secret-change-me';
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60 * 24 * 7; // 7 days

  const token = await signJWT({ email, role, iat: now, exp }, secret);

    const res = NextResponse.json({ success: true, role });
    // HttpOnly session cookie
    res.cookies.set('bp_session', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    // Non-HttpOnly role cookie for client UI quick checks
    res.cookies.set('bp_role', role, { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });

    return res;
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
