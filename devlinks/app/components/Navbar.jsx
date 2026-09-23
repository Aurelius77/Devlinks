'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useGlobalState } from '../globalstate/context';
import QRCodeModal from './QRCodeModal';

export default function Navbar() {
  const currentPath = usePathname();
  const router = useRouter();
  const { state, dispatch } = useGlobalState();
  const isAuthenticated = state?.isAuthenticated || false;
  const appTheme = state?.appTheme || 'dark';
  const userData = state?.data || {};
  const username = userData.userName || 'developer';

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const routes = [
    {
      name: 'Links',
      link: '/links',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      name: 'Profile Details',
      link: '/profile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <QRCodeModal
        username={username}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      <header className="sticky top-0 z-40 w-full px-4 pt-4 pb-2">
        <nav className="max-w-7xl mx-auto glass-panel rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg border border-white/10">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-lg font-extrabold bg-gradient-to-r from-indigo-400 via-purple-300 to-slate-200 bg-clip-text text-transparent tracking-tight">
              devlinks
            </span>
          </Link>

          {/* Tab Navigation */}
          <div className="flex items-center bg-slate-900/60 p-1.5 rounded-xl border border-white/5 gap-1">
            {routes.map((route) => {
              const isActive = currentPath === route.link || (currentPath === '/' && route.link === '/profile');
              return (
                <Link
                  key={route.link}
                  href={route.link}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {route.icon}
                  <span className="hidden sm:inline">{route.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            
            {/* Global Light/Dark Theme Switcher */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_APP_THEME' })}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/60 transition-colors"
              title={`Switch to ${appTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {appTheme === 'dark' ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* QR Code Action Button */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/60 transition-colors"
              title="Generate QR Code"
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </button>

            {!isAuthenticated && (
              <Link
                href="/login"
                className="hidden md:inline-flex px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Preview Button */}
            <button
              onClick={() => router.push('/preview')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold border border-indigo-500/40 text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-500 transition-all duration-200 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Preview</span>
            </button>
          </div>

        </nav>
      </header>
    </>
  );
}