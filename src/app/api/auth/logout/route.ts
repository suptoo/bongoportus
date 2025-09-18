import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('bp_session', '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('bp_role', '', { httpOnly: false, path: '/', maxAge: 0 });
  return res;
}
