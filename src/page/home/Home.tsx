import FAQ from "./FAQ";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Testimonial from "./Testimonial";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Testimonial />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;
