import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'student' | 'admin';
export type SubscriptionStatus = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  subscription: SubscriptionStatus;
  language: string;
  createdAt: string;
  completedLessons: string[];
  enrolledCourses: string[];
  favorites: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => void;
  completeLesson: (lessonId: string) => void;
  enrollCourse: (courseId: string) => void;
  toggleFavorite: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users for showcase
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@gloss.academy',
    name: 'Alex Gloss',
    role: 'admin',
    subscription: 'enterprise',
    language: 'en',
    createdAt: '2024-01-15',
    completedLessons: ['l1', 'l2', 'l3', 'l4', 'l5'],
    enrolledCourses: ['c1', 'c2', 'c3'],
    favorites: ['c1', 'a1'],
  },
  {
    id: '2',
    email: 'student@gloss.academy',
    name: 'Demo Student',
    role: 'student',
    subscription: 'pro',
    language: 'en',
    createdAt: '2024-06-01',
    completedLessons: ['l1', 'l2'],
    enrolledCourses: ['c1'],
    favorites: ['c2'],
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gloss-user');
    return saved ? JSON.parse(saved) : null;
  });

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('gloss-user', JSON.stringify(u));
    else localStorage.removeItem('gloss-user');
  };

  const login = useCallback(async (email: string, _password: string) => {
    const found = DEMO_USERS.find(u => u.email === email);
    if (found) {
      persistUser(found);
      return true;
    }
    // For demo, any valid email logs in as student
    if (email.includes('@')) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        role: 'student',
        subscription: 'free',
        language: 'en',
        createdAt: new Date().toISOString(),
        completedLessons: [],
        enrolledCourses: [],
        favorites: [],
      };
      persistUser(newUser);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (email: string, _password: string, name: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role: 'student',
      subscription: 'free',
      language: 'en',
      createdAt: new Date().toISOString(),
      completedLessons: [],
      enrolledCourses: [],
      favorites: [],
    };
    persistUser(newUser);
    return true;
  }, []);

  const logout = useCallback(() => persistUser(null), []);

  const resetPassword = useCallback(async (_email: string) => true, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('gloss-user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      if (prev.completedLessons.includes(lessonId)) return prev;
      const updated = { ...prev, completedLessons: [...prev.completedLessons, lessonId] };
      localStorage.setItem('gloss-user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const enrollCourse = useCallback((courseId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      if (prev.enrolledCourses.includes(courseId)) return prev;
      const updated = { ...prev, enrolledCourses: [...prev.enrolledCourses, courseId] };
      localStorage.setItem('gloss-user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const favorites = prev.favorites.includes(id)
        ? prev.favorites.filter(f => f !== id)
        : [...prev.favorites, id];
      const updated = { ...prev, favorites };
      localStorage.setItem('gloss-user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login, register, logout, resetPassword,
      updateProfile, completeLesson, enrollCourse, toggleFavorite,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
