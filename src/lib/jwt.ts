export type JWTPayload = {
  email: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
};

// Utilities: base64url encode/decode without Buffer in Edge
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toBase64(bytes: Uint8Array): string {
  if (typeof btoa === 'function') {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  // Node fallback using typed global Buffer if available
  const g = globalThis as unknown as { Buffer?: { from: (b: Uint8Array) => { toString: (enc: string) => string } } };
  const B = g.Buffer;
  if (!B) throw new Error('Base64 encoding not available');
  return B.from(bytes).toString('base64');
}

function fromBase64(b64: string): Uint8Array {
  if (typeof atob === 'function') {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  // Node fallback using typed global Buffer if available
  const g = globalThis as unknown as { Buffer?: { from: (s: string, enc: string) => Uint8Array } };
  const B = g.Buffer;
  if (!B) throw new Error('Base64 decoding not available');
  const buf = B.from(b64, 'base64');
  // Create a copy to ensure it's a proper Uint8Array (Buffer is a Uint8Array subclass)
  const out = new Uint8Array(buf.length);
  out.set(buf);
  return out;
}

function base64UrlEncode(bytes: Uint8Array): string {
  return toBase64(bytes).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecodeToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(b64url.length / 4) * 4, '=');
  return fromBase64(b64);
}

function base64UrlEncodeString(str: string): string {
  return base64UrlEncode(textEncoder.encode(str));
}

function base64UrlDecodeToString(b64url: string): string {
  return textDecoder.decode(base64UrlDecodeToBytes(b64url));
}

function getSubtle(): SubtleCrypto {
  // Use Web Crypto only; avoid bundling node:crypto in Edge/runtime
  if (typeof globalThis !== 'undefined') {
    const g = globalThis as unknown as { crypto?: { subtle?: SubtleCrypto } };
    if (g.crypto?.subtle) return g.crypto.subtle;
  }
  throw new Error('Web Crypto is not available in this environment');
}

export async function signJWT(payload: JWTPayload, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encHeader = base64UrlEncodeString(JSON.stringify(header));
  const encPayload = base64UrlEncodeString(JSON.stringify(payload));
  const data = `${encHeader}.${encPayload}`;

  const subtle = getSubtle();
  const key = await subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await subtle.sign('HMAC', key, textEncoder.encode(data));
  const encSig = base64UrlEncode(new Uint8Array(sig));
  return `${data}.${encSig}`;
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const [encHeader, encPayload, encSig] = token.split('.');
    if (!encHeader || !encPayload || !encSig) return null;
    const data = `${encHeader}.${encPayload}`;

    const subtle = getSubtle();
    const key = await subtle.importKey(
      'raw',
      textEncoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
  const sigBytes = base64UrlDecodeToBytes(encSig);
  // Ensure we pass an ArrayBuffer, not a SharedArrayBuffer reference
  const sigCopy = new Uint8Array(sigBytes.length);
  sigCopy.set(sigBytes);
  const ok = await subtle.verify('HMAC', key, sigCopy, textEncoder.encode(data));
    if (!ok) return null;
    const json = base64UrlDecodeToString(encPayload);
    const payload = JSON.parse(json) as JWTPayload;
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
