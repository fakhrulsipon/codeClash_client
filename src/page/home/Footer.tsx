import { motion } from "framer-motion";
import { 
  FaCode, 
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaDiscord,
  FaHeart,
  FaRocket,
  FaShieldAlt,
  FaUsers,
  FaTrophy,
  FaGraduationCap,
  FaLaptopCode
} from "react-icons/fa";
import { 
  Code,
  School,
  Business,
  Groups,
  Security,
  TrendingUp
} from "@mui/icons-material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Live Code Editor", icon: <Code className="text-sm" />, href: "/editor" },
        { name: "Team Challenges", icon: <Groups className="text-sm" />, href: "/team-challenges" },
        { name: "Competitive Coding", icon: <FaTrophy className="text-sm" />, href: "/contests" },
        { name: "Progress Analytics", icon: <TrendingUp className="text-sm" />, href: "/analytics" },
        { name: "AI Problem Generator", icon: <FaRocket className="text-sm" />, href: "/ai-problems" }
      ]
    },
    {
      title: "Solutions",
      links: [
        { name: "For Education", icon: <School className="text-sm" />, href: "/education" },
        { name: "For Recruiting", icon: <Business className="text-sm" />, href: "/recruiting" },
        { name: "Corporate Training", icon: <FaUsers className="text-sm" />, href: "/corporate" },
        { name: "Hackathons", icon: <FaLaptopCode className="text-sm" />, href: "/hackathons" },
        { name: "Code Assessment", icon: <Security className="text-sm" />, href: "/assessment" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", icon: "📚", href: "/docs" },
        { name: "API Reference", icon: "🔌", href: "/api" },
        { name: "Tutorials", icon: "🎓", href: "/tutorials" },
        { name: "Blog", icon: "✍️", href: "/blog" },
        { name: "Community", icon: "👥", href: "/community" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", icon: "🏢", href: "/about" },
        { name: "Careers", icon: "💼", href: "/careers" },
        { name: "Contact", icon: "📞", href: "/contact" },
        { name: "Privacy Policy", icon: <FaShieldAlt className="text-sm" />, href: "/privacy" },
        { name: "Terms of Service", icon: "📄", href: "/terms" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FaGithub />, href: "https://github.com", label: "GitHub" },
    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaLinkedin />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <FaDiscord />, href: "https://discord.com", label: "Discord" }
  ];

  const techStack = [
    "TypeScript", "React", "Node.js", "MongoDB", "Docker", "WebSockets", 
    "Redis", "AWS", "Jest", "WebRTC"
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-t border-white/10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="relative z-10 px-4 pt-20 pb-8 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 row-gap-10 mb-16 lg:grid-cols-6">
          {/* Brand & Description */}
          <div className="md:max-w-md lg:col-span-2">
            <motion.a
              href="/"
              aria-label="CodeClash"
              title="CodeClash"
              className="inline-flex items-center group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/25">
                <FaCode className="text-white text-xl" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                CodeClash
              </span>
            </motion.a>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 text-gray-400 leading-relaxed"
            >
              A next-generation platform for competitive coding, real-time collaboration, 
              and skill development. Empowering developers worldwide with AI-powered 
              challenges and comprehensive learning tools.
            </motion.p>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6"
            >
              <div className="text-sm font-semibold text-cyan-400 mb-3">Built With</div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 gap-8 row-gap-8 lg:col-span-4 md:grid-cols-4">
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              >
                <p className="font-semibold text-white tracking-wide mb-6 text-lg">
                  {section.title}
                </p>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                    >
                      <motion.a
                        href={link.href}
                        className="flex items-center gap-3 text-gray-400 hover:text-cyan-300 transition-all duration-300 group/link"
                        whileHover={{ x: 4 }}
                      >
                        <span className="text-cyan-400/60 group-hover/link:text-cyan-300 transition-colors duration-300">
                          {link.icon}
                        </span>
                        <span className="text-sm">{link.name}</span>
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-between pt-8 pb-6 border-t border-white/10 lg:flex-row"
        >
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 lg:mb-0">
            <p className="text-sm text-gray-400 flex items-center gap-2">
              © {currentYear} CodeClash. Crafted with 
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <FaHeart className="text-red-400" />
              </motion.span>
              for the developer community
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-gray-400 hover:text-cyan-300 transition-all duration-300"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <FaGraduationCap className="text-cyan-400" />
            <span className="text-sm text-gray-400">
              Join <span className="text-cyan-400 font-semibold">10,000+</span> developers mastering competitive programming
            </span>
            <motion.a
              href="/get-started"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Start Coding
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;