import React from "react";
import { Users, Target, Award, Cpu } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className=" min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          CodeClash
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-700">
          A real-time, team-based coding challenge platform where AI generates
          problems, evaluates submissions, and helps you grow as a coder.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-6">
          Mission & Vision
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-400">
            <h3 className="text-xl font-semibold mb-2">🎯 Mission</h3>
            <p>
              To bring students, developers, and teams together to practice and
              compete in coding challenges, improving skills through real-time
              collaboration.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-400">
            <h3 className="text-xl font-semibold mb-2">🌍 Vision</h3>
            <p>
              To become the universal platform for education, recruitment,
              hackathons, and corporate training with AI-driven coding
              solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-8 text-center">
          Key Features
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            "📚 Problem Bank with JavaScript Challenges",
            "🖥️ Monaco Code Editor (VS Code-like)",
            "⚡ Real-time Execution & Auto Test",
            "👥 Team Collaboration with Chat",
            "🏆 Leaderboard & Rankings",
            "📂 Categories & Levels",
            "💬 Team Chat Section",
            "📜 Challenge History Tracking",
            "⬇️ Report Download as PDF",
            "🤖 AI-powered Problem & Feedback",
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
            >
              {feature}
            </div>
          ))}
        </div>
      </section>

      {/* Beneficiaries */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-6 text-center">
          Who Benefits?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <Users className="mx-auto text-blue-500 mb-3" size={40} />
            <h3 className="font-semibold">Students & Universities</h3>
            <p className="text-sm text-gray-600">Practice & Assignments</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <Target className="mx-auto text-blue-500 mb-3" size={40} />
            <h3 className="font-semibold">Recruiters & HR</h3>
            <p className="text-sm text-gray-600">Screening & Assessments</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <Award className="mx-auto text-blue-500 mb-3" size={40} />
            <h3 className="font-semibold">Corporates</h3>
            <p className="text-sm text-gray-600">Training & Team Building</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <Cpu className="mx-auto text-blue-500 mb-3" size={40} />
            <h3 className="font-semibold">Communities</h3>
            <p className="text-sm text-gray-600">Hackathons & Competitions</p>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-12 px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-6 text-center">
          Technology & Innovation
        </h2>
        <p className="text-center max-w-3xl mx-auto text-gray-700">
          Powered by <strong>TypeScript</strong>, <strong>React</strong>,{" "}
          <strong>Node.js</strong>, <strong>MongoDB</strong>,{" "}
          <strong>Socket.IO</strong>, and <strong>Docker Sandbox</strong> for
          secure execution. AI is integrated for problem generation & feedback.
        </p>
      </section>

      {/* Future Goals */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-6 text-center">
          Future Goals
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Support for multiple languages (Python, C++, Java)</li>
          <li>Advanced AI hints & personalized feedback</li>
          <li>Integration with Learning Management Systems (LMS)</li>
          <li>Large-scale hackathon hosting</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-800 mb-4">
          Ready to Code with Your Team?
        </h2>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default About;
