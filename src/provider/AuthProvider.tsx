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

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
const provider = new GithubAuthProvider()

// Context টাইপ
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

// Context তৈরি
export const AuthContext = createContext<AuthContextType | null>(null);

// Props টাইপ
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true)
  console.log(user);

  const registerUser = (email: string, password: string) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email: string, password: string) => {
     setLoading(true)
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logoutUser = () => {
     setLoading(true)
    return signOut(auth);
  };

  const updateProfileInfo = (profile: {
    displayName?: string;
    photoURL?: string;
  }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return Promise.reject(new Error("No user logged in"));
    }
    return updateProfile(currentUser, profile);
  };

  const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

const googleSignIn = () => {
   setLoading(true)
        return signInWithPopup(auth, googleProvider);
    }

    const githubSignIn = () => {
       setLoading(true)
        return signInWithPopup(auth, provider);
    }

  // Firebase onAuthStateChanged হুক
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

  return <AuthContext value={authValue}>{children}</AuthContext>;
};

export default AuthProvider;
