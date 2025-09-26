import React from "react";
import { Button, Typography, Container } from "@mui/material";

const Hero: React.FC = () => {
  return (
    <section className="relative text-white">
      {/* Overlay for better readability */}
      <div className="absolute inset-0"></div>

      <Container maxWidth="lg">
        <div className="relative flex flex-col-reverse lg:flex-row items-center gap-12 py-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <Typography
              variant="h2"
              component="h1"
              className="font-extrabold leading-tight mb-6 !text-4xl md:!text-6xl"
            >
              Build Smarter with{" "}
              <span className="text-yellow-400">CodeClash</span>
            </Typography>

            <Typography
              variant="h6"
              className="mb-8 text-gray-200 max-w-xl mx-auto lg:mx-0"
            >
              A modern platform to explore, learn, and grow with powerful tools
              and a vibrant community. Take your coding journey to the next
              level!
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center lg:justify-start">
              <Button
                variant="contained"
                size="large"
                className="!bg-yellow-400 !text-black !font-semibold !px-6 !py-3 !rounded-xl"
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                className="!border-white !text-white !px-6 !py-3 !rounded-xl hover:!bg-white hover:!text-indigo-700"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <img
              src="https://i.postimg.cc/c1Y4LQY5/christopher-gower-m-HRf-Lhg-ABo-unsplash.jpg"
              alt="Hero Illustration"
              className="w-full max-w-md mx-auto rounded-2xl drop-shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
