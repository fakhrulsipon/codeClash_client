import { use } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../provider/AuthProvider";

const SocialLogin = () => {
  const {googleSignIn, githubSignIn} = use(AuthContext)!;

  const handleGoogle = () => {
     googleSignIn()
     .then((res) => {
      console.log(res.user)
      alert('login with google')
     })
     .catch((err) => {
      console.log('error', err.message)
     })
  }


  const handleGithub = () => {
      githubSignIn()
      .then((res) => {
       console.log(res.user)
      })
      .catch((err) => {
        console.log(err.message)
      })
     }
     
  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Google Login Button */}
      <button onClick={handleGoogle} className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 px-4 rounded-lg cursor-pointer">
        <FcGoogle />
        <span>Continue with Google</span>
      </button>

      {/* GitHub Login Button */}
      <button onClick={handleGithub} className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 px-4 rounded-lg cursor-pointer">
        <FaGithub />
        <span>Continue with GitHub</span>
      </button>
    </div>
  );
};

export default SocialLogin;
