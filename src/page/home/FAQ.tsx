import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Typography } from "@mui/material";
import { 
  ExpandMore,
  Language,
  Edit,
  Groups,
  TrendingUp
} from "@mui/icons-material";
import { FaCode, FaUsers, FaGraduationCap, FaQuestionCircle } from "react-icons/fa";

type FAQItem = {
  question: string;
  answer: ReactNode;
  icon: ReactNode;
  category: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is CodeClash?",
    answer: (
      <div className="space-y-3">
        <p>
          <span className="font-bold text-cyan-400">CodeClash</span> is a cutting-edge, real-time multiplayer coding challenge platform where developers, students, and teams can:
        </p>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Solve programming problems in competitive environments
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Collaborate in real-time with team coding sessions
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Compete on dynamic leaderboards with global rankings
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Track progress with detailed analytics and insights
          </li>
        </ul>
      </div>
    ),
    icon: <FaCode className="text-cyan-400" />,
    category: "Platform"
  },
  {
    question: "Who can use CodeClash?",
    answer: (
      <div className="space-y-4">
        {[
          { role: "🎓 Students & Universities", desc: "Practice coding, assignments, and skill evaluations" },
          { role: "💼 Recruiters & HR Teams", desc: "Conduct technical assessments and coding interviews" },
          { role: "🏢 Corporate Trainers", desc: "Organize team-based challenges and workshops" },
          { role: "🚀 Communities & Hackathons", desc: "Host online coding competitions and events" },
          { role: "🌟 Freelancers & Coaches", desc: "Showcase skills and build professional portfolios" }
        ].map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            </div>
            <div>
              <div className="font-semibold text-white">{item.role}</div>
              <div className="text-sm text-gray-400">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    icon: <FaUsers className="text-purple-400" />,
    category: "Users"
  },
  {
    question: "What programming languages are supported?",
    answer: (
      <div className="space-y-4">
        <p className="text-gray-300">
          We currently support <span className="font-bold text-yellow-400">JavaScript</span> with full execution environment.
        </p>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-sm font-semibold text-cyan-400 mb-2">Coming Soon:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {["Python", "C++", "Java", "TypeScript", "Go", "Rust"].map((lang, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                {lang}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    icon: <Language className="text-yellow-400" />,
    category: "Technical"
  },
  {
    question: "How does the code editor work?",
    answer: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Powered by <span className="font-bold text-green-400">Monaco Editor</span> — the same engine that drives VS Code.
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { feature: "Syntax Highlighting", color: "text-blue-400" },
            { feature: "Auto-completion", color: "text-green-400" },
            { feature: "Error Detection", color: "text-red-400" },
            { feature: "Code Folding", color: "text-purple-400" },
            { feature: "Multi-cursor", color: "text-cyan-400" },
            { feature: "Themes", color: "text-yellow-400" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${item.color.replace('text', 'bg')}`}></div>
              <span className={item.color}>{item.feature}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    icon: <Edit className="text-green-400" />,
    category: "Technical"
  },
  {
    question: "Can I participate as a team?",
    answer: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Yes! Form teams of <span className="font-bold text-cyan-400">2–4 members</span> for collaborative challenges.
        </p>
        <div className="space-y-3">
          {[
            { feature: "Real-time Collaborative Editor", emoji: "👥" },
            { feature: "Built-in Team Chat", emoji: "💬" },
            { feature: "Shared Code Execution", emoji: "⚡" },
            { feature: "Team Leaderboards", emoji: "🏆" }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              <span className="text-lg">{item.emoji}</span>
              <span className="text-white text-sm">{item.feature}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    icon: <Groups className="text-blue-400" />,
    category: "Collaboration"
  },
  {
    question: "How is progress tracked?",
    answer: (
      <div className="space-y-4">
        <p className="text-gray-300">
          Comprehensive progress tracking with detailed analytics and insights.
        </p>
        <div className="space-y-3">
          {[
            { metric: "Challenge History", detail: "All submissions with timestamps" },
            { metric: "Skill Analytics", detail: "Performance across categories" },
            { metric: "Achievement System", detail: "Badges and milestones" },
            { metric: "PDF Export", detail: "Portfolio-ready reports" }
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
              <span className="text-white text-sm font-medium">{item.metric}</span>
              <span className="text-gray-400 text-xs">{item.detail}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    icon: <TrendingUp className="text-orange-400" />,
    category: "Analytics"
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const filteredFaqs = activeCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <Container maxWidth="xl" className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 mb-6"
          >
            <FaQuestionCircle className="text-yellow-400" />
            <span className="text-lg font-semibold text-white/90">
              Need Help?
            </span>
          </motion.div>

          <Typography
            variant="h2"
            className="text-center font-bold mb-6 !text-4xl md:!text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Questions
            </span>
          </Typography>

          <Typography
            variant="h6"
            className="text-center text-gray-300 !mt-6 max-w-3xl mx-auto !text-xl leading-relaxed"
          >
            Everything you need to know about CodeClash — the ultimate platform for competitive coding, 
            team collaboration, and skill development.
          </Typography>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/25"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="group"
                >
                  {/* FAQ Item */}
                  <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 transition-all duration-500 group-hover:border-cyan-500/30">
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <div className="relative z-10">
                      {/* Question Button */}
                      <motion.button
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                            {faq.icon}
                          </div>
                          <Typography
                            variant="h6"
                            className="font-bold text-white group-hover:text-cyan-300 transition-colors duration-300"
                          >
                            {faq.question}
                          </Typography>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                        >
                          <ExpandMore className="text-white" />
                        </motion.div>
                      </motion.button>

                      {/* Answer Content */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 border-t border-white/10 pt-4">
                              <div className="text-gray-300 leading-relaxed">
                                {faq.answer}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-6 px-8 py-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <FaGraduationCap className="text-cyan-400 text-2xl" />
            <div className="text-left">
              <Typography variant="h6" className="text-white font-semibold">
                Still have questions?
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                Our support team is here to help you get started.
              </Typography>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default FAQ;