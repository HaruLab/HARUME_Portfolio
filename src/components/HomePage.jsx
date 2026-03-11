import React from "react";
// import StickySections from './StickySections';
import WorksPage from "./WorksPage";
import Footer from "./Footer";
import Header from "./Header";

const HomePage = () => {
  return (
    <>
      <div className="transition-opacity duration-1000 opacity-100">
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
