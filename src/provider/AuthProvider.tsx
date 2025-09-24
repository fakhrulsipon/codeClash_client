import { createUserWithEmailAndPassword, signInWithEmailAndPassword, type UserCredential } from "firebase/auth";
import { createContext, useState} from "react";
import type { ReactNode } from "react";
import { auth } from "../firebase/firebase.init";

// User টাইপ
interface User {
  email: string;
  name: string;
}

// Context টাইপ
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  registerUser: (email: string, password: string) => Promise<UserCredential>;
  loginUser: (email: string, password: string) => Promise<UserCredential>;
}

// Context তৈরি
export const AuthContext = createContext<AuthContextType | null>(null);

// Props টাইপ
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const registerUser = (email: string, password : string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const loginUser = (email:string, password:string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

  const authValue: AuthContextType = {
    user,
    setUser,
    registerUser,
    loginUser
  };

  return (
    <AuthContext value={authValue}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider;
