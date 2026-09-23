'use client';

import React from 'react';
import Image from 'next/image';
import { getPlatformConfig, PlatformIcon } from './PlatformIcons';

export default function PhoneMockup({ userData = {}, className = '', interactive = false }) {
  const {
    userFirstName,
    userLastName,
    userEmail,
    userName,
    userImage,
    userLinks = [],
    firstName,
    lastName,
    email,
    username,
    image,
    links = []
  } = userData;

  const displayFirstName = userFirstName || firstName || '';
  const displayLastName = userLastName || lastName || '';
  const displayEmail = userEmail || email || '';
  const displayUsername = userName || username || '';
  const displayImage = userImage || image || null;
  const displayLinks = (userLinks.length > 0 ? userLinks : links) || [];

  const fullName = `${displayFirstName} ${displayLastName}`.trim();

  const handleLinkClick = (url) => {
    if (!interactive || !url) return;
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  // Skeleton placeholders to keep device frame visually appealing when empty
  const minSkeletonCount = Math.max(0, 4 - displayLinks.length);

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 ${className}`}>
      {/* Device Frame */}
      <div className="relative w-[308px] h-[632px] bg-[#090d16] rounded-[50px] border-[10px] border-[#1e293b] shadow-2xl glow-purple p-4 flex flex-col overflow-hidden select-none">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#1e293b] rounded-b-xl flex items-center justify-center z-20">
          <div className="w-3 h-3 rounded-full bg-[#090d16] mr-2"></div>
          <div className="w-2 h-2 rounded-full bg-[#1e293b] border border-slate-700"></div>
        </div>

        {/* Inner Phone Screen */}
        <div className="w-full h-full bg-[#0b0f19] rounded-[36px] pt-8 px-4 pb-6 flex flex-col items-center overflow-y-auto scrollbar-none border border-white/5 relative">
          
          {/* Glass background decorative glow */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Profile Picture */}
          <div className="relative mt-4 mb-3">
            {displayImage ? (
              <div className="w-24 h-24 rounded-full border-2 border-indigo-500/50 p-1 bg-slate-900/80 shadow-lg glow-brand overflow-hidden">
                <img
                  src={displayImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-slate-700/60 bg-slate-800/80 flex flex-col items-center justify-center text-slate-500 shadow-inner">
                {fullName ? (
                  <span className="text-2xl font-bold text-indigo-400">
                    {displayFirstName[0]?.toUpperCase()}{displayLastName[0]?.toUpperCase()}
                  </span>
                ) : (
                  <div className="w-24 h-24 rounded-full animate-shimmer"></div>
                )}
              </div>
            )}
          </div>

          {/* User Full Name */}
          <div className="w-full text-center mb-1">
            {fullName ? (
              <h2 className="text-lg font-bold text-slate-100 truncate px-2">
                {fullName}
              </h2>
            ) : (
              <div className="w-40 h-4 mx-auto rounded-full animate-shimmer my-1"></div>
            )}
          </div>

          {/* Email / Username */}
          <div className="w-full text-center mb-6">
            {displayEmail || displayUsername ? (
              <p className="text-xs text-slate-400 truncate px-2 font-medium">
                {displayUsername ? `@${displayUsername}` : displayEmail}
              </p>
            ) : (
              <div className="w-24 h-2.5 mx-auto rounded-full animate-shimmer my-1"></div>
            )}
          </div>

          {/* Links List */}
          <div className="w-full flex-1 flex flex-col gap-3 overflow-y-auto pr-0.5">
            {displayLinks.map((link, idx) => {
              const platform = getPlatformConfig(link.name);
              const isDarkBrand = platform.textColor === '#FFFFFF';
              return (
                <button
                  key={idx}
                  onClick={() => handleLinkClick(link.link)}
                  style={{
                    backgroundColor: platform.color,
                    color: platform.textColor,
                  }}
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-white/10 ${
                    interactive ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <PlatformIcon name={link.name} className="w-4 h-4 shrink-0" />
                    <span className="truncate">{link.name || 'Custom Link'}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 shrink-0 opacity-80 ${isDarkBrand ? 'text-white' : 'text-slate-900'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              );
            })}

            {/* Skeleton Filler Links */}
            {Array.from({ length: minSkeletonCount }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="w-full h-11 rounded-xl animate-shimmer opacity-40"
              ></div>
            ))}
          </div>

          {/* Bottom Device Indicator */}
          <div className="w-24 h-1 bg-slate-700/60 rounded-full mt-3 shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
