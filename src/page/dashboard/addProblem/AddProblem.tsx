import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

type TestCase = { input: string; expectedOutput: string };

type FormData = {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  languages: string; 
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    c: string;
  };
  testCases: TestCase[];
};

export default function AddProblem() {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset, control } = useForm<FormData>({
    defaultValues: {
      starterCode: { javascript: "", python: "", java: "", c: "" },
      testCases: [{ input: "", expectedOutput: "" }],
      languages: "javascript, python, java, c",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "testCases",
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
  
      const payload = {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        category: data.category,
        languages: data.languages.split(",").map((lang) => lang.trim()),
        starterCode: data.starterCode,
        testCases: data.testCases.filter(tc => tc.input && tc.expectedOutput),
        createdAt: new Date(),
      };
  
      await axiosSecure.post("/api/problems", payload);
  
      Swal.fire({
        icon: 'success',
        title: 'Problem Added!',
        text: `The problem "${data.title}" has been added successfully.`,
        showConfirmButton: true,
        background: '#1e293b',
        color: 'white',
        confirmButtonColor: '#06b6d4'
      });
  
      reset();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add problem. Please try again.',
        background: '#1e293b',
        color: 'white',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Add New Problem
        </h2>
        <p className="text-gray-300 text-lg">
          Create a new coding challenge for the community
        </p>
      </motion.div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-3">
              Problem Title
            </label>
            <input
              {...register("title", { required: true })}
              type="text"
              placeholder="Enter problem title"
              className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-3">
              Problem Description
            </label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Enter detailed problem description..."
              rows={4}
              className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Difficulty and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Difficulty Level
              </label>
              <select
                {...register("difficulty", { required: true })}
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" className="bg-slate-800">Select Difficulty</option>
                <option value="easy" className="bg-slate-800 text-green-400">Easy</option>
                <option value="medium" className="bg-slate-800 text-yellow-400">Medium</option>
                <option value="hard" className="bg-slate-800 text-red-400">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cyan-300 mb-3">
                Category
              </label>
              <input
                {...register("category", { required: true })}
                type="text"
                placeholder="e.g. array, string, dynamic programming"
                className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-semibold text-cyan-300 mb-3">
              Supported Languages
            </label>
            <input
              {...register("languages")}
              type="text"
              placeholder="javascript, python, java, c"
              className="w-full bg-slate-700/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
            <p className="text-xs text-gray-400 mt-2">
              Enter programming languages separated by commas
            </p>
          </div>

          {/* Starter Code */}
          <div className="border border-white/10 rounded-2xl p-6 bg-slate-900/30">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <span>💻</span> Starter Code Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["javascript", "python", "java", "c"].map((lang) => (
                <div key={lang} className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 capitalize">
                    {lang}
                  </label>
                  <textarea
                    {...register(`starterCode.${lang}` as const)}
                    rows={3}
                    placeholder={`// Starter code for ${lang}`}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Test Cases */}
          <div className="border border-white/10 rounded-2xl p-6 bg-slate-900/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                <span>🧪</span> Test Cases
              </h3>
              <button
                type="button"
                onClick={() => append({ input: "", expectedOutput: "" })}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
              >
                + Add Test Case
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-300">
                      Test Case {index + 1}
                    </span>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Input</label>
                      <input
                        {...register(`testCases.${index}.input` as const)}
                        type="text"
                        placeholder="Test input"
                        className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Expected Output</label>
                      <input
                        {...register(`testCases.${index}.expectedOutput` as const)}
                        type="text"
                        placeholder="Expected output"
                        className="w-full bg-slate-700 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              loading 
                ? "bg-gray-600 cursor-not-allowed text-gray-400" 
                : "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white shadow-2xl hover:shadow-cyan-500/25"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Problem...
              </div>
            ) : (
              "Add Problem"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}