'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  isAdmin?: boolean;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

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
        const userData = {
          email: email,
          name: name || email.split('@')[0],
          isAuthenticated: true,
          loginTime: Date.now()
        };
        
        localStorage.setItem('authToken', JSON.stringify(userData));

        if (email === 'umorfaruksupto@gmail.com') {
          router.push('/admin');
        } else {
          router.push('/user');
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        <h1 
          className="text-center mb-4"
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            background: 'linear-gradient(45deg, #4CAF50, #81C784)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}
        >
          BongoPortus
        </h1>
        
        <p className="text-center text-gray-300 mb-8 text-lg">
          {isLogin ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
        </p>
        
        {error && (
          <div 
            className="mb-4 p-4 rounded-lg text-center"
            style={{
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              color: '#ff6b6b'
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div 
            className="mb-4 p-4 rounded-lg text-center"
            style={{
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              color: '#4CAF50'
            }}
          >
            <strong>Success:</strong> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-6">
              <label className="block mb-2 text-green-400 font-semibold uppercase tracking-wider text-sm">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); setSuccess(''); }}
                placeholder="Enter your full name"
                className="w-full p-4 text-white rounded-full outline-none transition-all"
                style={{
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  background: 'rgba(0, 0, 0, 0.7)'
                }}
                required
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block mb-2 text-green-400 font-semibold uppercase tracking-wider text-sm">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess(''); }}
              placeholder="Enter your email address"
              className="w-full p-4 text-white rounded-full outline-none transition-all"
              style={{
                border: '2px solid rgba(76, 175, 80, 0.3)',
                background: 'rgba(0, 0, 0, 0.7)'
              }}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-green-400 font-semibold uppercase tracking-wider text-sm">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); setSuccess(''); }}
              placeholder="Enter your password"
              className="w-full p-4 text-white rounded-full outline-none transition-all"
              style={{
                border: '2px solid rgba(76, 175, 80, 0.3)',
                background: 'rgba(0, 0, 0, 0.7)'
              }}
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label className="block mb-2 text-green-400 font-semibold uppercase tracking-wider text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); setSuccess(''); }}
                placeholder="Confirm your password"
                className="w-full p-4 text-white rounded-full outline-none transition-all"
                style={{
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  background: 'rgba(0, 0, 0, 0.7)'
                }}
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full p-4 rounded-full text-white font-bold uppercase tracking-wider text-lg transition-all hover:transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(45deg, #4CAF50, #81C784)',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 15px 30px rgba(76, 175, 80, 0.4)'
            }}
          >
            {loading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? 'Login' : 'Create Account')}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setName('');
            }}
            className="w-full mt-4 p-3 rounded-full border-2 border-green-400/30 text-green-400 font-semibold transition-all hover:bg-green-400/10"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </form>

        <div className="text-center mt-8 text-gray-400 text-sm leading-relaxed">
          <p>
            <strong>Admin Access:</strong><br />
            <span className="text-green-400 font-semibold">umorfaruksupto@gmail.com</span> → Admin Dashboard
          </p>
          <p className="mt-4">
            <strong>User Access:</strong><br />
            Any other email → User Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}