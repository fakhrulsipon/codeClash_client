import { useState, useEffect, useContext } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../provider/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";

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
  const { user } = useContext(AuthContext)!;
  const [code, setCode] = useState<string>("// এখানে কোড লিখুন");
  const [selectedLang, setSelectedLang] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const { data: problem, isLoading, error } = useQuery<Problem>({
    queryKey: ["problem", id],
    queryFn: async () => {
      const res = await axios.get(`https://code-clash-server-rust.vercel.app/api/problems/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (problem && selectedLang) {
      setCode(
        problem.starterCode[selectedLang as keyof StarterCode] ||
          "// write your code here"
      );
    }
  }, [problem, selectedLang]);

  // 🔹 Output Normalization (for spaces, newlines, tabs)
  const normalize = (str: string) =>
    str
      .replace(/\r\n/g, "\n") // Windows newline → Unix newline
      .replace(/\r/g, "\n")   // Mac old newline → Unix newline
      .replace(/\t/g, "")      // Remove tabs
      .replace(/\s+/g, "")     // Remove all spaces/newlines
      .trim()
      .toLowerCase();

  // 🔹 Run Code
  const runCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setOutput("");

    try {
      const tc = problem.testCases[0]; // only first test case for output
      const payload = { code, language: selectedLang, input: tc.input };
      const res = await axios.post("https://code-clash-server-rust.vercel.app/api/problems/run-code", payload);
      const result = res.data;

      const userOutput =
        result.stdout?.trim() ||
        result.stderr?.trim() ||
        result.compile_output?.trim() ||
        "";

      setOutput(userOutput);
      setIsError(false);
    } catch (err) {
      console.error(err);
      setOutput("❌ Error running code");
      setIsError(true);
    } finally {
      setIsRunning(false);
    }
  };

  // 🔹 Submit Solution
  const handleSubmit = async () => {
    if (!problem) return;
    setIsRunning(true);

    try {
      const payload = {
        code,
        language: selectedLang,
        input: problem.testCases[0].input,
      };

      const res = await axios.post("https://code-clash-server-rust.vercel.app/api/problems/run-code", payload);
      const result = res.data;

      const userOutput =
        result.stdout?.trim() ||
        result.stderr?.trim() ||
        result.compile_output?.trim() ||
        "";

      const expected = normalize(problem.testCases[0].expectedOutput);
      const actual = normalize(userOutput);

      console.log("👉 Expected:", JSON.stringify(expected));
      console.log("👉 Actual:", JSON.stringify(actual));

      const status: "Success" | "Failure" =
        actual === expected ? "Success" : "Failure";

      const submissionData: SubmissionData = {
        userEmail: user?.email || "guest@example.com",
        userName: user?.displayName || "Guest User",
        status,
        problemTitle: problem.title,
        problemDifficulty: problem.difficulty,
        problemCategory: problem.category,
        point: status === "Success" ? 20 : -20,
      };

      await axios.post(
        "https://code-clash-server-rust.vercel.app/api/problems/submissions",
        submissionData
      );

      if (status === "Success")
        toast.success("🎉 Submission Successful! +20 points");
      else toast.error("❌ Wrong Answer! -20 points");
    } catch (err) {
      console.error(err);
      toast.error("Server error while submitting solution");
    } finally {
      setIsRunning(false);
    }
  };

  if (isLoading) return <LoadingSpinner/>;
  if (error) return <p>Failed to load problem</p>;
  if (!problem) return <p>Problem not found</p>;

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Left Side */}
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
          <div>
            <h3 className="font-semibold mb-1">Sample Test Case:</h3>
            <div className="mb-2 p-2 bg-gray-100 rounded">
              <p>
                <strong>Input:</strong> {problem.testCases[0].input}
              </p>
              <p>
                <strong>Expected Output:</strong>{" "}
                {problem.testCases[0].expectedOutput}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-2/3 flex flex-col">
          <h2 className="text-xl font-bold mb-2">Write Your Code</h2>
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
            language={selectedLang}
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
              fontSize: 14,
            }}
          />

          <div className="flex gap-3 mt-3">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="w-[120px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isRunning}
              className="w-[120px] px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Submit
            </button>
          </div>

          <div className="mt-4 p-3 bg-black rounded h-40 overflow-y-auto font-mono text-sm">
            <h3 className="font-semibold text-gray-200 mb-2">Output:</h3>
            <pre className={isError ? "text-red-400" : "text-green-400"}>
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
