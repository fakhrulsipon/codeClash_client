import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import Editor from "@monaco-editor/react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

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
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!contestId) return;

    const fetchContest = async () => {
      try {
        const res = await axios.get<Contest>(
          `http://localhost:3000/api/contests/${contestId}`
        );
        setContest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  // Countdown timer
  useEffect(() => {
    if (!contest) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(contest.endTime).getTime();
      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [contest]);

  if (loading) return <LoadingSpinner />;
  if (!contest)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">Contest not found.</p>
    );

  const activeProblem = contest.problems[activeProblemIndex];

  // Execute JavaScript code safely
  const executeCode = (): { output: string; status: Submission["status"] } => {
    let output = "";
    try {
      const consoleLog = console.log;
      console.log = (...args: any[]) => {
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

  const handleRunCode = () => {
    const { output, status } = executeCode();
    const newSubmission: Submission = {
      problemId: activeProblem._id,
      status,
      output,
      time: new Date().toLocaleTimeString(),
    };
    setSubmissions((prev) => [...prev, newSubmission]);
  };

  const handleSubmitCode = () => {
    const { output, status } = executeCode();
    const newSubmission: Submission = {
      problemId: activeProblem._id,
      status,
      output,
      time: new Date().toLocaleTimeString(),
    };
    setSubmissions((prev) => [...prev, newSubmission]);
    Swal.fire({
      icon: "success",
      title: "Submitted!",
      text: "Your code has been submitted successfully.",
      confirmButtonColor: "#7c3aed",
    });
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
              setCode(""); // reset editor when changing problem
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
          <h2 className="font-bold text-2xl text-gray-800">{activeProblem.title}</h2>
          <span className="font-mono bg-white/50 px-3 py-1 rounded-lg">{timeLeft}</span>
        </div>

        {/* Problem Statement */}
        <div className="bg-white/80 p-4 rounded-xl shadow-md text-gray-800">
          <p className="mb-2">{activeProblem.description}</p>
          <p className="text-sm text-gray-600 mt-2">
            Difficulty: {activeProblem.difficulty} | Category: {activeProblem.category}
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
                  editor.blur();
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

        {/* Submissions / Console Output */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl shadow-inner max-h-56 overflow-y-auto">
          <h3 className="font-bold mb-2">Submissions</h3>
          {submissions.length === 0 && <p className="text-gray-500">No submissions yet.</p>}
          {submissions.map((sub, idx) => (
            <div key={idx} className="mb-2 p-2 bg-white rounded shadow-sm">
              <p className="text-sm font-semibold">{sub.time} - {sub.status}</p>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{sub.output}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestWorkspace;