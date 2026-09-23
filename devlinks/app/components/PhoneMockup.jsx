'use client';

import React from 'react';
import { getPlatformConfig, PlatformIcon } from './PlatformIcons';

export const CARD_THEMES = [
  {
    id: 'midnight',
    name: 'Midnight',
    bgClass: 'bg-[#0b0f19]',
    cardBorder: 'border-white/5',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    glowColor: 'bg-purple-600/10',
    previewColor: '#0b0f19',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    bgClass: 'bg-[#022c22]',
    cardBorder: 'border-emerald-500/20',
    textPrimary: 'text-emerald-100',
    textSecondary: 'text-emerald-400',
    glowColor: 'bg-emerald-500/20',
    previewColor: '#022c22',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    bgClass: 'bg-[#0f172a]',
    cardBorder: 'border-cyan-500/30',
    textPrimary: 'text-cyan-100',
    textSecondary: 'text-pink-400',
    glowColor: 'bg-cyan-500/20',
    previewColor: '#0f172a',
  },
  {
    id: 'purple_glow',
    name: 'Purple Glow',
    bgClass: 'bg-[#2e1065]',
    cardBorder: 'border-purple-400/30',
    textPrimary: 'text-purple-100',
    textSecondary: 'text-purple-300',
    glowColor: 'bg-indigo-500/20',
    previewColor: '#2e1065',
  },
  {
    id: 'minimal_light',
    name: 'Minimal Light',
    bgClass: 'bg-white',
    cardBorder: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    glowColor: 'bg-indigo-500/5',
    previewColor: '#ffffff',
  },
];

export function getCardTheme(themeId) {
  return CARD_THEMES.find((t) => t.id === themeId) || CARD_THEMES[0];
}

export default function PhoneMockup({ userData = {}, className = '', interactive = false, cardTheme: overrideTheme }) {
  const {
    userFirstName,
    userLastName,
    userEmail,
    userName,
    userImage,
    userLinks = [],
    userTheme,
    firstName,
    lastName,
    email,
    username,
    image,
    links = [],
    cardTheme: itemTheme
  } = userData;

  const activeThemeId = overrideTheme || userTheme || itemTheme || 'midnight';
  const theme = getCardTheme(activeThemeId);

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

  // No filler needed — empty state is handled with a clear placeholder

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
        <div className={`w-full h-full ${theme.bgClass} rounded-[36px] pt-8 px-4 pb-6 flex flex-col items-center overflow-y-auto scrollbar-none border ${theme.cardBorder} relative transition-all duration-300`}>
          
          {/* Glass background decorative glow */}
          <div className={`absolute -top-12 -left-12 w-40 h-40 ${theme.glowColor} rounded-full blur-2xl pointer-events-none`}></div>
          <div className={`absolute -bottom-12 -right-12 w-40 h-40 ${theme.glowColor} rounded-full blur-2xl pointer-events-none`}></div>

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
            ) : fullName ? (
              <div className="w-24 h-24 rounded-full border-2 border-slate-700/60 bg-slate-800/80 flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-indigo-400">
                  {displayFirstName[0]?.toUpperCase()}{displayLastName[0]?.toUpperCase()}
                </span>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-700/60 bg-slate-800/30 flex items-center justify-center text-slate-600">
                <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>

          {/* User Full Name */}
          <div className="w-full text-center mb-1">
            {fullName ? (
              <h2 className={`text-lg font-bold ${theme.textPrimary} truncate px-2`}>
                {fullName}
              </h2>
            ) : (
              <p className="text-sm font-semibold text-slate-500 italic px-2">Your Name</p>
            )}
          </div>

          {/* Email / Username */}
          <div className="w-full text-center mb-6">
            {displayEmail || displayUsername ? (
              <p className={`text-xs ${theme.textSecondary} truncate px-2 font-medium`}>
                {displayUsername ? `@${displayUsername}` : displayEmail}
              </p>
            ) : (
              <p className="text-xs text-slate-600 italic">@username</p>
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

            {/* Empty state when no links */}
            {displayLinks.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <p className="text-[10px] text-slate-600 leading-tight px-2">Add links to see<br/>them here</p>
              </div>
            )}
          </div>

          {/* Bottom Device Indicator */}
          <div className="w-24 h-1 bg-slate-700/60 rounded-full mt-3 shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
