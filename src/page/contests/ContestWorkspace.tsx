import React, { useEffect, useState, useRef, use } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner";
import Editor from "@monaco-editor/react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { AuthContext } from "../../provider/AuthProvider";
import useAxiosSecure from "../../hook/useAxiosSecure";
import useAxiosPublic from "../../hook/useAxiosPublic";

type Problem = {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  languages: string[];
  starterCode: Record<string, string>;
  testCases?: { input: string; expectedOutput: string }[];
};

type Contest = {
  _id: string;
  title: string;
  problems: Problem[];
  type: string;
  startTime: string;
  endTime: string;
};

type Submission = {
  problemId: string;
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Pending";
  output: string;
  time: string;
};

const ContestWorkspace: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const { user } = use(AuthContext)!;
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Ref to store latest selectedLanguage for editor focus check
  const selectedLanguageRef = useRef<string | null>(selectedLanguage);
  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  // Fetch contest data
  useEffect(() => {
    if (!contestId) return;
    const fetchContest = async () => {
      try {
        const res = await axiosPublic.get<Contest>(
          `/api/contests/${contestId}`
        );
        setContest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [contestId, axiosPublic]);

  // Timer: 3 minutes per problem
  useEffect(() => {
    if (!contest) return;
    const totalTimeMs = contest.problems.length * 3 * 60 * 1000;
    const endTime = Date.now() + totalTimeMs;

    const interval = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft("00:00");
        clearInterval(interval);
        Swal.fire({
          icon: "info",
          title: "Time's up!",
          text: "Your contest time has ended.",
          confirmButtonColor: "#7c3aed",
        });
        return;
      }
      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  if (loading) return <LoadingSpinner />;
  if (!contest)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Contest not found.
      </p>
    );

  const activeProblem = contest.problems[activeProblemIndex];

  const executeCode = (): { output: string; status: Submission["status"] } => {
    let output = "";
    try {
      const consoleLog = console.log;
      console.log = (...args: unknown[]) => {
        output += args.join(" ") + "\n";
      };

      // eslint-disable-next-line no-new-func
      const result = new Function(code)();
      if (result !== undefined) output += String(result) + "\n";

      console.log = consoleLog;
      return { output: output.trim() || "No output", status: "Accepted" };
    } catch (err) {
      return { output: (err as Error).message, status: "Runtime Error" };
    }
  };

  // Run code locally (optional: store each run attempt for contest analytics)
  const handleRunCode = async () => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Not logged in",
        text: "Please login to run code.",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }
    const { output, status } = executeCode();
    const newSubmission: Submission = {
      problemId: activeProblem._id,
      status,
      output,
      time: new Date().toLocaleTimeString(),
    };
    setSubmissions((prev) => [...prev, newSubmission]);

    // Optional: send run attempts to backend (for contest analytics)
    await axiosSecure.post("/api/submissions/contest-run", {
      userEmail: user.email,
      userName: user.displayName,
      contestId: contestId,
      problemId: activeProblem._id,
      problemTitle: activeProblem.title,
      problemDifficulty: activeProblem.difficulty,
      problemCategory: activeProblem.category,
      status,
      output,
    });
  };

  // Submit code for contest (stores in submissions collection)
  const handleSubmitCode = async () => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Not logged in",
        text: "Please login to submit code.",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    const { output, status } = executeCode();
    const submissionData = {
      userEmail: user.email,
      userName: user.displayName,
      contestId: contestId,
      problemId: activeProblem._id,
      problemTitle: activeProblem.title,
      problemDifficulty: activeProblem.difficulty,
      problemCategory: activeProblem.category,
      status,
      point: status === "Accepted" ? 20 : -10,
      output,
    };

    try {
      await axiosSecure.post("/api/contestSubmissions", submissionData);

      setSubmissions((prev) => [
        ...prev,
        {
          problemId: activeProblem._id,
          status,
          output,
          time: new Date().toLocaleTimeString(),
        },
      ]);

      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Your code has been submitted successfully.",
        confirmButtonColor: "#7c3aed",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Try again.",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Problems Panel */}
      <div className="md:w-1/4 bg-gradient-to-b from-purple-200 to-purple-100 p-4 rounded-2xl shadow-lg">
        <h2 className="font-bold text-2xl mb-4 text-purple-800">Problems</h2>
        {contest.problems.map((p, idx) => (
          <button
            key={p._id}
            onClick={() => {
              setActiveProblemIndex(idx);
              setSelectedLanguage(null);
              setCode("");
            }}
            className={`block w-full text-left mb-2 px-3 py-2 rounded-lg font-medium transition ${
              idx === activeProblemIndex
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white hover:bg-purple-300"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Workspace */}
      <div className="md:w-3/4 flex flex-col gap-4">
        {/* Timer & Title */}
        <div className="flex justify-between items-center mb-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded-xl p-3 shadow-inner">
          <h2 className="font-bold text-2xl text-gray-800">
            {activeProblem.title}
          </h2>
          <span className="font-mono bg-white/50 px-3 py-1 rounded-lg">
            {timeLeft}
          </span>
        </div>

        {/* Problem Statement */}
        <div className="bg-white/80 p-4 rounded-xl shadow-md text-gray-800">
          <p className="mb-2">{activeProblem.description}</p>
          <p className="text-sm text-gray-600 mt-2">
            Difficulty: {activeProblem.difficulty} | Category:{" "}
            {activeProblem.category}
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-4 mb-2">
          <span className="font-semibold text-gray-700">Select Language:</span>
          <select
            value={selectedLanguage || ""}
            onChange={(e) => {
              const lang = e.target.value;
              setSelectedLanguage(lang);
              if (lang && activeProblem.starterCode[lang]) {
                setCode(activeProblem.starterCode[lang]);
              } else {
                setCode("");
              }
            }}
            className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="" disabled>
              -- Choose language --
            </option>
            {activeProblem.languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Monaco Editor */}

        <div className="rounded-xl overflow-hidden shadow-lg">
          <Editor
            height="350px"
            defaultLanguage={selectedLanguage || "javascript"}
            value={code}
            onChange={(value) => {
              if (!selectedLanguageRef.current) return;
              setCode(value || "");
            }}
            onMount={(editor) => {
              editor.onDidFocusEditorText(() => {
                if (!selectedLanguageRef.current) {
                  Swal.fire({
                    icon: "warning",
                    title: "Select a language first!",
                    text: "Please choose a programming language above to start coding.",
                    confirmButtonColor: "#7c3aed",
                  });
                  (editor as any).blur();
                }
              });
            }}
            theme="vs-dark"
            options={{
              readOnly: !selectedLanguage,
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleRunCode}
            className="px-5 py-2 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 transition shadow-md"
            disabled={!selectedLanguage}
          >
            Run Code
          </button>
          <button
            onClick={handleSubmitCode}
            className="px-5 py-2 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition shadow-md"
            disabled={!selectedLanguage}
          >
            Submit
          </button>
        </div>

        {/* Submissions */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl shadow-inner max-h-56 overflow-y-auto">
          <h3 className="font-bold mb-2">Submissions</h3>
          {submissions.length === 0 && (
            <p className="text-gray-500">No submissions yet.</p>
          )}
          {submissions.map((sub, idx) => (
            <div key={idx} className="mb-2 p-2 bg-white rounded shadow-sm">
              <p className="text-sm font-semibold">
                {sub.time} - {sub.status}
              </p>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {sub.output}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestWorkspace;
