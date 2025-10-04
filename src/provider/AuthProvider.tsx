import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { auth } from "../firebase/firebase.init";
import type { User as FirebaseUser } from "firebase/auth";

// Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
const githubProvider = new GithubAuthProvider();

// Context type
interface AuthContextType {
  user: FirebaseUser | null;
  setUser: (user: FirebaseUser | null) => void;
  registerUser: (email: string, password: string) => Promise<UserCredential>;
  loginUser: (email: string, password: string) => Promise<UserCredential>;
  logoutUser: () => Promise<void>;
  updateProfileInfo: (profile: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  googleSignIn: () => Promise<UserCredential>;
  githubSignIn: () => Promise<UserCredential>;
  loading: boolean;
}

// Context creation
export const AuthContext = createContext<AuthContextType | null>(null);

// Props type
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Email/Password registration
  const registerUser = (email: string, password: string) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Email/Password login
  const loginUser = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Update profile info
  const updateProfileInfo = (profile: { displayName?: string; photoURL?: string }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return Promise.reject(new Error("No user logged in"));
    return updateProfile(currentUser, profile);
  };

  // Password reset
  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Google SignIn
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider); // popup prevents COOP issues
  };

  // GitHub SignIn
  const githubSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider); // popup prevents COOP issues
  };

  // Listen to auth state changes
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const authValue: AuthContextType = {
    user,
    setUser,
    registerUser,
    loginUser,
    logoutUser,
    updateProfileInfo,
    resetPassword,
    googleSignIn,
    githubSignIn,
    loading,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
