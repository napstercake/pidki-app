import { User } from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthApi } from './api/auth';

export type SignupResult =
  | { status: 'authenticated' }
  | { status: 'verification-required' }
  | { status: 'error'; message?: string };

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<SignupResult>;
  verifyEmail: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await AuthApi.getProfile(storedToken);
          setUser(profile.data.user);
        } catch {
          setUser(null);
          setToken(null);
          await AsyncStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await AuthApi.login({ email, password });
      if (res.success && res.data.token) {
        await AsyncStorage.setItem('authToken', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.log('login error:', error);
      // login error: [Error: Please check your email and verify your account before logging in]
      // error handled in screen
    }
    setLoading(false);
    return false;
  };

  const signup = async (userData: { email: string; password: string; firstName: string; lastName: string }): Promise<SignupResult> => {
    setLoading(true);
    try {
      const res = await AuthApi.signup(userData);
      if (res.success && res.data.token) {
        await AsyncStorage.setItem('authToken', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setLoading(false);
        return { status: 'authenticated' };
      }
      if (res.success) {
        // Account created, but the backend requires email verification
        // before issuing a session token.
        setLoading(false);
        return { status: 'verification-required' };
      }
    } catch (error: any) {
      // error handled in screen
      console.log('signup error:', error);
      setLoading(false);
      return { status: 'error', message: error?.message };
    }
    setLoading(false);
    return { status: 'error' };
  };

  const verifyEmail = async (verificationToken: string) => {
    setLoading(true);
    try {
      const res = await AuthApi.verifyEmail(verificationToken);
      if (res.success && res.data.token) {
        await AsyncStorage.setItem('authToken', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setLoading(false);
        return true;
      }
    } catch {
      // error handled in screen
    }
    setLoading(false);
    return false;
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('authToken');
    setLoading(false);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const profile = await AuthApi.getProfile(token);
      setUser(profile.data.user);
    } catch {
      // silently fail
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, verifyEmail, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
