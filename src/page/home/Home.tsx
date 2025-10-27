import ContestSection from "../../components/ContestSection";
import ProblemsSection from "../../components/ProblemsSection";
import TopUsersSection from "../../components/TopUsersSection";
import FAQ from "./FAQ";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Testimonial from "./Testimonial";

const Home = () => {
  return (
    <div>
      <Hero></Hero>
      <TopUsersSection/>
      <Features></Features>
      <ProblemsSection></ProblemsSection>
      <ContestSection></ContestSection>
      <Testimonial></Testimonial>
      <FAQ></FAQ>
      <Footer></Footer>
    </div>
  );
};

export default Home;
