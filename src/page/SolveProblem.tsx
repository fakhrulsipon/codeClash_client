import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  PlayArrow, 
  Send, 
  Code, 
  Terminal,
  CheckCircle,
  Cancel,
  Lightbulb,
  Schedule,
  Error as ErrorIcon,
  FormatListNumbered
} from "@mui/icons-material";
import { 
  FaCode, 
  FaPlay, 
  FaCheck, 
  FaTimes, 
  FaLightbulb,
  FaRocket,
  FaUser,
  FaCalendarAlt,
  FaExclamationTriangle
} from "react-icons/fa";
import { AuthContext } from "../provider/AuthProvider";
import LoadingSpinner from "../components/LoadingSpinner";
import useAxiosSecure from "../hook/useAxiosSecure";
import { useUserSubmissions } from "../hook/useUserSubmissions";

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

interface RunCodeResponse {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
  status?: string;
}

interface CodeError {
  lineNumber?: number;
  message: string;
  type: "syntax" | "runtime" | "compilation";
}

export default function SolveProblem() {
  const { id } = useParams<{ id: string }>();
  const { user } = use(AuthContext)!;
  const [code, setCode] = useState<string>("// Write your code here");
  const [selectedLang, setSelectedLang] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"problem" | "submissions">("problem");
  const [codeError, setCodeError] = useState<CodeError | null>(null);
  const [nextSubmissionNumber, setNextSubmissionNumber] = useState<number>(1);
  const axiosSecure = useAxiosSecure();
  const { addSubmission, submissions } = useUserSubmissions();

  const { data: problem, isLoading, error } = useQuery<Problem>({
    queryKey: ["problem", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/problems/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Load submission history for this specific problem
  useEffect(() => {
    if (user && problem) {
      loadSubmissionHistory();
    }
  }, [user, problem]);

  const loadSubmissionHistory = async () => {
    try {
      const res = await axiosSecure.get(`/api/problems/submissions/${user?.email}/${problem?._id}`);
      const problemSubmissions = res.data || [];
      setNextSubmissionNumber(problemSubmissions.length + 1);
    } catch (error) {
      console.error("Failed to load submission history:", error);
    }
  };

  // Get submissions for this specific problem
  const problemSubmissions = submissions.filter(
    sub => sub.problemTitle === problem?.title
  ).slice(0, 5); // Show only last 5 submissions for this problem

  useEffect(() => {
    if (problem && selectedLang) {
      setCode(
        problem.starterCode[selectedLang as keyof StarterCode] ||
          "// Write your code here\n// Start coding your solution..."
      );
    }
  }, [problem, selectedLang]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
      default: return "text-blue-400";
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "bg-green-500/20 border-green-500/30";
      case "medium": return "bg-yellow-500/20 border-yellow-500/30";
      case "hard": return "bg-red-500/20 border-red-500/30";
      default: return "bg-blue-500/20 border-blue-500/30";
    }
  };

  // 🔹 Parse Error for Line Number and Details
  const parseError = (errorMessage: string): CodeError => {
    const errorStr = errorMessage.toLowerCase();
    
    // JavaScript/TypeScript error patterns
    const jsSyntaxMatch = errorMessage.match(/at position (\d+)|line (\d+)|\((\d+):(\d+)\)/);
    if (jsSyntaxMatch) {
      const lineNumber = jsSyntaxMatch[1] || jsSyntaxMatch[2] || jsSyntaxMatch[3];
      return {
        lineNumber: parseInt(lineNumber) || undefined,
        message: errorMessage,
        type: "syntax"
      };
    }

    // Python error patterns
    const pythonMatch = errorMessage.match(/line (\d+)/);
    if (pythonMatch) {
      return {
        lineNumber: parseInt(pythonMatch[1]),
        message: errorMessage,
        type: "syntax"
      };
    }

    // Java/C compilation errors
    const compilationMatch = errorMessage.match(/error:.*|exception:.*/i);
    if (compilationMatch) {
      return {
        message: errorMessage,
        type: "compilation"
      };
    }

    // Generic runtime errors
    return {
      message: errorMessage,
      type: "runtime"
    };
  };

  // 🔹 Validate Code for console.log (for JavaScript)
  const validateCodeForConsoleLog = (): boolean => {
    if (selectedLang === "javascript" || selectedLang === "typescript") {
      const codeWithoutComments = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      const hasConsoleLog = codeWithoutComments.includes('console.log');
      if (!hasConsoleLog) {
        setCodeError({
          message: "❌ Please use console.log() to output your results for JavaScript/TypeScript code",
          type: "syntax"
        });
        toast.error("Use console.log() for output");
        return false;
      }
    }
    setCodeError(null);
    return true;
  };

  // 🔹 Output Normalization
  const normalize = (str: string) =>
    str
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\t/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  // 🔹 Format Output for Display
  const formatOutput = (output: string): string => {
    if (!output) return "";
    return output.replace(/^"|"$/g, '').trim();
  };

  // 🔹 Run Code - Enhanced with error parsing
  const runCode = async () => {
    if (!problem) return;
    
    // Validate code before running
    if (!validateCodeForConsoleLog()) {
      return;
    }

    setIsRunning(true);
    setOutput("");
    setIsError(false);
    setCodeError(null);

    try {
      const tc = problem.testCases[0];
      const payload = { 
        code, 
        language: selectedLang, 
        input: tc.input 
      };

      const res = await axiosSecure.post("/api/problems/run-code", payload);
      const result: RunCodeResponse = res.data;

      let userOutput = "";
      let errorOccurred = false;

      if (result.stdout) {
        userOutput = formatOutput(result.stdout);
      } else if (result.stderr) {
        userOutput = `Error: ${formatOutput(result.stderr)}`;
        errorOccurred = true;
        setCodeError(parseError(result.stderr));
      } else if (result.compile_output) {
        userOutput = `Compilation Error: ${formatOutput(result.compile_output)}`;
        errorOccurred = true;
        setCodeError(parseError(result.compile_output));
      } else if (result.message) {
        userOutput = formatOutput(result.message);
      } else if (result.error) {
        userOutput = `Error: ${formatOutput(result.error)}`;
        errorOccurred = true;
        setCodeError(parseError(result.error));
      } else {
        userOutput = "No output received from execution engine";
        errorOccurred = true;
      }

      setIsError(errorOccurred);
      setOutput(userOutput);

      if (errorOccurred) {
        toast.error("Code execution failed - Check error details");
      } else {
        toast.success("Code executed successfully");
      }

    } catch (err: any) {
      console.error("❌ Run code error:", err);
      
      let errorMessage = "Failed to run code";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      const parsedError = parseError(errorMessage);
      setCodeError(parsedError);
      setOutput(`❌ ${errorMessage}`);
      setIsError(true);
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  // 🔹 Submit Solution - Enhanced with global submission tracking
  const handleSubmit = async () => {
    if (!problem || !user) {
      toast.error("Please log in to submit solutions");
      return;
    }

    // Validate code before submission
    if (!validateCodeForConsoleLog()) {
      return;
    }

    setIsRunning(true);
    setOutput("");
    setIsError(false);
    setCodeError(null);

    try {
      const tc = problem.testCases[0];
      const payload = {
        code,
        language: selectedLang,
        input: tc.input,
      };

      const res = await axiosSecure.post("/api/problems/run-code", payload);
      const result: RunCodeResponse = res.data;

      let userOutput = "";
      let errorOccurred = false;

      if (result.stdout) {
        userOutput = formatOutput(result.stdout);
      } else if (result.stderr) {
        userOutput = formatOutput(result.stderr);
        errorOccurred = true;
        setCodeError(parseError(result.stderr));
      } else if (result.compile_output) {
        userOutput = formatOutput(result.compile_output);
        errorOccurred = true;
        setCodeError(parseError(result.compile_output));
      } else if (result.message) {
        userOutput = formatOutput(result.message);
      }

      setOutput(userOutput);

      // Normalize for comparison
      const expected = normalize(problem.testCases[0].expectedOutput);
      const actual = normalize(userOutput);

      const status: "Success" | "Failure" =
        !errorOccurred && actual === expected ? "Success" : "Failure";

      // Prepare submission data
      const submissionData = {
        _id: Date.now().toString(), // Temporary ID, will be replaced by backend
        userEmail: user.email,
        userName: user.displayName || "Anonymous User",
        status,
        problemTitle: problem.title,
        problemDifficulty: problem.difficulty,
        problemCategory: problem.category,
        point: status === "Success" ? 20 : -5,
        submittedAt: new Date().toISOString(),
      };

      // Save submission to database
      await axiosSecure.post("/api/problems/submissions", submissionData);

      // Add to global submission state (for navbar)
      addSubmission(submissionData);

      // Update local state for problem-specific history
      setNextSubmissionNumber(prev => prev + 1);

      // Show result to user
      if (status === "Success") {
        toast.success(`🎉 Submission Successful! +20 points`);
        setIsError(false);
      } else {
        toast.error(`❌ Submission Failed! -5 points`);
        setIsError(true);
        
        // Show detailed error information
        if (codeError) {
          setOutput(prev => 
            `${prev}\n\n--- Submission Result ---\n❌ ${codeError.type.charAt(0).toUpperCase() + codeError.type.slice(1)} Error\nLine: ${codeError.lineNumber || 'N/A'}\nMessage: ${codeError.message}`
          );
        } else {
          setOutput(prev => 
            `${prev}\n\n--- Submission Result ---\n❌ Wrong Answer\nExpected: ${problem.testCases[0].expectedOutput}\nActual: ${userOutput}`
          );
        }
      }

    } catch (err: any) {
      console.error("❌ Submission error:", err);
      
      let errorMessage = "Server error while submitting solution";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      const parsedError = parseError(errorMessage);
      setCodeError(parsedError);
      setOutput(`❌ ${errorMessage}`);
      setIsError(true);
      toast.error(`Submission failed`);
    } finally {
      setIsRunning(false);
    }
  };

  // Test the API endpoint directly
  const testEndpoint = async () => {
    try {
      const testPayload = {
        code: "console.log('Hello World');",
        language: "javascript",
        input: ""
      };
      
      const res = await axiosSecure.post("/api/problems/run-code", testPayload);
      console.log("🔧 Endpoint test response:", res.data);
      toast.success("API endpoint is working");
    } catch (err) {
      console.error("🔧 Endpoint test failed:", err);
      toast.error("API endpoint test failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-white text-center mt-8">Failed to load problem</p>;
  if (!problem) return <p className="text-white text-center mt-8">Problem not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Debug Button - Remove in production */}
        <button 
          onClick={testEndpoint}
          className="fixed top-4 right-4 z-50 px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30"
        >
          Test API
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
          {/* Left Side - Problem Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-1"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 h-full">
              {/* Problem Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyBg(problem.difficulty)} ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-cyan-400" />
                    <span>{user?.displayName || "Guest"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-400" />
                    <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 text-sm">
                  <Code className="text-sm" />
                  <span>{problem.category}</span>
                </div>
              </div>

              {/* Submission History for this Problem */}
              {problemSubmissions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FormatListNumbered className="text-green-400" />
                    Recent Submissions
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {problemSubmissions.map((submission, index) => (
                      <div
                        key={submission._id}
                        className={`flex items-center justify-between p-2 rounded-lg border ${
                          submission.status === "Success" 
                            ? "bg-green-500/10 border-green-500/30" 
                            : "bg-red-500/10 border-red-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {submission.status === "Success" ? (
                            <CheckCircle className="text-green-400 text-sm" />
                          ) : (
                            <Cancel className="text-red-400 text-sm" />
                          )}
                          <span className="text-sm text-gray-300">
                            {submission.status}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            submission.status === "Success" ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {submission.point > 0 ? `+${submission.point}` : submission.point} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Problem Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-400" />
                  Problem Description
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {problem.description}
                </p>
              </div>

              {/* Sample Test Case */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Terminal className="text-cyan-400" />
                  Sample Test Case
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <div>
                    <strong className="text-cyan-300 text-sm">Input:</strong>
                    <pre className="text-gray-200 text-sm mt-1 bg-black/20 p-2 rounded-lg">
                      {problem.testCases[0].input}
                    </pre>
                  </div>
                  <div>
                    <strong className="text-green-300 text-sm">Expected Output:</strong>
                    <pre className="text-gray-200 text-sm mt-1 bg-black/20 p-2 rounded-lg">
                      {problem.testCases[0].expectedOutput}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaCode className="text-purple-400" />
                  Language
                </h3>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  {problem.languages.map((lang) => (
                    <option key={lang} value={lang} className="bg-slate-900">
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-cyan-400 text-sm">Test Cases</div>
                  <div className="text-white font-bold">{problem.testCases.length}</div>
                </div>
                <div className="text-center p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-green-400 text-sm">Points</div>
                  <div className="text-white font-bold">20</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Code Editor & Output */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-2 flex flex-col"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 flex-1 flex flex-col">
              {/* Editor Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaRocket className="text-cyan-400" />
                  Code Editor
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Code className="text-sm" />
                  <span className="text-cyan-300">{selectedLang}</span>
                </div>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {codeError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                  >
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <FaExclamationTriangle />
                      <span className="font-semibold">
                        {codeError.type.charAt(0).toUpperCase() + codeError.type.slice(1)} Error
                        {codeError.lineNumber && ` at line ${codeError.lineNumber}`}
                      </span>
                    </div>
                    <p className="text-red-300 text-sm">{codeError.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Code Editor */}
              <div className="flex-1 mb-4 border border-white/10 rounded-xl overflow-hidden min-h-[400px]">
                <Editor
                  height="100%"
                  language={selectedLang}
                  value={code}
                  onChange={(value) => {
                    setCode(value ?? "");
                    setCodeError(null); // Clear error when user edits code
                  }}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    automaticLayout: true,
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    lineNumbers: "on",
                    glyphMargin: true,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    matchBrackets: "always",
                    scrollbar: {
                      vertical: "visible",
                      horizontal: "visible",
                      useShadows: false
                    }
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <motion.button
                  onClick={runCode}
                  disabled={isRunning}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white font-semibold rounded-xl transition-all duration-300 flex-1 justify-center"
                >
                  {isRunning ? (
                    <>
                      <Schedule className="animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <FaPlay />
                      Run Code
                    </>
                  )}
                </motion.button>

                <motion.button
                  onClick={handleSubmit}
                  disabled={isRunning}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300 flex-1 justify-center"
                >
                  {isRunning ? (
                    <>
                      <Schedule className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Submit Solution
                    </>
                  )}
                </motion.button>
              </div>

              {/* Output Panel */}
              <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col min-h-[200px]">
                <div className="flex items-center justify-between p-4 bg-black/20 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Terminal className="text-cyan-400" />
                    Output
                  </h3>
                  <div className={`flex items-center gap-2 text-sm ${isError ? 'text-red-400' : output ? 'text-green-400' : 'text-gray-400'}`}>
                    {isError ? <FaTimes /> : output ? <FaCheck /> : null}
                    {isError ? 'Error' : output ? 'Success' : 'No output'}
                  </div>
                </div>
                <div className="flex-1 p-4 font-mono text-sm overflow-auto">
                  <pre className={`whitespace-pre-wrap break-words ${isError ? "text-red-400" : "text-green-400"}`}>
                    {output || "Click 'Run Code' to see the output here..."}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}