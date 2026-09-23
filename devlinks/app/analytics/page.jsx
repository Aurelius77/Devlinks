'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useGlobalState } from '../globalstate/context';
import { getAnalytics } from '../backend/server';
import { getPlatformConfig, PlatformIcon } from '../components/PlatformIcons';
import Link from 'next/link';

export default function Analytics() {
  const { state } = useGlobalState();
  const userData = state?.data || {};
  const username = userData.userName || 'developer';

  const [analytics, setAnalytics] = useState({
    profileViews: 0,
    totalClicks: 0,
    ctr: 0,
    topLink: null,
    links: []
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      try {
        const data = await getAnalytics(username);
        if (data) {
          setAnalytics(data);
        } else {
          // Fallback to local state if offline or no DB user yet
          const localLinks = (userData.userLinks || []).map((l) => ({
            ...l,
            shortCode: l.shortCode || 'link',
            clicks: l.clicks || 0
          }));
          const totalClicks = localLinks.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
          setAnalytics({
            profileViews: 1,
            totalClicks: totalClicks,
            ctr: totalClicks > 0 ? '100' : '0',
            topLink: localLinks[0] || null,
            links: localLinks
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [username, userData]);

  const copyShortUrl = (shortCode) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shortUrl = `${origin}/r/${shortCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortUrl);
      setToast({ message: `Short link copied: ${shortUrl}`, type: 'success' });
    }
  };

  const { profileViews, totalClicks, ctr, topLink, links } = analytics;

  return (
    <>
      <Navbar />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Page Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Performance Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Link Analytics & Short URLs
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time profile engagement, click-through rates, and branded short links for <span className="text-indigo-400 font-semibold">@{username}</span>.
            </p>
          </div>

          <Link
            href="/preview"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>View Live Profile</span>
          </Link>
        </div>

        {/* 4 Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Profile Views */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Total Profile Views</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {loading ? '...' : profileViews}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>

          {/* Card 2: Total Clicks */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Total Link Clicks</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {loading ? '...' : totalClicks}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
          </div>

          {/* Card 3: CTR % */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">Click-Through Rate (CTR)</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {loading ? '...' : `${ctr}%`}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>

          {/* Card 4: Top Platform */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div className="flex flex-col truncate pr-2">
              <span className="text-xs font-semibold text-slate-400">Top Performing Platform</span>
              <span className="text-lg sm:text-xl font-bold text-white mt-1 truncate">
                {loading ? '...' : topLink ? topLink.name : 'No clicks yet'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>

        </div>

        {/* Link Performance Table Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Detailed Link Performance & Short URLs
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Share short links (`/r/[shortCode]`) anywhere to auto-track clicks.
              </p>
            </div>
          </div>

          {links.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No developer links configured yet. Add links on the <Link href="/links" className="text-indigo-400 underline">Links page</Link>.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {links.map((linkItem, idx) => {
                const config = getPlatformConfig(linkItem.name);
                const clickCount = linkItem.clicks || 0;
                const percentage = totalClicks > 0 ? Math.round((clickCount / totalClicks) * 100) : 0;

                return (
                  <div
                    key={idx}
                    className="bg-slate-900/60 rounded-2xl p-5 border border-white/5 flex flex-col gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Left: Platform Icon & Name */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shrink-0"
                          style={{ backgroundColor: config.color, color: config.textColor }}
                        >
                          <PlatformIcon name={linkItem.name} className="w-5 h-5" />
                        </div>

                        <div className="flex flex-col truncate">
                          <span className="text-sm font-bold text-white truncate">
                            {linkItem.name || 'Custom Link'}
                          </span>
                          <a
                            href={linkItem.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-slate-400 hover:text-indigo-400 truncate max-w-xs transition-colors"
                          >
                            {linkItem.link || 'No URL'}
                          </a>
                        </div>
                      </div>

                      {/* Right: Short URL & Action */}
                      <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 self-start sm:self-auto">
                        <span className="text-xs font-mono text-indigo-400 px-2">
                          {`/r/${linkItem.shortCode || 'code'}`}
                        </span>
                        <button
                          onClick={() => copyShortUrl(linkItem.shortCode)}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all active:scale-95"
                        >
                          Copy Short Link
                        </button>
                      </div>

                    </div>

                    {/* Progress Bar & Click Count */}
                    <div className="mt-1 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-400">Click Distribution</span>
                        <span className="text-indigo-400 font-bold">{clickCount} Clicks ({percentage}%)</span>
                      </div>

                      <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </>
  );
}
