import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { saveUserProfile } from '../firebase/services';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  isFirebaseLive: boolean;
  clearError: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  updateUserBioAndName: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'remember_me_demo_user';
const SESSION_USER_KEY = 'remember_me_session_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isFirebaseLive = isFirebaseConfigured();

  // Initialize Auth state & persist across refreshes
  useEffect(() => {
    // 1. Check if demo or saved session exists in local storage
    const storedSession = localStorage.getItem(SESSION_USER_KEY) || localStorage.getItem(DEMO_USER_KEY);
    let initialUser: AppUser | null = null;
    if (storedSession) {
      try {
        initialUser = JSON.parse(storedSession);
      } catch {
        initialUser = null;
      }
    }

    if (isFirebaseLive && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const appUser: AppUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Planner Champion',
            photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
            isDemo: false,
          };
          setUser(appUser);
          localStorage.setItem(SESSION_USER_KEY, JSON.stringify(appUser));
          localStorage.removeItem(DEMO_USER_KEY);
        } else if (initialUser) {
          setUser(initialUser);
        } else {
          setUser(null);
          localStorage.removeItem(SESSION_USER_KEY);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local / Offline demo mode
      if (initialUser) {
        setUser(initialUser);
      }
      setLoading(false);
    }
  }, [isFirebaseLive]);

  const clearError = () => setError(null);

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);

    if (!isFirebaseLive || !auth) {
      const demoUser: AppUser = {
        uid: 'user_' + btoa(email.toLowerCase()).slice(0, 12),
        email,
        displayName: email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        isDemo: true,
      };
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return;
    }

    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const appUser: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || email.split('@')[0],
        photoURL: cred.user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${cred.user.uid}`,
        isDemo: false,
      };
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(appUser));
      setUser(appUser);
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      let msg = 'Failed to sign in. Please verify your email and password.';
      if (
        fbErr.code === 'auth/user-not-found' ||
        fbErr.code === 'auth/wrong-password' ||
        fbErr.code === 'auth/invalid-credential'
      ) {
        msg = 'Invalid email or password combination.';
      } else if (fbErr.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (fbErr.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please wait a few moments and try again.';
      }
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null);

    if (!isFirebaseLive || !auth) {
      const demoUser: AppUser = {
        uid: 'user_' + Date.now(),
        email,
        displayName: name || email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        isDemo: true,
      };
      await saveUserProfile(demoUser.uid, {
        uid: demoUser.uid,
        displayName: demoUser.displayName,
        email: demoUser.email,
        photoURL: demoUser.photoURL,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const photo = `https://api.dicebear.com/7.x/bottts/svg?seed=${cred.user.uid}`;
      await updateProfile(cred.user, {
        displayName: name,
        photoURL: photo,
      });

      // Save user record in Cloud Firestore
      await saveUserProfile(cred.user.uid, {
        uid: cred.user.uid,
        displayName: name,
        email: cred.user.email,
        photoURL: photo,
        createdAt: new Date().toISOString(),
      });

      const appUser: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        photoURL: photo,
        isDemo: false,
      };
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(appUser));
      setUser(appUser);
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      let msg = 'Registration failed. Please check the details provided.';
      if (fbErr.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists.';
      } else if (fbErr.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    if (!isFirebaseLive || !auth || !googleProvider) {
      loginAsDemo();
      return;
    }

    try {
      setLoading(true);
      const cred = await signInWithPopup(auth, googleProvider);
      const photo = cred.user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${cred.user.uid}`;
      const appUser: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || 'Google User',
        photoURL: photo,
        isDemo: false,
      };

      await saveUserProfile(cred.user.uid, {
        uid: cred.user.uid,
        displayName: appUser.displayName,
        email: appUser.email,
        photoURL: photo,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(appUser));
      setUser(appUser);
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      if (fbErr.code !== 'auth/popup-closed-by-user') {
        setError('Google Sign-In failed: ' + (fbErr.message || 'Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const sendResetEmail = async (email: string) => {
    setError(null);
    if (!isFirebaseLive || !auth) {
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      const fbErr = err as { code?: string };
      let msg = 'Failed to send password reset email.';
      if (fbErr.code === 'auth/user-not-found') {
        msg = 'No user registered with this email address.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const loginAsDemo = () => {
    const demoUser: AppUser = {
      uid: 'demo_gold_vip',
      email: 'alex.gold@rememberme.app',
      displayName: 'Alex Morgan',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      isDemo: true,
    };
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const logout = async () => {
    if (isFirebaseLive && auth) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
  };

  const updateUserBioAndName = async (displayName: string, photoURL?: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      displayName,
      ...(photoURL ? { photoURL } : {}),
    };

    if (isFirebaseLive && auth && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName,
        ...(photoURL ? { photoURL } : {}),
      });
    }

    await saveUserProfile(user.uid, updatedUser);
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isFirebaseLive,
        clearError,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        sendResetEmail,
        loginAsDemo,
        logout,
        updateUserBioAndName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
