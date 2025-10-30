import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Typography,
  Container,
  Modal,
  Box,
  IconButton,
} from "@mui/material";
import {
  FaRocket,
  FaPlay,
  FaStar,
  FaCode,
  FaUsers,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";
import DemoVideo from "../../assets/CodeClash_Demo.mp4";
import { Link } from "react-router";

const Hero: React.FC = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleOpenDemo = () => {
    setIsDemoOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoOpen(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>

        {/* Animated floating elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        {/* Shining stars */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-cyan-300 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-44 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700"></div>
      </div>

      <Container maxWidth="xl">
        <div className="relative flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-8 py-20 lg:py-32">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <FaRocket className="text-yellow-400 text-sm" />
              <span className="text-sm font-semibold text-white/80">
                Welcome to Next-Gen Coding Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Typography
                variant="h1"
                component="h1"
                className="font-extrabold leading-tight mb-6 !text-5xl md:!text-7xl lg:!text-8xl"
              >
                Build{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Smarter
                </span>
                <br />
                with{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  CodeClash
                </span>
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Typography
                variant="h5"
                className="mb-8 text-gray-300 max-w-2xl mx-auto lg:mx-0 !text-lg md:!text-xl leading-relaxed"
              >
                Master competitive programming with our cutting-edge platform.
                <span className="text-cyan-300 font-semibold">
                  {" "}
                  Solve real challenges
                </span>
                , join live contests, and elevate your coding skills to new
                heights.
              </Typography>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mt-12 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FaRocket />}
                  component={Link}
                  to="/problems"
                  className="!bg-gradient-to-r !from-yellow-400 !to-orange-500 !text-black !font-bold !px-8 !py-4 !rounded-2xl !shadow-2xl hover:!shadow-yellow-500/25 transition-all duration-300"
                >
                  Start Coding Now
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<FaPlay />}
                  onClick={handleOpenDemo}
                  className="!border-2 !border-white/30 !text-white !px-8 !py-4 !rounded-2xl !bg-white/5 !backdrop-blur-sm hover:!bg-white/10 hover:!border-white/50 transition-all duration-300"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-wrap justify-center lg:justify-start gap-8 mt-16 pt-8 border-t border-white/10"
            >
              {[
                {
                  icon: <FaUsers className="text-2xl text-cyan-400" />,
                  number: "10K+",
                  label: "Active Coders",
                },
                {
                  icon: <FaCode className="text-2xl text-yellow-400" />,
                  number: "500+",
                  label: "Problems",
                },
                {
                  icon: <FaStar className="text-2xl text-purple-400" />,
                  number: "100+",
                  label: "Contests",
                },
                {
                  icon: <FaShieldAlt className="text-2xl text-green-400" />,
                  number: "24/7",
                  label: "Support",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="text-center lg:text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {stat.icon}
                    <div className="text-2xl font-bold text-white">
                      {stat.number}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 relative"
          >
            {/* Main Image Container */}
            <div className="relative">
              {/* Gradient orb behind image */}
              <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"></div>

              {/* Main image with glass effect */}
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/20 bg-gradient-to-br from-white/5 to-white/10 shadow-2xl"
              >
                <img
                  src="https://i.postimg.cc/c1Y4LQY5/christopher-gower-m-HRf-Lhg-ABo-unsplash.jpg"
                  alt="CodeClash Platform Preview"
                  className="w-full h-auto rounded-3xl transform hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400/10 rounded-2xl backdrop-blur-sm border border-yellow-400/20 flex items-center justify-center"
              >
                <FaCode className="text-yellow-400 text-xl" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -right-4 w-16 h-16 bg-cyan-400/10 rounded-2xl backdrop-blur-sm border border-cyan-400/20 flex items-center justify-center"
              >
                <FaStar className="text-cyan-400 text-lg" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Demo Video Modal */}
      <Modal
        open={isDemoOpen}
        onClose={handleCloseDemo}
        aria-labelledby="demo-video-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: {
              xs: "95vw",
              sm: "90vw",
              md: "85vw",
              lg: "800px",
              xl: "900px",
            },
            maxWidth: "900px",
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-slate-900 rounded-xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <Typography variant="h6" className="!text-white !font-bold">
                CodeClash Platform Demo
              </Typography>
              <IconButton
                onClick={handleCloseDemo}
                className="!text-white hover:!bg-white/10 !transition-all !duration-300"
                size="small"
              >
                <FaTimes />
              </IconButton>
            </div>

            {/* Video Container */}
            <div className="p-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[60vh]"
                  style={{ maxHeight: "500px" }}
                >
                  <source src={DemoVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Demo Description */}
              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <Typography
                  variant="body2"
                  className="!text-gray-300 !text-center"
                >
                  See how CodeClash helps you master competitive programming
                  with real-time coding challenges, live contests, and
                  collaborative features.
                </Typography>
              </div>

              {/* Call to Action */}
              <div className="mt-4 flex justify-center">
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<FaRocket />}
                  onClick={handleCloseDemo}
                  className="!bg-gradient-to-r !from-cyan-500 !to-blue-600 !text-white !font-bold !px-6 !py-2 !rounded-lg hover:!shadow-lg hover:!shadow-cyan-500/25 transition-all duration-300"
                >
                  Start Your Journey
                </Button>
              </div>
            </div>
          </motion.div>
        </Box>
      </Modal>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
