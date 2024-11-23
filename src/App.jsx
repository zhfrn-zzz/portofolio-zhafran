import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";

// Landing page component that combines all main sections
const LandingPage = () => {
  return (
    <>
      <Navbar />
      <AnimatedBackground />
      <Home />
      <About />
      <Portofolio />
	  
      <ContactPage />
      <footer>
        <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6" />
        <span className="block text-sm pb-4 text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            EkiZR™
          </a>
          . All Rights Reserved.
        </span>
      </footer>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main landing page route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Additional routes for individual project pages */}
        <Route path="/project/:id" element={
          <>
            <ProjectDetails />
            <footer>
              <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6" />
              <span className="block text-sm pb-4 text-gray-500 sm:text-center dark:text-gray-400">
                © 2023{" "}
                <a href="https://flowbite.com/" className="hover:underline">
                  EkiZR™
                </a>
                . All Rights Reserved.
              </span>
            </footer>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;