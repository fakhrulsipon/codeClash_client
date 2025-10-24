import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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
  
      await axios.post("http://localhost:3000/api/problems", payload);
  
      Swal.fire({
        icon: 'success',
        title: 'Problem Added!',
        text: `The problem "${data.title}" has been added successfully.`,
        showConfirmButton: true,
      });
  
      reset();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add problem. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-md rounded-lg">
      <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-8">
        Add Problem
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-2">Title</label>
          <input
            {...register("title", { required: true })}
            type="text"
            placeholder="Enter problem title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            {...register("description", { required: true })}
            placeholder="Enter problem description"
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Difficulty and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Difficulty</label>
            <select
              {...register("difficulty", { required: true })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Category</label>
            <input
              {...register("category", { required: true })}
              type="text"
              placeholder="e.g. array, string, dp"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="block font-semibold mb-2">
            Languages (comma separated)
          </label>
          <input
            {...register("languages")}
            type="text"
            placeholder="javascript, python, java, c"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Starter Code */}
        <div>
          <h3 className="font-semibold text-lg mt-4 mb-2">Starter Code</h3>
          {["javascript", "python", "java", "c"].map((lang) => (
            <div key={lang} className="mb-2">
              <label className="text-sm font-medium">{lang}</label>
              <textarea
                {...register(`starterCode.${lang}` as const)}
                rows={2}
                placeholder={`Starter code for ${lang}`}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          ))}
        </div>

        {/* Test Cases */}
        <div>
          <h3 className="font-semibold text-lg mt-4 mb-2">Test Cases</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="text-sm font-medium">Input {index + 1}</label>
                <input
                  {...register(`testCases.${index}.input` as const)}
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Expected Output {index + 1}
                </label>
                <input
                  {...register(`testCases.${index}.expectedOutput` as const)}
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 text-sm mt-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ input: "", expectedOutput: "" })}
            className="text-blue-600 text-sm mt-2"
          >
            + Add Test Case
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          {loading ? "Adding Problem..." : "Add Problem"}
        </button>
      </form>
    </div>
  );
}
