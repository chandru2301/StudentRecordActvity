import Header from "../components/Header";
import Hero from "../components/Hero";
import LoginSection from "../components/LoginSection";
import Features from "../components/Features";
import Dashboards from "../components/Dashboards";
import About from "../components/About";
import HelpSupport from "../components/HelpSupport";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <LoginSection />
        <Features />
        <Dashboards />
        <About />
        <HelpSupport />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
