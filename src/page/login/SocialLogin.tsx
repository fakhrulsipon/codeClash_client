import { use } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../provider/AuthProvider";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

type UserPayload = {
  userName: string;
  userEmail: string;
  userImage: string;
  userRole: string;
};

const SocialLogin = () => {
  const { googleSignIn, githubSignIn } = use(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  

  // database a save korar function
  const saveUserToDB = async (user: UserPayload) => {
    try {
      const res = await axios.post("http://localhost:3000/api/users", user);

      if (res.data?.userId) {
        console.log("User saved to DB:", res.data.userId);
      } else {
        console.log("User already exists or could not be saved.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("DB Save Error:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const handleGoogle = () => {
    googleSignIn()
      .then((res) => {
        const user = res.user;
        console.log("userCredential",user);

        const userData: UserPayload = {
          userName: user.displayName || "Unknown",
          userEmail: user.providerData[0].email || "",
          userImage: user.photoURL || "",
          userRole: "user",
        };

        saveUserToDB(userData);

        toast.success("✅ Successfully logged in with Google");
        navigate(location.state || '/')
      })
      .catch((err) => {
        toast.error("❌ Google login failed: " + err.message);
      });
  };

  const handleGithub = () => {
    githubSignIn()
      .then((res) => {
        const user = res.user;
        console.log(user);

        const userData: UserPayload = {
          userName: user.displayName || "Unknown",
          userEmail: user.providerData[0].email || "",
          userImage: user.photoURL || "",
          userRole: "user",
        };

        saveUserToDB(userData);

        toast.success("✅ Successfully logged in with GitHub");
        navigate(location.state || '/')
      })
      .catch((err) => {
        console.log(err.message);
         toast.error("❌ GitHub login failed: " + err.message);
      });
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Google Login Button */}
      <button
        onClick={handleGoogle}
        className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 px-4 rounded-lg cursor-pointer"
      >
        <FcGoogle />
        <span>Continue with Google</span>
      </button>

      {/* GitHub Login Button */}
      <button
        onClick={handleGithub}
        className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 px-4 rounded-lg cursor-pointer"
      >
        <FaGithub />
        <span>Continue with GitHub</span>
      </button>
    </div>
  );
};

export default SocialLogin;
