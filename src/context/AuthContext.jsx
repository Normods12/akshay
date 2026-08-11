import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || '';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: check for token in URL (after Google OAuth redirect) or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    if (urlToken) {
      // Clean URL without reload
      window.history.replaceState({}, '', window.location.pathname);
      storeToken(urlToken);
    } else {
      const stored = localStorage.getItem('mj_token');
      if (stored) {
        storeToken(stored);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const storeToken = useCallback(async (t) => {
    localStorage.setItem('mj_token', t);
    setToken(t);
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token invalid
        localStorage.removeItem('mj_token');
        setToken(null);
        setUser(null);
      }
    } catch (e) {
      // Server unreachable — try to decode locally
      try {
        const payload = JSON.parse(atob(t.split('.')[1]));
        setUser(payload);
      } catch {
        localStorage.removeItem('mj_token');
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = `${API_BASE}/api/auth/google`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mj_token');
    setToken(null);
    setUser(null);
  }, []);

  const authFetch = useCallback(async (url, options = {}) => {
    const t = token || localStorage.getItem('mj_token');
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      }
    });
  }, [token]);

  const value = {
    user,
    token,
    isLoading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    loginWithGoogle,
    logout,
    authFetch,
    API_BASE,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
