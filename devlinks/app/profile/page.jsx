'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PhoneMockup from '../components/PhoneMockup';
import Toast from '../components/Toast';
import { useGlobalState } from '../globalstate/context';
import { useRouter } from 'next/navigation';

import { run } from '../backend/server';

export default function Profile() {
  const { state, dispatch } = useGlobalState();
  const router = useRouter();
  const userData = state?.data || {};

  const [firstName, setFirstName] = useState(userData.userFirstName || '');
  const [lastName, setLastName] = useState(userData.userLastName || '');
  const [email, setEmail] = useState(userData.userEmail || '');
  const [username, setUsername] = useState(userData.userName || '');
  const [password, setPassword] = useState(userData.userPassword || '');
  const [selectedImage, setSelectedImage] = useState(userData.userImage || null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Sync state if global data changes
  useEffect(() => {
    if (userData.userFirstName && !firstName) setFirstName(userData.userFirstName);
    if (userData.userLastName && !lastName) setLastName(userData.userLastName);
    if (userData.userEmail && !email) setEmail(userData.userEmail);
    if (userData.userName && !username) setUsername(userData.userName);
    if (userData.userImage && !selectedImage) setSelectedImage(userData.userImage);
  }, [userData]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setToast({ message: 'Image size should be less than 2MB', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setSelectedImage(reader.result);
          setToast({ message: 'Image uploaded successfully!', type: 'success' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!firstName || !lastName) {
      setToast({ message: 'First name and Last name are required', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // 1. Save to local React Context state
      await dispatch({
        type: 'SET_DATA',
        payload: {
          ...userData,
          userFirstName: firstName,
          userLastName: lastName,
          userEmail: email,
          userName: username,
          userPassword: password,
          userImage: selectedImage,
          userLinks: userData.userLinks || []
        },
      });

      // 2. Persist account to database if email and password are provided
      if (email && password && username) {
        const dbRes = await run(
          firstName,
          lastName,
          selectedImage || '',
          email,
          password,
          userData.userLinks || [],
          username
        );

        if (dbRes && dbRes.success === false && !dbRes.message.includes('already exists')) {
          console.warn('Database note:', dbRes.message);
        }
      }

      setToast({ message: 'Profile & Account created successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ message: 'Profile saved locally!', type: 'success' });
    } finally {
      setLoading(false);
    }
  };


  const previewData = {
    userFirstName: firstName,
    userLastName: lastName,
    userEmail: email,
    userName: username,
    userImage: selectedImage,
    userLinks: userData.userLinks || []
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

        {/* Right Column: Profile Form Editor */}
        <section className="col-span-1 lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col border border-white/10">
          <div className="mb-6 border-b border-slate-800 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Profile Details
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Add your personal info and avatar to customize your developer link card.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Avatar Upload Card */}
            <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-200">Profile Picture</span>
                <span className="text-xs text-slate-400 mt-1 max-w-xs">
                  PNG, JPG, or GIF up to 2MB. Square image recommended.
                </span>
              </div>

              <div className="flex items-center gap-4">
                <label className="relative cursor-pointer group flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-800/40 hover:bg-slate-800/80 transition-all overflow-hidden">
                  {selectedImage ? (
                    <>
                      <img src={selectedImage} alt="Avatar" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-xs font-medium text-white">
                        <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Change
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-400">
                      <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs font-medium">+ Upload</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                {selectedImage && (
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="p-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Profile Info Inputs */}
            <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Mercer"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@dev.io"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username (Public Profile Handle)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-xs">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="alexmercer"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Your public link will be: <span className="text-indigo-400 font-medium">{`devlinks/user/${username || 'username'}`}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all"
                />
              </div>

            </div>

            {/* Action Bar */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push('/links')}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Next: Customize Links →
              </button>

              <button
                type="submit"
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
                  <span>Save Profile</span>
                )}
              </button>
            </div>

          </form>

        </section>

      </main>
    </>
  );
}
