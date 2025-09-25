import ProblemsSection from "../../components/ProblemsSection";
import FAQ from "./FAQ";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Testimonial from "./Testimonial";

const Home = () => {
  return (
    <div>
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
