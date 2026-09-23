'use client';

import React, { useState } from 'react';
import { useGlobalState } from '../globalstate/context';
import { useRouter } from 'next/navigation';
import PhoneMockup from '../components/PhoneMockup';
import Toast from '../components/Toast';
import QRCodeModal from '../components/QRCodeModal';
import { run } from '../backend/server';

export default function Preview() {
  const router = useRouter();
  const { state } = useGlobalState();
  const userData = state?.data || {};
  const {
    userFirstName,
    userLastName,
    userEmail,
    userName,
    userImage,
    userLinks,
    userPassword,
    userTheme
  } = userData;

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const username = userName || 'developer';

  const handleShare = async () => {
    const profileUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/user/${username}`
      : `/user/${username}`;

    setLoading(true);

    try {
      const res = await run(
        userFirstName || 'Dev',
        userLastName || 'User',
        userImage || '',
        userEmail || '',
        userPassword || '',
        userLinks || [],
        username
      );

      if (res && res.success === false) {
        setToast({ message: res.message || 'Error saving to database', type: 'error' });
      } else {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(profileUrl);
          setToast({ message: 'Profile link copied to clipboard & published!', type: 'success' });
        } else {
          setToast({ message: 'Profile published successfully!', type: 'success' });
        }

        setTimeout(() => {
          router.push(`/user/${username}`);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(profileUrl);
        setToast({ message: 'Link copied to clipboard!', type: 'info' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col relative overflow-hidden">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <QRCodeModal username={username} isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />

      {/* Decorative Header Gradient */}
      <div className="h-80 w-full bg-gradient-to-b from-indigo-900/40 via-purple-900/20 to-transparent absolute top-0 left-0 pointer-events-none"></div>

      {/* Floating Top Controls Header */}
      <header className="sticky top-0 z-40 w-full px-4 pt-4 pb-2">
        <nav className="max-w-5xl mx-auto glass-panel rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-2xl border border-white/10">
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700/80 text-slate-200 hover:bg-slate-800/80 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Editor</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold glass-panel border border-slate-700/80 text-slate-200 hover:text-white transition-all active:scale-95"
              title="Show Profile QR Code"
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span className="hidden sm:inline">QR Code</span>
            </button>

            <button
              onClick={handleShare}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share & Copy Link</span>
                </>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Showcase Device Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <PhoneMockup userData={userData} cardTheme={userTheme} interactive={true} className="animate-float" />
      </main>
    </div>
  );
}