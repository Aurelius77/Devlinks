'use client';

import React, { useEffect, useState } from 'react';
import { getUser } from '@/app/backend/server';
import { useRouter } from 'next/navigation';
import { getPlatformConfig, PlatformIcon } from '@/app/components/PlatformIcons';
import Toast from '@/app/components/Toast';

export default function UserPublicProfile({ params }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (!params?.username) {
      setLoading(false);
      return;
    }

    const handle = decodeURIComponent(params.username);

    async function fetchData() {
      try {
        const result = await getUser(handle);
        if (result && !result.message) {
          setData(result);
        } else if (result && result.name) {
          setData(result);
        } else {
          setData(result || null);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params?.username]);

  const handleLinkClick = (url) => {
    if (!url) return;
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  const copyProfileUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToast({ message: 'Profile URL copied to clipboard!', type: 'success' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm glass-panel rounded-3xl p-8 flex flex-col items-center shadow-2xl border border-white/10 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-slate-800 mb-4"></div>
          <div className="w-40 h-5 bg-slate-800 rounded-full mb-2"></div>
          <div className="w-24 h-3 bg-slate-800 rounded-full mb-6"></div>
          <div className="w-full h-12 bg-slate-800 rounded-xl mb-3"></div>
          <div className="w-full h-12 bg-slate-800 rounded-xl mb-3"></div>
          <div className="w-full h-12 bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const fullName = data ? `${data.name || ''} ${data.lastname || ''}`.trim() : 'Developer';
  const username = data?.username || params?.username;
  const userImage = data?.image || null;
  const userLinks = data?.links || [];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col items-center justify-between p-4 relative overflow-hidden select-none">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner Navigation */}
      <header className="w-full max-w-md pt-4 flex items-center justify-between z-20">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold glass-panel text-slate-300 hover:text-white border border-white/10 transition-all"
        >
          <span>✨ Create Your Own</span>
        </button>

        <button
          onClick={copyProfileUrl}
          className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white border border-white/10 transition-all"
          title="Share Profile"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </header>

      {/* Profile Card Container */}
      <main className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl border border-white/10 my-auto z-10 relative">
        
        {/* Profile Avatar */}
        <div className="relative mb-4">
          {userImage ? (
            <div className="w-28 h-28 rounded-full border-2 border-indigo-500/60 p-1 bg-slate-900 shadow-xl glow-brand overflow-hidden">
              <img src={userImage} alt={fullName} className="w-full h-full object-cover rounded-full" />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-3xl font-extrabold text-indigo-400 shadow-inner">
              {fullName ? `${fullName[0]?.toUpperCase()}` : 'D'}
            </div>
          )}
        </div>

        {/* User Name & Handle */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-white text-center tracking-tight">
          {fullName || `@${username}`}
        </h1>

        <p className="text-xs font-semibold text-slate-400 mt-1 mb-6">
          @{username}
        </p>

        {/* Links Stack */}
        <div className="w-full flex flex-col gap-3">
          {userLinks && userLinks.length > 0 ? (
            userLinks.map((item, idx) => {
              const platform = getPlatformConfig(item.name);
              const isDarkBrand = platform.textColor === '#FFFFFF';
              return (
                <button
                  key={idx}
                  onClick={() => handleLinkClick(item.link)}
                  style={{
                    backgroundColor: platform.color,
                    color: platform.textColor,
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl flex items-center justify-between text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-white/10 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 truncate">
                    <PlatformIcon name={item.name} className="w-5 h-5 shrink-0" />
                    <span className="truncate">{item.name || 'Link'}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                      isDarkBrand ? 'text-white' : 'text-slate-900'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              );
            })
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              No developer links published yet.
            </div>
          )}
        </div>

      </main>

      {/* Footer Branding Badge */}
      <footer className="py-4 text-center z-20">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-semibold text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
        >
          <span>Powered by</span>
          <span className="text-indigo-400 font-extrabold">devlinks</span>
        </a>
      </footer>
    </div>
  );
}
