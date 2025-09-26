import React, { useState } from "react";

const faqs = [
  {
    question: "What is codeClash?",
    answer: (
      <>
        <span className="font-semibold">codeClash</span> is a real-time,
        multiplayer coding challenge platform where individuals and teams can
        solve programming problems, collaborate in real-time, and compete on
        leaderboards. It’s designed for education, recruitment, corporate
        training, and coding contests.
      </>
    ),
  },
  {
    question: "Who can use this platform?",
    answer: (
      <>
        Students & Universities → Practice, assignments, evaluations. <br />
        Recruiters & HR Teams → Conduct coding assessments. <br />
        Corporate Trainers → Organize team-based challenges. <br />
        Communities & Hackathons → Host online contests. <br />
        Freelancers & Coaches → Showcase skills and build portfolios.
      </>
    ),
  },
  {
    question: "What programming languages are supported?",
    answer: (
      <>
        Currently, we are starting with{" "}
        <span className="font-semibold">JavaScript</span> problems. More
        languages (Python, C++, Java, etc.) will be added in future updates.
      </>
    ),
  },
  {
    question: "How does the code editor work?",
    answer: (
      <>
        We use the <span className="font-semibold">Monaco Editor</span>, the
        same editor used in VS Code. It supports syntax highlighting,
        autocomplete, error detection, and code folding — giving a professional
        coding experience right in the browser.
      </>
    ),
  },
  {
    question: "Can I participate as a team?",
    answer: (
      <>
        Yes! Users can form teams of <strong>2–3 members</strong>. <br />
        - Real-time collaborative editor <br />
        - Built-in team chat <br />- Leaderboard based on team performance
      </>
    ),
  },
  {
    question: "How is progress tracked?",
    answer: (
      <>
        Every submission is saved in your{" "}
        <span className="font-semibold">Challenge History</span> with problem
        name, result, and timestamp. You can also export your progress as a{" "}
        <strong>PDF report</strong> for practice records or portfolio use.
      </>
    ),
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    // only one open at a time
    setOpenIndex(openIndex === index ? null : index);
  };

  // Split FAQs into 2 columns
  const leftColumn = faqs.filter((_, i) => i % 2 === 0);
  const rightColumn = faqs.filter((_, i) => i % 2 !== 0);

  const renderAccordion = (faqArray, startIndex = 0) =>
    faqArray.map((faq, i) => {
      const index = startIndex + i; // unique index for each FAQ
      return (
        <div key={index} className="border-b border-gray-300 last:border-b-0">
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
          >
            <span className="text-lg font-medium">{faq.question}</span>
            <span className="text-xl font-bold">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div className="p-4 text-gray-700 transition-all duration-300">
              {faq.answer}
            </div>
          )}
        </div>
      );
    });

  return (
    <section className="px-4 py-16 sm:py-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Frequently Asked Questions (FAQ)
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Everything you need to know about{" "}
          <span className="font-semibold">codeClash</span> — our multiplayer
          coding challenge platform.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div>{renderAccordion(leftColumn, 0)}</div>
        <div>{renderAccordion(rightColumn, leftColumn.length)}</div>
      </div>
    </section>
  );
};

export default FAQ;
