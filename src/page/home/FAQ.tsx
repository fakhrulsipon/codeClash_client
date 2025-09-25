const FAQ = () => {
  return (
    <div className="">
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight sm:text-4xl md:mx-auto">
            <span className="relative inline-block">
              <span className="relative">Frequently</span>
            </span>{" "}
            Asked Questions (FAQ)
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Everything you need to know about{" "}
            <span className="font-semibold">codeClash</span> — our multiplayer
            coding challenge platform.
          </p>
        </div>
      </div>
      <div className="max-w-screen-xl sm:mx-auto">
        <div className="grid grid-cols-1 gap-16 row-gap-8 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-xl font-medium">What is codeClash?</p>
              <p>
                <span className="font-semibold">codeClash</span> is a real-time,
                multiplayer coding challenge platform where individuals and
                teams can solve programming problems, collaborate in real-time,
                and compete on leaderboards. It’s designed for education,
                recruitment, corporate training, and coding contests.
              </p>
            </div>
            <div>
              <p className="mb-4 text-xl font-medium">
                Who can use this platform?
              </p>
              <p>
                Students & Universities → Practice, assignments, evaluations.{" "}
                <br />
                Recruiters & HR Teams → Conduct coding assessments. <br />
                Corporate Trainers → Organize team-based challenges. <br />
                Communities & Hackathons → Host online contests. <br />
                Freelancers & Coaches → Showcase skills and build portfolios.
              </p>
            </div>
            <div>
              <p className="mb-4 text-xl font-medium">
                What programming languages are supported?
              </p>
              <p>
                Currently, we are starting with{" "}
                <span className="font-semibold">JavaScript</span> problems. More
                languages (Python, C++, Java, etc.) will be added in future
                updates.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-xl font-medium">
                How does the code editor work?
              </p>
              <p>
                We use the <span className="font-semibold">Monaco Editor</span>,
                the same editor used in VS Code. It supports syntax
                highlighting, autocomplete, error detection, and code folding —
                giving a professional coding experience right in the browser.
              </p>
            </div>
            <div>
              <p className="mb-4 text-xl font-medium">
                Can I participate as a team?
              </p>
              <p>
                Yes! Users can form teams of <strong>2–3 members</strong>.
                <br />
                - Real-time collaborative editor <br />
                - Built-in team chat <br />- Leaderboard based on team
                performance
              </p>
            </div>
            <div>
              <p className="mb-4 text-xl font-medium">
                How is progress tracked?
              </p>
              <p>
                Every submission is saved in your{" "}
                <span className="font-semibold">Challenge History</span> with
                problem name, result, and timestamp. You can also export your
                progress as a <strong>PDF report</strong> for practice records
                or portfolio use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FAQ;
