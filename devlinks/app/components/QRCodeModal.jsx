'use client';

import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRCodeModal({ url, username = 'developer', isOpen, onClose }) {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const profileUrl = url || (typeof window !== 'undefined' ? `${window.location.origin}/user/${username}` : `/user/${username}`);

  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (canvas) {
      const imageUri = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imageUri;
      downloadLink.download = `${username}-devlinks-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm glass-panel rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl border border-white/10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Title */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2 text-indigo-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Profile QR Code</h2>
          <p className="text-xs text-slate-400 mt-1">Scan to open <span className="text-indigo-400 font-semibold">@{username}</span>&apos;s profile</p>
        </div>

        {/* QR Code Canvas Frame */}
        <div ref={qrRef} className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200 mb-6 flex items-center justify-center">
          <QRCodeCanvas
            value={profileUrl}
            size={180}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: '/favicon.ico',
              x: undefined,
              y: undefined,
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
        </div>

        {/* URL Display */}
        <div className="w-full bg-slate-950/80 rounded-xl p-2.5 mb-5 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
          <span className="truncate pr-2">{profileUrl}</span>
          <button
            onClick={handleCopyLink}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-sans font-semibold text-[11px] shrink-0 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Actions */}
        <div className="w-full flex items-center gap-3">
          <button
            onClick={handleDownloadPNG}
            className="w-full py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download PNG</span>
          </button>
        </div>

      </div>
    </div>
  );
}
