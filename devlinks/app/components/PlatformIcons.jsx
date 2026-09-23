'use client';

import React from 'react';

export const PLATFORMS = [
  { id: 'github', name: 'GitHub', color: '#181717', textColor: '#FFFFFF', iconName: 'github', placeholder: 'https://github.com/username' },
  { id: 'frontend_mentor', name: 'Frontend Mentor', color: '#FFFFFF', textColor: '#0B0F19', iconName: 'frontend_mentor', placeholder: 'https://www.frontendmentor.io/profile/username' },
  { id: 'twitter', name: 'Twitter / X', color: '#1DA1F2', textColor: '#FFFFFF', iconName: 'twitter', placeholder: 'https://x.com/username' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', textColor: '#FFFFFF', iconName: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', textColor: '#FFFFFF', iconName: 'youtube', placeholder: 'https://youtube.com/@username' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', textColor: '#FFFFFF', iconName: 'facebook', placeholder: 'https://facebook.com/username' },
  { id: 'twitch', name: 'Twitch', color: '#9146FF', textColor: '#FFFFFF', iconName: 'twitch', placeholder: 'https://twitch.tv/username' },
  { id: 'devto', name: 'Dev.to', color: '#0A0A0A', textColor: '#FFFFFF', iconName: 'devto', placeholder: 'https://dev.to/username' },
  { id: 'codewars', name: 'CodeWars', color: '#AD2C27', textColor: '#FFFFFF', iconName: 'codewars', placeholder: 'https://www.codewars.com/users/username' },
  { id: 'freecodecamp', name: 'freeCodeCamp', color: '#303846', textColor: '#FFFFFF', iconName: 'freecodecamp', placeholder: 'https://freecodecamp.org/username' },
  { id: 'gitlab', name: 'GitLab', color: '#E24329', textColor: '#FFFFFF', iconName: 'gitlab', placeholder: 'https://gitlab.com/username' },
  { id: 'hashnode', name: 'Hashnode', color: '#2962FF', textColor: '#FFFFFF', iconName: 'hashnode', placeholder: 'https://hashnode.com/@username' },
  { id: 'stackoverflow', name: 'Stack Overflow', color: '#F48024', textColor: '#FFFFFF', iconName: 'stackoverflow', placeholder: 'https://stackoverflow.com/users/id' },
  { id: 'portfolio', name: 'Portfolio / Website', color: '#635FC7', textColor: '#FFFFFF', iconName: 'portfolio', placeholder: 'https://yourdomain.com' },
];

export function getPlatformConfig(nameOrId) {
  if (!nameOrId) return PLATFORMS[0];
  const query = nameOrId.toLowerCase().trim();
  const match = PLATFORMS.find(
    (p) => p.name.toLowerCase() === query || p.id.toLowerCase() === query
  );
  if (match) return match;
  return {
    id: 'custom',
    name: nameOrId,
    color: '#334155',
    textColor: '#FFFFFF',
    iconName: 'link',
    placeholder: 'https://example.com'
  };
}

export function PlatformIcon({ name, className = 'w-5 h-5', width = 20, height = 20 }) {
  const norm = (name || '').toLowerCase().trim();
  const svgProps = { width, height, className };

  if (norm.includes('github')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  if (norm.includes('linkedin')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
      </svg>
    );
  }

  if (norm.includes('twitter') || norm.includes('x')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }

  if (norm.includes('youtube')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }

  if (norm.includes('twitch')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 4.714h1.715v5.143h-1.715zm4.715 0h1.714v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
      </svg>
    );
  }

  if (norm.includes('devto') || norm.includes('dev.to')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H5.32v4.36h1.22c.4 0 .69-.08.87-.24.18-.16.27-.42.27-.8v-2.3c0-.36-.09-.62-.26-.79zm.56 3.7c-.38.38-.96.57-1.74.57H3.92V9.01h2.29c.79 0 1.37.19 1.75.57.38.38.57.94.57 1.68v.1c0 .76-.19 1.32-.55 1.69zm5.34-1.92h-1.63v1.39h1.79v1.1h-3.17V9.01h3.17v1.1h-1.79v1.07h1.63v1.14zm4.18-2.82l-1.52 4.96h-1.07l-1.5-4.96h1.34l.73 2.87.75-2.87h1.27zM0 3.6v16.8A1.6 1.6 0 001.6 22h20.8a1.6 1.6 0 001.6-1.6V3.6A1.6 1.6 0 0022.4 2H1.6A1.6 1.6 0 000 3.6z"/>
      </svg>
    );
  }

  if (norm.includes('gitlab')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 015.5 2a.43.43 0 01.39.27L8.2 9h7.6l2.31-6.73a.43.43 0 01.39-.27.42.42 0 01.39.18l2.44 7.51 1.22 3.78a.84.84 0 01-.3.92z"/>
      </svg>
    );
  }

  if (norm.includes('hashnode')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 00-7.962 0l-6.37 6.37a5.63 5.63 0 000 7.962l6.37 6.37a5.63 5.63 0 007.962 0l6.37-6.37a5.63 5.63 0 000-7.962zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/>
      </svg>
    );
  }

  if (norm.includes('codewars')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm7.848 16.536l-7.848 4.532-7.848-4.532V7.464l7.848-4.532 7.848 4.532v9.072z"/>
      </svg>
    );
  }

  if (norm.includes('freecodecamp')) {
    return (
      <svg {...svgProps} fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 8.785c-1.398-1.503-3.32-2.122-4.996-2.122-1.745 0-3.332.658-4.482 1.776L6.592 7.03C8.04 5.584 10.147 4.7 12.476 4.7c2.25 0 4.772.84 6.576 2.777l-1.58 1.308zM12.476 19.3c-2.329 0-4.436-.884-5.884-2.33l1.402-1.409c1.15 1.118 2.737 1.776 4.482 1.776 1.676 0 3.598-.619 4.996-2.122l1.58 1.308c-1.804 1.937-4.326 2.777-6.576 2.777z"/>
      </svg>
    );
  }

  // Default link icon
  return (
    <svg {...svgProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}
