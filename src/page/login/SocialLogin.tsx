import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

type UserPayload = {
  userName: string;
  userEmail: string;
  userImage?: string;
  userRole: string;
};

const SocialLogin = () => {
  const { googleSignIn, githubSignIn } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  // Save user to backend
  const saveUserToDB = async (user: UserPayload) => {
    try {
      const res = await axios.post("https://code-clash-server-7f46.vercel.app/api/users", user);

      if (res.data?.token) {
        localStorage.setItem("access-token", res.data.token); // ✅ store token
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleGoogle = async () => {
    try {
      const res = await googleSignIn();
      const user = res.user;

      const userData: UserPayload = {
        userName: user.displayName || "Unknown",
        userEmail: user.providerData[0].email || "",
        userImage: user.photoURL || "",
        userRole: "user",
      };

      await saveUserToDB(userData);
      toast.success("Logged in with Google");
      navigate((location.state as any)?.from || "/");
    } catch (err: any) {
      toast.error("Google login failed: " + err.message);
    }
  };

  const handleGithub = async () => {
    try {
      const res = await githubSignIn();
      const user = res.user;

      const userData: UserPayload = {
        userName: user.displayName || "Unknown",
        userEmail: user.providerData[0].email || "",
        userImage: user.photoURL || "",
        userRole: "user",
      };

      await saveUserToDB(userData);
      toast.success("Logged in with GitHub");
      navigate((location.state as any)?.from || "/");
    } catch (err: any) {
      toast.error("GitHub login failed: " + err.message);
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
