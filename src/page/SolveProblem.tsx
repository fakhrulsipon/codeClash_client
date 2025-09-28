import React, { useState, useEffect, use } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../provider/AuthProvider";

// 🔹 Interfaces
interface StarterCode {
  javascript: string;
  python: string;
  java: string;
  c: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  languages: string[];
  starterCode: StarterCode;
  testCases: TestCase[];
  createdAt: string;
}

interface SubmissionData {
  userEmail: string;
  userName: string;
  status: "Success" | "Failure";
  problemTitle: string;
  problemDifficulty: string;
  problemCategory: string;
  point: number;
}

export default function SolveProblem() {
  const { id } = useParams<{ id: string }>();
  const { user } = use(AuthContext)!;
  const [code, setCode] = useState<string>("// এখানে কোড লিখুন");
  const [selectedLang, setSelectedLang] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  // 🔹 Fetch problem data
  const { data: problem, isLoading, error } = useQuery<Problem>({
    queryKey: ["problem", id],
    queryFn: async (): Promise<Problem> => {
      const res = await axios.get(`http://localhost:3000/api/problems/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // 🔹 Load starter code when problem or language changes
  useEffect(() => {
    if (problem && selectedLang) {
      setCode(
        problem.starterCode[selectedLang as keyof StarterCode] ||
          "// write your code here"
      );
    }
  }, [problem, selectedLang]);

  // 🔹 Run Code (all test cases)
  const runCode = (): void => {
    if (!problem) return;

    try {
      const funcNameMatch = code.match(/function (\w+)/);
      if (!funcNameMatch) throw new Error("Function name not found");

      const userFunc = new Function(code + "; return " + funcNameMatch[1] + ";")();
      let capturedOutput = "";

      for (const testCase of problem.testCases) {
        const args = JSON.parse("[" + testCase.input + "]");
        let result = userFunc(...args);

        // stringify if array or object
        if (typeof result === "object") {
          result = JSON.stringify(result);
        } else {
          result = result?.toString();
        }

        capturedOutput += result + "\n";
      }

      setOutput(capturedOutput.trim());
      setIsError(false);
    } catch (err: unknown) {
      setOutput(err instanceof Error ? "❌ Error: " + err.message : "❌ Unknown error");
      setIsError(true);
    }
  };

  // 🔹 Submit Solution (single test case check)
  const handleSubmit = async (): Promise<void> => {
    if (!problem) return;

    let allPassed = true;
    try {
      const funcNameMatch = code.match(/function (\w+)/);
      if (!funcNameMatch) throw new Error("Function name not found");

      const userFunc = new Function(code + "; return " + funcNameMatch[1] + ";")();
      const testCase = problem.testCases[0];
      const args = JSON.parse("[" + testCase.input + "]");
      let result = userFunc(...args);

      if (typeof result === "object") result = JSON.stringify(result);
      else result = result?.toString();

      if (result !== testCase.expectedOutput) allPassed = false;
    } catch {
      allPassed = false;
    }

    const status: "Success" | "Failure" = allPassed ? "Success" : "Failure";

    const submissionData: SubmissionData = {
      userEmail: user?.email || "guest@example.com",
      userName: user?.displayName || "Guest User",
      status,
      problemTitle: problem.title,
      problemDifficulty: problem.difficulty,
      problemCategory: problem.category,
      point: status === "Success" ? 20 : -20,
    };

    try {
      await axios.post("http://localhost:3000/api/submissions", submissionData);
      if (status === "Success") {
        toast.success("🎉 Submission Successful! +20 points");
      } else {
        toast.error("❌ Wrong Answer! -20 points");
      }
    } catch {
      toast.error("Server error while saving submission");
    }
  };

  if (isLoading) return <p>Loading problem...</p>;
  if (error) return <p>Failed to load problem</p>;
  if (!problem) return <p>Problem not found</p>;

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Left Side: Problem Details */}
        <div className="w-full lg:w-1/3 mb-4 lg:mb-0">
          <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
          <p className="mb-2 text-gray-700">{problem.description}</p>
          <div className="mb-4">
            <strong>Difficulty:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${
                problem.difficulty.toLowerCase() === "easy"
                  ? "bg-green-100 text-green-700"
                  : problem.difficulty.toLowerCase() === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          {/* Sample Test Case */}
          <div>
            <h3 className="font-semibold mb-1">Sample Test Case:</h3>
            <div className="mb-2 p-2 bg-gray-100 rounded">
              <p>
                <strong>Input:</strong> {problem.testCases[0].input}
              </p>
              <p>
                <strong>Expected Output:</strong> {problem.testCases[0].expectedOutput}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Code Editor */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <h2 className="text-xl font-bold mb-2">Write Your Code</h2>

          {/* Language Selector */}
          <div className="mb-3 mt-4">
            <label className="mr-2 font-medium">Language:</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              {problem.languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <Editor
            height="60vh"
            defaultLanguage={selectedLang}
            language={selectedLang}
            value={code}
            onChange={(value: string | undefined) => setCode(value ?? "")}
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
              fontSize: 14,
            }}
          />

          {/* Buttons */}
          <div className="flex gap-3 mt-3">
            <button
              onClick={runCode}
              className="w-[120px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Run Code
            </button>
            <button
              onClick={handleSubmit}
              className="w-[120px] px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Submit
            </button>
          </div>

          {/* Output */}
          <div className="mt-4 p-3 bg-black rounded h-40 overflow-y-auto font-mono text-sm">
            <h3 className="font-semibold text-gray-200 mb-2">Output:</h3>
            <pre className={isError ? "text-red-400" : "text-green-400"}>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
