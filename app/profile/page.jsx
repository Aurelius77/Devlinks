'use client';

import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'next/navigation';

function checkAuth() {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    try {
      const user = jwtDecode(token); 
      const now = Date.now() / 1000;

     
      if (user.exp > now) {
        console.log('User is authenticated:', user);
        return user;
      } else {
        console.warn('Token expired');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  return null;
}

export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticatedUser = checkAuth();

    if (authenticatedUser) {
      setUser(authenticatedUser);
    } else {
      router.push('/login'); 
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome, {user.name || 'User'}!</h1>
      <p className="text-gray-700">Email: {user.email}</p>
      <p className="text-gray-700">User ID: {user.id}</p>

    </div>
  );
}
