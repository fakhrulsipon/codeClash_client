import { useForm } from "react-hook-form";
import { use } from "react";
import { AuthContext } from "../../provider/AuthProvider";

type ForgotPasswordInputs = {
  email: string;
};

const ForgotPasswordPage = () => {
  const { resetPassword } = use(AuthContext)!;
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInputs>();

  const onSubmit = (data: ForgotPasswordInputs) => {
    resetPassword(data.email)
      .then(() => {
        alert("Password reset email sent! Check your inbox.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xs">
        <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
            className="mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

          <button
            type="submit"
            className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
