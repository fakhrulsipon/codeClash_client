import React from "react";

const stats = [
  {
    id: 1,
    title: "Total Users",
    value: "12,482",
    delta: "+3.4%",
    hint: "vs last week",
  },
  {
    id: 2,
    title: "Problems",
    value: "1,254",
    delta: "+0.9%",
    hint: "new this month",
  },
  {
    id: 3,
    title: "Submissions Today",
    value: "3,987",
    delta: "-1.2%",
    hint: "24h",
  },
  {
    id: 4,
    title: "Accepted Rate",
    value: "78.6%",
    delta: "+1.1%",
    hint: "avg",
  },
  {
    id: 5,
    title: "Active Users",
    value: "842",
    delta: "+6.7%",
    hint: "last 1h",
  },
  {
    id: 6,
    title: "Pending Reviews",
    value: "14",
    delta: "—",
    hint: "PRs & problem edits",
  },
];

const sparkData = [6, 9, 8, 12, 11, 14, 13, 15, 12, 16];

function Sparkline({ data = sparkData, width = 120, height = 36, trend }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const len = data.length;
  const mapX = (i) => (i / (len - 1)) * width;
  const mapY = (v) => ((max - v) / (max - min || 1)) * height;
  const d = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${mapX(i)} ${mapY(v)}`)
    .join(" ");
  const strokeColor =
    trend === "+" ? "#16a34a" : trend === "-" ? "#dc2626" : "#6b7280";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

export default function AdminDashboardHome() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Overview — static demo data (responsive cards)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-white border rounded-md text-sm shadow-sm hover:shadow-lg transition-transform">
            Refresh
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium shadow hover:scale-105 transition-transform">
            Create Problem
          </button>
        </div>
      </header>

      {/* Stats grid */}
      <section aria-labelledby="stats-heading" className="mb-6">
        <h2 id="stats-heading" className="sr-only">
          Key statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <article
              key={s.id}
              className="p-4 rounded-3xl shadow hover:shadow-lg transform hover:scale-105 transition-all border bg-gradient-to-r from-indigo-50 to-purple-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">{s.title}</p>
                  <p className="text-xl md:text-2xl font-semibold mt-1">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{s.hint}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm font-medium ${s.delta.startsWith("+") ? "text-green-600" : s.delta.startsWith("-") ? "text-red-600" : "text-gray-600"}`}
                  >
                    {s.delta}
                  </span>
                  <div className="mt-2 w-28 text-gray-400">
                    <Sparkline trend={s.delta[0]} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Larger panels */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 shadow-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Live activity (sample)</h3>
            <div className="text-sm text-gray-500">Last 24h</div>
          </div>

          <div className="w-full h-40 rounded-2xl flex items-center justify-center text-indigo-700 font-bold text-2xl bg-gradient-to-r from-indigo-100 to-purple-100">
            3,987
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-md shadow-sm">
              <p className="text-xs text-gray-500">Avg Solve Time</p>
              <p className="font-semibold mt-1">18m 24s</p>
            </div>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <p className="text-xs text-gray-500">Top Language</p>
              <p className="font-semibold mt-1">JavaScript</p>
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-2xl p-4 shadow-lg border">
          <h4 className="text-lg font-medium mb-3">Quick actions</h4>
          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-2 w-full text-left px-3 py-2 border rounded-md hover:bg-gray-100 transition">
              Review pending problems
            </button>
            <button className="flex items-center gap-2 w-full text-left px-3 py-2 border rounded-md hover:bg-gray-100 transition">
              Manage users
            </button>
            <button className="flex items-center gap-2 w-full text-left px-3 py-2 border rounded-md hover:bg-gray-100 transition">
              System status
            </button>
          </div>
        </aside>
      </section>

      {/* Recent submissions table */}
      <section className="mt-6">
        <h3 className="text-lg font-medium mb-3">Recent Submissions</h3>
        <div className="overflow-x-auto bg-white rounded-2xl p-4 shadow-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="p-2">User</th>
                <th className="p-2">Problem</th>
                <th className="p-2">Language</th>
                <th className="p-2">Result</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  user: "alice",
                  problem: "Two Sum",
                  lang: "Python",
                  result: "Accepted",
                  time: "2025-09-26 10:12",
                },
                {
                  user: "bob",
                  problem: "LRU Cache",
                  lang: "Java",
                  result: "Wrong Answer",
                  time: "2025-09-26 09:58",
                },
                {
                  user: "chuti",
                  problem: "Graph DFS",
                  lang: "C++",
                  result: "Accepted",
                  time: "2025-09-26 09:40",
                },
              ].map((r, i) => (
                <tr
                  key={i}
                  className={
                    i % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "hover:bg-gray-100"
                  }
                >
                  <td className="p-2 font-medium">{r.user}</td>
                  <td className="p-2">{r.problem}</td>
                  <td className="p-2">{r.lang}</td>
                  <td
                    className={`p-2 ${r.result === "Accepted" ? "text-green-600" : "text-red-600"}`}
                  >
                    {r.result}
                  </td>
                  <td className="p-2 text-gray-500">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-8 text-xs text-gray-400 text-center">
        Static demo data • Replace with real API responses as needed
      </footer>
    </div>
  );
}
