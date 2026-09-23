'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PhoneMockup from '../components/PhoneMockup';
import Toast from '../components/Toast';
import { PLATFORMS, getPlatformConfig, PlatformIcon } from '../components/PlatformIcons';
import { useGlobalState } from '../globalstate/context';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Links() {
  const { state, dispatch } = useGlobalState();
  const router = useRouter();
  const userData = state?.data || {};

  const initialLinks = userData.userLinks && userData.userLinks.length > 0
    ? userData.userLinks
    : [
        { name: 'GitHub', link: 'https://github.com' },
        { name: 'LinkedIn', link: 'https://linkedin.com' }
      ];

  const [links, setLinks] = useState(initialLinks);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addLink = () => {
    if (links.length >= 8) {
      setToast({ message: 'Maximum of 8 links allowed per profile.', type: 'error' });
      return;
    }
    const nextPlatform = PLATFORMS[links.length % PLATFORMS.length];
    setLinks([
      ...links,
      { name: nextPlatform.name, link: '' }
    ]);
  };

  const removeLink = (index) => {
    const updated = links.filter((_, idx) => idx !== index);
    setLinks(updated);
  };

  const updateLinkItem = (index, field, value) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'name' && !updated[index].link) {
      const config = getPlatformConfig(value);
      if (config.placeholder) {
        updated[index].link = config.placeholder;
      }
    }

    setLinks(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLinks(items);
    setToast({ message: 'Links reordered!', type: 'info' });
  };

  const handleSave = async () => {
    for (let i = 0; i < links.length; i++) {
      if (!links[i].link) {
        setToast({ message: `Please enter a valid URL for link #${i + 1} (${links[i].name})`, type: 'error' });
        return;
      }
    }

    setLoading(true);
    try {
      await dispatch({
        type: 'SET_DATA',
        payload: {
          ...userData,
          userLinks: links
        },
      });

      setToast({ message: 'Links saved successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to save links.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const previewData = {
    ...userData,
    userLinks: links
  };

  return (
    <>
      <Navbar />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Phone Mockup Preview */}
        <section className="hidden lg:flex lg:col-span-5 glass-panel rounded-3xl p-6 flex-col items-center justify-center min-h-[680px] sticky top-24 border border-white/10">
          <div className="w-full text-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Live Preview
            </span>
          </div>
          <PhoneMockup userData={previewData} interactive={true} />
        </section>

        {/* Right Column: Links Manager Card */}
        <section className="col-span-1 lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col border border-white/10">
          
          <div className="mb-6 border-b border-slate-800 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customize Your Links
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Add, edit, or drag & drop to reorder your developer links.
            </p>

            <button
              onClick={addLink}
              className="w-full mt-5 py-3 px-4 rounded-xl text-sm font-bold border-2 border-dashed border-indigo-500/50 hover:border-indigo-500 text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Add New Link</span>
            </button>
          </div>

          {/* Drag & Drop Links Items Container */}
          <div className="mb-6 max-h-[500px] overflow-y-auto pr-1">
            {links.length === 0 ? (
              <div className="bg-slate-900/40 rounded-2xl p-8 text-center border border-white/5 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-200">No links added yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Click the &quot;+ Add New Link&quot; button above to showcase your GitHub, LinkedIn, Portfolio, and social profiles.
                </p>
              </div>
            ) : mounted ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="links-droppable">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-col gap-4"
                    >
                      {links.map((item, idx) => {
                        const config = getPlatformConfig(item.name);
                        return (
                          <Draggable key={`link-${idx}`} draggableId={`link-${idx}`} index={idx}>
                            {(draggableProvided, snapshot) => (
                              <div
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                className={`bg-slate-900/70 rounded-2xl p-5 border border-white/5 flex flex-col gap-3 relative transition-all group ${
                                  snapshot.isDragging ? 'shadow-2xl border-indigo-500/80 bg-slate-900/95 ring-2 ring-indigo-500/30' : 'hover:border-slate-700/80'
                                }`}
                              >
                                {/* Item Header Bar with Drag Handle */}
                                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <span
                                      {...draggableProvided.dragHandleProps}
                                      className="text-slate-500 hover:text-indigo-400 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-800 transition-colors"
                                      title="Drag to reorder"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                                      </svg>
                                    </span>
                                    <span className="text-xs font-extrabold text-slate-400 tracking-wide">
                                      Link #{idx + 1}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => removeLink(idx)}
                                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove
                                  </button>
                                </div>

                                {/* Form Controls */}
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
                                  <div className="sm:col-span-5">
                                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Platform</label>
                                    <div className="relative">
                                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                        <PlatformIcon name={item.name} className="w-4 h-4" />
                                      </div>
                                      <select
                                        value={item.name}
                                        onChange={(e) => updateLinkItem(idx, 'name', e.target.value)}
                                        className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                                      >
                                        {PLATFORMS.map((platform) => (
                                          <option key={platform.id} value={platform.name} className="bg-slate-900 text-white">
                                            {platform.name}
                                          </option>
                                        ))}
                                      </select>
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </span>
                                    </div>
                                  </div>

                                  <div className="sm:col-span-7">
                                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Link URL</label>
                                    <div className="relative">
                                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                      </span>
                                      <input
                                        type="text"
                                        value={item.link}
                                        onChange={(e) => updateLinkItem(idx, 'link', e.target.value)}
                                        placeholder={config.placeholder}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : null}
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              ← Back to Profile
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Links</span>
              )}
            </button>
          </div>

        </section>

      </main>
    </>
  );
}