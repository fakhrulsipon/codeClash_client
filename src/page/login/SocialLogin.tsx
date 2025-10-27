import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../provider/AuthProvider";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { use } from "react";

const SocialLogin = () => {
  const { googleSignIn, githubSignIn } = use(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogle = async () => {
    try {
      const res = await googleSignIn();
      const user = res.user;

      const userData = {
        userName: user.displayName || "Unknown",
        userEmail: user.providerData?.[0]?.email || user.email || "",
        userImage: user.photoURL || "",
        userRole: "user",
      };

      // Save user to DB logic here (keep your existing logic)
      toast.success("Logged in with Google");

      const from = location.state?.from || "/";
      navigate(from);
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  const handleGithub = async () => {
    try {
      const res = await githubSignIn();
      const user = res.user;

      const userData = {
        userName: user.displayName || "Unknown",
        userEmail: user.providerData?.[0]?.email || user.email || "",
        userImage: user.photoURL || "",
        userRole: "user",
      };

      // Save user to DB logic here (keep your existing logic)
      toast.success("Logged in with GitHub");

      const from = location.state?.from || "/";
      navigate(from);
    } catch (err) {
      toast.error("GitHub login failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Google Button */}
      <button
        onClick={handleGoogle}
        className="w-full bg-white text-gray-700 border border-white/20 py-4 px-6 rounded-xl shadow-lg hover:bg-white/90 hover:shadow-orange-500/20 transition-all duration-300 flex items-center justify-center gap-3 font-medium group"
      >
        <FcGoogle className="text-xl group-hover:scale-110 transition-transform duration-200" />
        <span>Continue with Google</span>
      </button>

      {/* GitHub Button */}
      <button
        onClick={handleGithub}
        className="w-full bg-gray-900 text-white border border-gray-700 py-4 px-6 rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-3 font-medium group"
      >
        <FaGithub className="text-xl group-hover:scale-110 transition-transform duration-200" />
        <span>Continue with GitHub</span>
      </button>

      {/* Mobile Compact Layout */}
      <div className="flex gap-3 pt-2 md:hidden">
        <button
          onClick={handleGoogle}
          className="flex-1 bg-white text-gray-700 border border-white/20 py-3 rounded-xl shadow-lg hover:bg-white/90 transition-all duration-300 flex items-center justify-center"
          title="Sign in with Google"
        >
          <FcGoogle className="text-xl" />
        </button>
        <button
          onClick={handleGithub}
          className="flex-1 bg-gray-900 text-white border border-gray-700 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
          title="Sign in with GitHub"
        >
          <FaGithub className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;