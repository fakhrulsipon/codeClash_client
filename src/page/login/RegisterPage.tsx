import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../provider/AuthProvider";
import SocialLogin from "./SocialLogin";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  postImage?: FileList;
};

type UserPayload = {
  userName: string;
  userEmail: string;
  userImage: string;
  userRole: string;
};

const RegisterPage: React.FC = () => {
  const { registerUser, updateProfileInfo } = use(AuthContext)!;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    const imgUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    const res = await axios.post(imgUrl, formData);

    setProfileImage(res.data.data.url);
  };

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    registerUser(data.email, data.password)
      .then((res) => {
        console.log(res.user);
        const updatInfo = {
          displayName: data.fullName,
          photoURL: profileImage,
        };
        updateProfileInfo(updatInfo)
          .then(async () => {

            //post user data
            const userData: UserPayload = {
              userName: data.fullName,
              userEmail: data.email,
              userImage: profileImage,
              userRole: "user",
            };

            try {
              const response = await axios.post(
                "http://localhost:3000/api/users",
                userData
              );

              if (response.data?.userId) {
                toast.success("🎉 Account created successfully!");
                navigate(location.state || '/')
              }
            } catch (error) {
              if (error instanceof Error) {
                console.error("Error:", error.message);
              } else {
                console.error("Unexpected error:", error);
              }
            }
          })
          .catch((err) => {
            console.log("Error updating profile:", err.message);
          });
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xs">
        <div className="flex flex-col items-center">
          {/* Lock Icon */}
          <div className="bg-blue-500 rounded-full p-4 mb-4">
            <FaLock className="text-white text-2xl" />
          </div>

          <h1 className="text-2xl font-semibold mb-4">Register</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col"
          >
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName", { required: "Full Name is required" })}
              className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">
                {errors.fullName.message}
              </span>
            )}

            {/* Profile Image Upload */}
            <label className="mb-2 w-full flex flex-col items-center px-3 py-4 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition">
              {!profileImage ? (
                <span className="text-sm text-gray-600">
                  Upload Profile Image
                </span>
              ) : (
                <img
                  src={profileImage}
                  alt="Profile Preview"
                  className="w-20 h-20 object-cover rounded-full border border-gray-300"
                />
              )}
              <input
                type="file"
                onChange={handleImage}
                className="hidden"
                accept="image/*"
              />
            </label>

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", { required: "Email is required" })}
              className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}

            {/* Password */}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}

            {/* Confirm Password */}
            <div className="relative mb-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              className="mt-2 mb-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Register
            </button>

            {/* Link to Login */}
            <div className="flex justify-center items-center gap-1 mt-2 cursor-pointer">
              <p>Already have an account?</p>
              <Link
                to="/login"
                className="text-blue-500 hover:underline text-sm cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          </form>
          <SocialLogin></SocialLogin>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
