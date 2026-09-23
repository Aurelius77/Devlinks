'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { login } from '../backend/server';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../globalstate/context';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { dispatch } = useGlobalState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: 'Please fill out all fields.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);

      if (data.success === false) {
        setToast({ message: data.message || 'Invalid email or password', type: 'error' });
        setLoading(false);
        return;
      }

      const user = data.message;
      dispatch({ type: 'LOG_IN' });
      dispatch({
        type: 'SET_DATA',
        payload: {
          userFirstName: user.name,
          userLastName: user.lastname,
          userEmail: user.email,
          userName: user.username,
          userImage: user.image,
          userLinks: user.links || []
        }
      });

      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        router.push('/profile');
      }, 800);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Something went wrong during login. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col relative overflow-hidden">
      <Navbar />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'error' })} />

      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 flex flex-col shadow-2xl border border-white/10">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-400 mt-1">Log in to manage your developer portfolio and links.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@dev.io"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <Link href="/login/forgot_password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <div className="text-center mt-4 pt-4 border-t border-slate-800/80">
              <span className="text-xs text-slate-400">Don't have a profile yet? </span>
              <Link href="/profile" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Create one now →
              </Link>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}