import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import Hero from "./Hero";
import Features from "./Features";
// import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import CTA from "./CTA";

export default function LandingPage() {
  return (
    <div className="bg-pageBg min-h-screen">

      <Navbar />

      <Hero />

      <Features />

      {/* <HowItWorks /> */}

      <Testimonials />

      <CTA />

      <Footer />

    </div>
  );
}