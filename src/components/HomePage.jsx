import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./LoadingScreen";
// import StickySections from './StickySections';
import WorksPage from "./WorksPage";
import Footer from "./Footer";
import Header from "./Header";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div
        className={`transition-opacity duration-1000 ${isLoading ? "opacity-0 h-screen overflow-hidden" : "opacity-100"}`}
      >
        {/* StickySections removed per request */}
        <div className="bg-[var(--bg-primary)]">
          <WorksPage isTeaser={true} />
          <Footer />
        </div>
        <Header />
      </div>
    </>
  );
};

export default HomePage;
