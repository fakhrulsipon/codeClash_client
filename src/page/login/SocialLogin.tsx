import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../provider/AuthProvider";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { use } from "react";
import type { ReactElement } from "react";
import useAxiosPublic from "../../hook/useAxiosPublic";

// 🧩 Type definitions
interface ProviderData {
  email?: string | null;
}

interface User {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  providerData: ProviderData[];
}

interface SignInResult {
  user: User;
}

interface AuthContextType {
  googleSignIn: () => Promise<SignInResult>;
  githubSignIn: () => Promise<SignInResult>;
}

interface LocationState {
  from?: string;
}

interface UserPayload {
  userName: string;
  userEmail: string;
  userImage?: string;
  userRole: string;
}

const SocialLogin = (): ReactElement => {
  const { googleSignIn, githubSignIn } = use(AuthContext)! as AuthContextType;
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  // ✅ Save user to backend
  const saveUserToDB = async (user: UserPayload): Promise<void> => {
    try {
      await axiosPublic.post("/api/users", user);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleGoogle = async (): Promise<void> => {
    try {
      const res: SignInResult = await googleSignIn();
      const user = res.user;

      const userData: UserPayload = {
        userName: user.displayName || "Unknown",
        userEmail: user.providerData?.[0]?.email || user.email || "",
        userImage: user.photoURL || "",
        userRole: "user",
      };

      await saveUserToDB(userData);
      toast.success("Logged in with Google");

      const from = (location.state as LocationState)?.from || "/";
      navigate(from);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Google login failed: " + err.message);
      } else {
        toast.error("Google login failed");
      }
    }
  };

  const handleGithub = async (): Promise<void> => {
    try {
      const res: SignInResult = await githubSignIn();
      const user = res.user;

      const userData: UserPayload = {
        userName: user.displayName || "Unknown",
        userEmail: user.providerData?.[0]?.email || user.email || "",
        userImage: user.photoURL || "",
        userRole: "user",
      };

      await saveUserToDB(userData);
      toast.success("Logged in with GitHub");

      const from = (location.state as LocationState)?.from || "/";
      navigate(from);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("GitHub login failed: " + err.message);
      } else {
        toast.error("GitHub login failed");
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={handleGoogle}
        className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 px-4 rounded-lg"
      >
        <FcGoogle />
        Continue with Google
      </button>

      <button
        onClick={handleGithub}
        className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 px-4 rounded-lg"
      >
        <FaGithub />
        Continue with GitHub
      </button>
    </div>
  );
};

export default SocialLogin;
