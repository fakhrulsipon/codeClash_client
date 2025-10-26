import { motion, type Variants } from "framer-motion";
import { Container, Typography } from "@mui/material";
import { FaStar, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { EmojiEvents, TrendingUp, } from "@mui/icons-material";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Computer Science Student",
    feedback: "CodeClash has completely transformed how I practice coding! The real-time competitions and instant feedback helped me land my dream internship at Google.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    achievement: "Won 3 Weekly Challenges"
  },
  {
    name: "Michael Lee",
    role: "Senior Software Engineer",
    feedback: "As a tech lead, I use CodeClash for team assessments. The collaborative features provide incredible insights into problem-solving approaches.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    achievement: "Top 1% Contributor"
  },
  {
    name: "Aisha Khan",
    role: "Hackathon Organizer",
    feedback: "Hosting our university's coding competition on CodeClash was seamless. The real-time leaderboard kept 500+ participants engaged throughout!",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    achievement: "Organized 10+ Events"
  },
  {
    name: "Daniel Green",
    role: "Coding Mentor",
    feedback: "The mentorship dashboard helped me guide 50+ students effectively. Watching their progress through the analytics is incredibly rewarding.",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 5,
    achievement: "Mentored 50+ Students"
  },
  {
    name: "Emily Carter",
    role: "University Professor",
    feedback: "Integrating CodeClash into my algorithms course increased student engagement by 300%. The competitive learning environment is revolutionary.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
    achievement: "500+ Students Taught"
  },
  {
    name: "James Brown",
    role: "Full-Stack Developer",
    feedback: "The advanced challenges pushed my problem-solving skills to new heights. I've recommended CodeClash to my entire development team.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
    achievement: "Solved 200+ Problems"
  },
];

const Testimonial = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};



  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 mb-6"
          >
            <EmojiEvents className="text-yellow-400" />
            <span className="text-lg font-semibold text-white/90">
              Trusted by Thousands
            </span>
          </motion.div>

          <Typography
            variant="h2"
            className="text-center font-bold mb-6 !text-4xl md:!text-6xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            What Our{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Community
            </span>{" "}
            Says
          </Typography>

          <Typography
            variant="h6"
            className="text-center text-gray-300 !mt-6 max-w-3xl mx-auto !text-xl leading-relaxed"
          >
            Join thousands of developers, students, and educators who have transformed 
            their coding journey with CodeClash's innovative learning platform.
          </Typography>
        </motion.div>

        {/* Testimonial Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
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
              <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 h-full transition-all duration-500 group-hover:border-cyan-500/30">
                
                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="relative z-10 h-full flex flex-col">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <FaQuoteLeft className="text-cyan-400/40 text-2xl" />
                  </div>

                  {/* Feedback Text */}
                  <Typography
                    variant="body1"
                    className="text-gray-300 leading-relaxed flex-1 group-hover:text-white/90 transition-colors duration-300 italic"
                  >
                    {testimonial.feedback}
                  </Typography>

                  {/* Closing Quote Icon */}
                  <div className="self-end mt-2">
                    <FaQuoteRight className="text-cyan-400/40 text-xl" />
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors duration-300"
                      />
                      {/* Online Indicator */}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                    </div>
                    
                    <div className="flex-1">
                      <Typography
                        variant="h6"
                        className="font-bold text-white group-hover:text-cyan-300 transition-colors duration-300"
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-cyan-300/80 text-sm"
                      >
                        {testimonial.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-yellow-400/80 text-xs mt-1"
                      >
                        {testimonial.achievement}
                      </Typography>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <FaStar className="text-yellow-400 text-sm" />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Achievement Badge */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full"
                    >
                      <TrendingUp className="text-cyan-400 text-sm" />
                    </motion.div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
                  <div className="absolute inset-[2px] rounded-3xl bg-slate-900"></div>
                </div>
              </div>

              {/* Floating Elements */}
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

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-white/10"
        >
          {[
            { number: "10K+", label: "Active Users", icon: "👥" },
            { number: "4.9/5", label: "Average Rating", icon: "⭐" },
            { number: "50+", label: "Countries", icon: "🌎" },
            { number: "99.9%", label: "Uptime", icon: "⚡" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default Testimonial;