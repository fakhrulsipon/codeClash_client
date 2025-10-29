import { Link } from "react-router";
import { motion } from "framer-motion";
import { 
  FaHome, 
  FaSearch, 
  FaExclamationTriangle, 
  FaRocket,
  FaCompass 
} from "react-icons/fa";

export default function Error() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Main Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center border border-red-500/30 backdrop-blur-xl">
                <FaExclamationTriangle className="w-16 h-16 text-red-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Lost in Code Space?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-md mx-auto">
              The page you're looking for seems to have compiled with errors. 
              Don't worry, even the best developers encounter bugs!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link
              to="/"
              className="group flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 border border-cyan-400/30"
            >
              <FaHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Back to Homepage
            </Link>
            
            <Link
              to="/problems"
              className="group flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <FaRocket className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Explore Problems
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-8"
          >
            <p className="text-gray-400 mb-4 text-sm">Quick Navigation</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { path: "/problems", label: "Problems", icon: FaCompass },
                { path: "/profile", label: "Profile", icon: FaSearch },
                { path: "/leaderboard", label: "Leaderboard", icon: FaRocket },
              ].map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 text-sm"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Developer Joke */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-8 border-t border-white/10"
          >
            <p className="text-gray-500 text-sm italic">
              "It works on my machine" — Every Developer
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-10 text-4xl opacity-20"
      >
        {"</>"}
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 right-10 text-4xl opacity-20"
      >
        {"{}"}
      </motion.div>

      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-10 right-1/4 w-4 h-4 bg-cyan-400 rounded-full"
      ></motion.div>

      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute bottom-20 left-1/4 w-3 h-3 bg-purple-400 rounded-full"
      ></motion.div>
    </div>
  );
}