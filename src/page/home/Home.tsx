import ProblemsSection from "../../components/ProblemsSection";
import FAQ from "./FAQ";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Testimonial from "./Testimonial";

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400">
      <Hero></Hero>
      <Features></Features>
      <ProblemsSection></ProblemsSection>
      <Testimonial></Testimonial>
      <FAQ></FAQ>
      <Footer></Footer>
    </div>
  );
};

export default Home;
