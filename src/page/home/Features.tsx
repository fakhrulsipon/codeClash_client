import React from "react";
import { motion } from "framer-motion";
import { Container, Typography } from "@mui/material";
import {
  Code,
  People,
  RocketLaunch,
  Security,
  EmojiEvents,
  Terminal,
  TrendingUp,
  CloudQueue,
} from "@mui/icons-material";
import { FaCode, FaUsers, FaRocket, FaShieldAlt, FaTrophy, FaChartLine, FaLightbulb, FaCloud } from "react-icons/fa";

const Features: React.FC = () => {
  const features = [
    {
      icon: <Terminal sx={{ fontSize: 40 }} />,
      title: "Live Code Editor",
      desc: "Real-time coding environment with syntax highlighting, auto-completion, and instant execution.",
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/10 to-blue-500/10",
      delay: 0.1
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: "Daily Challenges",
      desc: "Fresh coding problems every day with varying difficulty levels to keep you sharp.",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      delay: 0.2
    },
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: "Community Battles",
      desc: "Compete with developers worldwide in real-time coding contests and tournaments.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      delay: 0.3
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: "Progress Analytics",
      desc: "Track your growth with detailed insights, performance metrics, and skill assessments.",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      delay: 0.4
    },
    {
      icon: <RocketLaunch sx={{ fontSize: 40 }} />,
      title: "Instant Feedback",
      desc: "Get immediate results with our advanced code execution and testing framework.",
      gradient: "from-red-500 to-rose-500",
      bgGradient: "from-red-500/10 to-rose-500/10",
      delay: 0.5
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: "Secure Environment",
      desc: "Enterprise-grade security ensuring your code and data remain protected always.",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
      delay: 0.6
    },
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: "Multi-Language Support",
      desc: "Code in Python, JavaScript, Java, C++, and more with full language support.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      delay: 0.7
    },
    {
      icon: <CloudQueue sx={{ fontSize: 40 }} />,
      title: "Cloud Integration",
      desc: "Seamlessly sync your projects across devices with our cloud-based platform.",
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-500/10 to-cyan-500/10",
      delay: 0.8
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <Container maxWidth="xl" className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 mb-6"
          >
            <RocketLaunch className="text-yellow-400" />
            <span className="text-lg font-semibold text-white/90">
              Powerful Features
            </span>
          </motion.div>

          <Typography
            variant="h2"
            className="text-center font-bold mb-6 !text-4xl md:!text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CodeClash
            </span>
            ?
          </Typography>

          <Typography
            variant="h6"
            className="text-center text-gray-300 !mt-6 max-w-3xl mx-auto !text-xl leading-relaxed"
          >
            Experience the next generation of coding practice with cutting-edge features 
            designed to accelerate your learning and maximize your potential.
          </Typography>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Card Background */}
              <div className={`relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-8 h-full transition-all duration-500 group-hover:border-white/20`}>
                
                {/* Animated Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="relative z-10">
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg mb-6`}
                  >
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <Typography
                    variant="h5"
                    className="font-bold mb-4 text-white group-hover:text-cyan-100 transition-colors duration-300"
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    className="text-gray-300 leading-relaxed group-hover:text-white/80 transition-colors duration-300"
                  >
                    {feature.desc}
                  </Typography>
                </div>

                {/* Hover Border Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}>
                  <div className="absolute inset-[2px] rounded-3xl bg-slate-900"></div>
                </div>
              </div>

              {/* Floating Elements on Hover */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full blur-sm"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full blur-sm"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Code className="text-cyan-400" />
            <Typography variant="h6" className="text-white font-semibold">
              Ready to start your coding journey?
            </Typography>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Join Now
            </motion.button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Features;