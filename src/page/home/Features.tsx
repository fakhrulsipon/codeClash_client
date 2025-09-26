import React from "react";
import { Container, Typography } from "@mui/material";
import {
  Code,
  People,
  RocketLaunch,
  Security,
} from "@mui/icons-material";

const Features: React.FC = () => {
  const features = [
    {
      icon: <Code fontSize="large" className="text-indigo-600" />,
      title: "Powerful Tools",
      desc: "Access modern coding tools and resources that simplify your journey.",
    },
    {
      icon: <People fontSize="large" className="text-indigo-600" />,
      title: "Community Support",
      desc: "Join a vibrant developer community and learn together.",
    },
    {
      icon: <RocketLaunch fontSize="large" className="text-indigo-600" />,
      title: "Faster Growth",
      desc: "Boost your skills with structured learning and guidance.",
    },
    {
      icon: <Security fontSize="large" className="text-indigo-600" />,
      title: "Secure Platform",
      desc: "Your data and projects are safe with enterprise-grade security.",
    },
  ];

  return (
    <section className=" py-20">
      <Container maxWidth="lg">
        {/* Title */}
        <Typography
          variant="h4"
          className="text-center font-bold !text-3xl md:!text-4xl"
        >
          Why Choose <span className="text-indigo-600">CodeClash</span>?
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="subtitle1"
          className="text-center text-gray-600 !mt-4 mb-10"
        >
          Discover the features that make CodeClash the perfect platform to
          learn, practice,<br /> and grow your coding skills with confidence.
        </Typography>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-md text-center hover:shadow-xl transition"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <Typography variant="h6" className="font-semibold mb-2">
                {f.title}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {f.desc}
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
