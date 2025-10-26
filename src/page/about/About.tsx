
import { Users, Target, Award, Cpu, Code2, Shield, Zap, Brain, BookOpen, GitBranch, Star, Globe, Code, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AnimatedSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay?: number;
}> = ({ icon, title, description, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-purple-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/10 transition-all duration-300 group"
    >
      <div className="text-cyan-400 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-white text-center mb-3 text-lg">{title}</h3>
      <p className="text-gray-300 text-sm text-center leading-relaxed">{description}</p>
    </motion.div>
  );
};

const About: React.FC = () => {

  const features = [
    {
      icon: <Code2 size={32} />,
      title: "Advanced Code Editor",
      description: "VS Code-like Monaco Editor with syntax highlighting, auto-completion, and real-time collaboration"
    },
    {
      icon: <Zap size={32} />,
      title: "Real-time Execution",
      description: "Instant code execution with Docker sandbox for secure testing across multiple languages"
    },
    {
      icon: <Brain size={32} />,
      title: "AI-Powered Problems",
      description: "Dynamic problem generation and intelligent feedback powered by advanced AI algorithms"
    },
    {
      icon: <GitBranch size={32} />,
      title: "Team Collaboration",
      description: "Real-time team coding with integrated chat and version control features"
    },
    {
      icon: <Shield size={32} />,
      title: "Secure Environment",
      description: "Protected code execution with isolated containers and comprehensive security measures"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Learning Paths",
      description: "Structured curriculum and progress tracking for continuous skill development"
    }
  ];

  const beneficiaries = [
    {
      icon: <Users size={40} />,
      title: "Students & Universities",
      description: "Practice coding skills, complete assignments, and prepare for technical interviews",
      color: "text-cyan-400",
      bg: "from-cyan-500/10 to-blue-500/10"
    },
    {
      icon: <Target size={40} />,
      title: "Recruiters & HR",
      description: "Screen candidates, conduct technical assessments, and identify top talent",
      color: "text-green-400",
      bg: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: <Award size={40} />,
      title: "Corporates",
      description: "Team training, skill development, and internal coding competitions",
      color: "text-purple-400",
      bg: "from-purple-500/10 to-pink-500/10"
    },
    {
      icon: <Cpu size={40} />,
      title: "Communities",
      description: "Host hackathons, coding competitions, and collaborative learning events",
      color: "text-orange-400",
      bg: "from-orange-500/10 to-red-500/10"
    }
  ];

  const techStack = [
    { name: "TypeScript", color: "bg-blue-500/20 border-blue-500/50 text-blue-300" },
    { name: "React", color: "bg-cyan-500/20 border-cyan-500/50 text-cyan-300" },
    { name: "Node.js", color: "bg-green-500/20 border-green-500/50 text-green-300" },
    { name: "MongoDB", color: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" },
    { name: "Socket.IO", color: "bg-orange-500/20 border-orange-500/50 text-orange-300" },
    { name: "Docker", color: "bg-blue-600/20 border-blue-600/50 text-blue-300" },
    { name: "AI/ML", color: "bg-purple-500/20 border-purple-500/50 text-purple-300" },
    { name: "Tailwind CSS", color: "bg-teal-500/20 border-teal-500/50 text-teal-300" }
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { number: "500+", label: "Coding Problems", icon: <Code className="w-6 h-6" /> },
    { number: "50+", label: "Contests Hosted", icon: <Award className="w-6 h-6" /> },
    { number: "24/7", label: "Live Support", icon: <Terminal className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 relative">
        <AnimatedSection>
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-cyan-500/30 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Star className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">Revolutionizing Coding Education</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            CodeClash
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Revolutionizing coding education through AI-powered challenges, 
            real-time collaboration, and competitive programming.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 font-semibold text-lg border border-cyan-400/30">
              Start Coding Now
            </button>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div 
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-cyan-400 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-12">
            Our Mission & Vision
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection delay={0.2}>
            <motion.div 
              className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-l-4 border-cyan-500 hover:shadow-cyan-500/10 transition-all duration-300 group"
              whileHover={{ y: -5 }}
            >
              <div className="text-cyan-400 mb-4">
                <Target className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                To democratize coding education by providing an accessible, collaborative platform 
                where learners of all levels can practice, compete, and grow together through 
                AI-enhanced challenges and real-time feedback.
              </p>
            </motion.div>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <motion.div 
              className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-l-4 border-purple-500 hover:shadow-purple-500/10 transition-all duration-300 group"
              whileHover={{ y: -5 }}
            >
              <div className="text-purple-400 mb-4">
                <Globe className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                To become the world's leading platform for coding education, recruitment, 
                and community building, powered by cutting-edge AI and seamless collaboration 
                tools that transform how people learn and work with code.
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              Everything you need to learn, practice, and master coding skills in a collaborative environment
            </p>
          </AnimatedSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Beneficiaries */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-12">
            Who Benefits from CodeClash?
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {beneficiaries.map((beneficiary, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div 
                className={`bg-gradient-to-br ${beneficiary.bg} backdrop-blur-xl rounded-2xl p-6 text-center border border-white/10 hover:border-${beneficiary.color.split('-')[1]}-500/30 transition-all duration-300 group`}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`mx-auto mb-4 ${beneficiary.color} group-hover:scale-110 transition-transform duration-300`}>
                  {beneficiary.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{beneficiary.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{beneficiary.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-gray-400 text-center text-lg mb-12 max-w-2xl mx-auto">
              Leveraging the latest technologies to deliver a seamless and powerful coding experience
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {techStack.map((tech, index) => (
                <motion.span
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`${tech.color} px-6 py-3 rounded-2xl font-semibold shadow-lg border backdrop-blur-sm hover:scale-110 transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Future Goals */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-12">
            What's Next?
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
            <ul className="space-y-4">
              {[
                "🚀 Multi-language support (Python, C++, Java, Go, Rust)",
                "🤖 Advanced AI mentorship with personalized learning paths",
                "📚 Integration with major Learning Management Systems",
                "🌐 Global coding competitions and hackathons",
                "💼 Enterprise features for corporate training",
                "📱 Mobile app for learning on the go",
                "🔗 API access for custom integrations",
                "🎯 Advanced analytics and progress tracking"
              ].map((goal, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center space-x-4 text-gray-300 text-lg hover:text-white transition-colors duration-300 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{goal.split(' ')[0]}</span>
                  <span>{goal.split(' ').slice(1).join(' ')}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </section>

      {/* Final CTA */}
      <section className="text-center py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-sm"></div>
        <AnimatedSection>
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Transform Your Coding Journey?
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of developers already improving their skills on CodeClash
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-10"
          >
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 font-bold text-lg border border-cyan-400/30">
              Get Started Free Today
            </button>
          </motion.div>
          <motion.p 
            className="text-gray-400 mt-4 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            No credit card required • Start coding in seconds
          </motion.p>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default About;