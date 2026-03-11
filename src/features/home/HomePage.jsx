import React from "react";
import WorksPage from "@/features/works/WorksPage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
