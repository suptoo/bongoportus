"use client";
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { setRole } from '@/lib/role';

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isAdmin?: boolean;
}

function AuthPageInner() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError('Name is required for signup');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.error || 'Login failed');
          return;
        }
        const role = data.role === 'admin' ? 'admin' : 'user';
        setRole(role); // non-HttpOnly role cookie for UI
        if (next) {
          router.push(next);
        } else {
          router.push(role === 'admin' ? '/admin' : '/user');
        }
      } else {
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        if (existingUsers.find((user: User) => user.email === email)) {
          setError('User with this email already exists');
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          email: email,
          name: name,
          password: password,
          registrationDate: new Date().toISOString()
        };

        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

  setSuccess('Account created successfully! Please login.');
        setIsLogin(true);
        setEmail(email);
        setPassword('');
        setConfirmPassword('');
        setName('');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-black text-white">
        <style jsx>{`
          .wrap { max-width: 420px; margin: 0 auto; padding: 20px; }
          .brand { text-align: center; padding-top: 36px; padding-bottom: 10px; }
          .brand h1 { font-weight: 900; letter-spacing: .5px; font-size: 1.8rem; }
          .brand h1 span { background: linear-gradient(45deg, #22c55e, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .panel { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12); border-radius: 16px; padding: 22px; box-shadow: 0 20px 40px rgba(0,0,0,.35); }
          .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
          .tab { padding: 10px 12px; text-align: center; border-radius: 10px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); cursor: pointer; }
          .tab.active { background: linear-gradient(45deg, #22c55e, #3b82f6); border-color: transparent; }
          .label { display:block; color: #a1a1aa; font-size: .85rem; margin-bottom: 6px; }
          .input { width: 100%; padding: 12px 14px; border-radius: 12px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.14); color: #fff; outline: none; }
          .input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.2); }
          .row { display: grid; gap: 12px; margin-bottom: 12px; }
          .submit { width: 100%; padding: 12px 14px; border-radius: 12px; font-weight: 700; background: linear-gradient(45deg, #22c55e, #3b82f6); border: none; color: #fff; box-shadow: 0 12px 24px rgba(34,197,94,.25); }
          .muted { text-align: center; color: #a1a1aa; font-size: .9rem; margin-top: 10px; }
          .switch { color: #93c5fd; cursor: pointer; }

          /* App-like mobile feel */
          @media (max-width: 480px) {
            .wrap { max-width: 100%; padding: 16px; }
            .panel { border-radius: 18px; padding: 18px; }
            .brand { padding-top: 26px; }
          }

          /* Desktop polish */
          @media (min-width: 768px) {
            .brand h1 { font-size: 2.2rem; }
            .panel { padding: 26px; }
          }
        `}</style>

        <div className="wrap">
          <div className="brand">
            <h1>Welcome to <span>BongoPortus</span></h1>
            <div className="muted">{isLogin ? 'Sign in to continue' : 'Create your account to get started'}</div>
          </div>

          <div className="panel">
            <div className="tabs">
              <div className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</div>
              <div className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</div>
            </div>

            {error && (
              <div className="row" style={{marginBottom: 10}}>
                <div className="input" style={{ borderColor: 'rgba(244,63,94,.45)', background: 'rgba(244,63,94,.08)', color: '#fca5a5' }}>
                  <i className="fa-solid fa-circle-exclamation"/> <span style={{ marginLeft: 8 }}>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="row" style={{marginBottom: 10}}>
                <div className="input" style={{ borderColor: 'rgba(34,197,94,.45)', background: 'rgba(34,197,94,.08)', color: '#86efac' }}>
                  <i className="fa-solid fa-circle-check"/> <span style={{ marginLeft: 8 }}>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="row">
                  <label className="label">Full Name</label>
                  <input className="input" type="text" placeholder="John Doe" value={name} onChange={(e) => { setName(e.target.value); setError(''); setSuccess(''); }} required />
                </div>
              )}

              <div className="row">
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="name@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess(''); }} required />
              </div>

              <div className="row">
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); setSuccess(''); }} required />
              </div>

              {!isLogin && (
                <div className="row">
                  <label className="label">Confirm Password</label>
                  <input className="input" type="password" placeholder="Re-type password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(''); setSuccess(''); }} required />
                </div>
              )}

              <button className="submit" type="submit" disabled={loading}>
                {loading ? (isLogin ? 'Logging in…' : 'Creating account…') : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </form>

            <div className="muted" style={{marginTop: 12}}>
              {isLogin ? (
                <>Don’t have an account? <span className="switch" onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}>Sign up</span></>
              ) : (
                <>Already have an account? <span className="switch" onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}>Login</span></>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageInner />
    </Suspense>
  );
}