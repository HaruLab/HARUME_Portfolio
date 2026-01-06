import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import { Providers } from "@/components/Providers";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";

import worksData from "@/data/works_data.json";

function WorkCard({ work, index, onClick }) {
  // ... (WorkCard component remains same)
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group block cursor-pointer h-full will-change-transform"
    >
      <div className="flex flex-col h-full group">
        <div 
          className="relative aspect-video mb-4 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] transition-all duration-300 group-hover:ring-[5px] group-hover:ring-[var(--corporate-color)] group-hover:ring-inset group-hover:border-transparent"
          style={{ borderRadius: '8px' }}
        >
          <img
            loading="lazy"
            src={work.img}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
          />
        </div>
        
        <div className="flex-1 flex flex-col px-0.5 pb-2">
          <div className="flex flex-col gap-1">
             <div className="flex flex-col items-start gap-0.5">
                <h3 className="text-sm md:text-base font-black text-[var(--text-primary)] leading-tight m-0 transition-colors group-hover:text-[var(--corporate-color)] line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {work.title}
                </h3>
                <span className="text-[9px] font-bold text-[var(--text-secondary)] tracking-[0.2em] uppercase opacity-30">
                  {work.category}
                </span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const WorksPage = ({ isTeaser = false }) => {
  const [selectedWork, setSelectedWork] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL"); // Changed from activeFilter
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Map fetched data to card format and sort by date descending
  // Map fetched data to card format and sort by date descending
  // Map fetched data to card format and sort by date descending
  const works = worksData
    .map(item => {
      // Parse credits from description
      const credits = {};
      
      const roleMapping = {
        "Music Video 制作": "Movie", "動画制作": "Movie", "動画作者": "Movie", "Movie": "Movie", "Video": "Movie", "映像": "Movie", "動画": "Movie", "制作": "Movie",
        "ジャケットイラスト": "Illust", "Illust": "Illust", "Illustration": "Illust", "イラスト": "Illust", "Art": "Illust", "Ilust": "Illust", "Illstration": "Illust",
        "Vocal": "Vocal", "ボーカル": "Vocal", "歌": "Vocal", "Cast": "Cast", "出演": "Cast",
        "Mix": "Mix", "Mixing": "Mix", "ミックス": "Mix", "MIX": "Mix",
        "Music": "Music", "作曲": "Music", "Music & Lyric": "Music/Lyrics", "作詞作曲": "Music/Lyrics",
        "Lyrics": "Lyrics", "Lyric": "Lyrics", "作詞": "Lyrics",
        "Arrangement": "Arrange", "Arranged": "Arrange", "編曲": "Arrange",
        "Model": "Model", "モデル": "Model",
        "Motion": "Motion",
        "Original": "Original", "本家": "Original",
        "Mastering": "Mastering", "マスタリング": "Mastering",
        "Inst arrange": "Arrange", "Instrument": "Inst",
        "Recording": "Rec", "CV": "CV", "レコーディング": "Rec",
        "3DCG / Composite / Motion Graphics": "3D/Composite",
        "Participant": "Participant"
      };

      if (item.description_raw) {
        const lines = item.description_raw.split('\n');
        lines.forEach(line => {
          // Remove common list markers and trim
          const cleanLine = line.replace(/^[✦·・■⚡️\-\*\[\]【】]\s*/, '').trim();
          
          // Enhanced Regex to match various credit patterns from user data
          const match = cleanLine.match(/^(Music Video 制作|ジャケットイラスト|作詞作曲|Music & Lyric|動画制作|動画作者|編集ソフト|使用ソフト|ナレーション|BGM作曲|Inst arrange|Music|Vocal|Mix|Mixing|MIX|Illust|Ilust|Illstration|Illustration|Live2D|Movie|Video|Cast|Director|Model|Motion|Camera|Lyrics|Lyric|Arrangement|Tuning|Mastering|Instrument|作詞|作曲|編曲|歌|ボーカル|ミックス|イラスト|動画|映像|制作|出演|モデル|Original|Credit|Bass|Guitar|Drums|Piano|Inst|Recording|レコーディング|CV|3DCG \/ Composite \/ Motion Graphics|Participant)(?:\s*(?:&|\/|\+)\s*[a-zA-Z0-9\u3000-\u30Fe\u4e00-\u9fa0]+)*\s*[：:\-]\s*(.*)/i);
          
          if (match) {
            let rawKey = match[1].trim();
            // Normalize key using mapping, default to capitalized raw key
            let key = roleMapping[rawKey] || roleMapping[Object.keys(roleMapping).find(k => k.toLowerCase() === rawKey.toLowerCase())] || rawKey.charAt(0).toUpperCase() + rawKey.slice(1);
            
            // Clean value: remove URLs, twitter handles, and extra symbols
            let value = match[2].trim();
            value = value.replace(/https?:\/\/\S+/g, '') // Remove URLs
                         .replace(/@[a-zA-Z0-9_]+/g, '') // Remove Twitter handles
                         .replace(/\(.*\)/g, '') // Remove parentheses content if it's typically just extra info? Maybe keep for now if it's like (Guitar)
                         .trim(); 
                         
            // Further clean if value ends with symbols
            value = value.replace(/[,/|]+$/, '').trim();

            if (value && value.length > 0) {
               credits[key] = value;
            }
          }
        });
        
        if (Object.keys(credits).length === 0 && item.channel) {
          credits["Channel"] = item.channel;
        }
      } else {
         credits["Channel"] = item.channel;
      }

      return {
        title: item.title,
        category: item.category || "MV",
        img: item.thumbnail,
        href: item.url,
        description: "",
        credits: credits,
        publishDate: item.publishDate ? new Date(item.publishDate) : null
      };
    })
    .sort((a, b) => (b.publishDate || 0) - (a.publishDate || 0));

  const categories = ["ALL", "MV", "3D", "PHOTO", "自主制作"];

  const filteredWorks = works.filter((work) => {
    if (activeCategory === "ALL") return true;
    return work.category === activeCategory;
  });

  // Group works by year
  const groupedWorks = filteredWorks.reduce((acc, work) => {
    const year = work.publishDate ? work.publishDate.getFullYear() : "Unknown";
    if (!acc[year]) acc[year] = [];
    acc[year].push(work);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedWorks).sort((a, b) => b - a);

  return (
    <Providers>
      <div className={`flex flex-col bg-[var(--bg-primary)] ${!isTeaser ? 'min-h-screen' : ''}`}>
        {!isTeaser && <Header hidden={!!selectedWork} />}

        <main className={`flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 ${isTeaser ? 'py-20' : 'pb-32 md:pb-20 pt-12 md:pt-40 lg:pt-48'}`}>
          
          {/* Page Title & Showreel Section */}
          <div className="mb-6">
            <div className="flex flex-col gap-8 items-start text-left">
              {isTeaser ? (
                <div className={`flex items-center`}>
                  <div className="flex flex-col">
                    <h1 className="text-7xl md:text-9xl font-black tracking-[-0.04em] leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                      FEATURED
                    </h1>
                    <p className="mt-1 text-[var(--text-secondary)] font-medium tracking-widest text-[9px] uppercase opacity-40">
                      Highlight Projects
                    </p>
                  </div>
                </div>
              ) : null}

              {!isTeaser && (
                <div className="w-full py-4 border-t border-[var(--border-color)] overflow-hidden">
                  <a 
                    href="https://www.youtube.com/watch?v=rykHVO-OW8k&list=PL_IDDWCeMOvfUv5lD2VfvLX4TSVfLvrZv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group whitespace-nowrap"
                  >
                    <motion.div 
                      className="flex w-max"
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 30, 
                        ease: "linear" 
                      }}
                    >
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center">
                          <span className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--corporate-color)] transition-colors duration-300 mx-6" style={{ fontFamily: 'var(--font-display)' }}>
                            SHOWREEL 2026
                          </span>
                          <span className="text-4xl md:text-6xl text-[var(--corporate-color)] mx-4 -translate-y-[0.05em] leading-none">✦</span>
                          <span className="text-4xl md:text-6xl font-light tracking-widest text-[var(--text-secondary)] opacity-10 mx-6 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                            PLAYLIST
                          </span>
                          <span className="text-4xl md:text-6xl text-[var(--corporate-color)] mx-4 -translate-y-[0.05em] leading-none">✦</span>
                        </div>
                      ))}
                    </motion.div>
                  </a>
                </div>
              )}
            </div>
          </div>

          {!isTeaser && (
            <div className="flex justify-start w-full mb-12">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-12 h-12 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full text-[var(--text-primary)] hover:border-[var(--corporate-color)] hover:text-[var(--corporate-color)] transition-all uppercase group"
                  aria-label="Filter"
                >
                  <Filter size={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>

                <AnimatePresence>
                  {isFilterOpen && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsFilterOpen(false)}
                        className="fixed inset-0 bg-white/60 backdrop-blur-md z-[80]"
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10, x: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10, x: -20 }}
                        className="absolute top-full left-0 mt-4 w-72 bg-white rounded-3xl border border-[var(--border-color)] shadow-2xl z-[90] overflow-hidden p-2 origin-top-left"
                      >
                        <div className="flex flex-col">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => {
                                setActiveCategory(category);
                                setIsFilterOpen(false);
                              }}
                              className={`flex items-center justify-between px-6 py-4 text-[11px] font-black tracking-[0.2em] transition-all duration-300 uppercase rounded-2xl ${
                                activeCategory === category 
                                ? "bg-[var(--corporate-color)] text-white" 
                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                              }`}
                              style={{ fontFamily: 'var(--font-display)' }}
                            >
                              {category}
                              {activeCategory === category && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Works Grid by Year */}
          <div className="space-y-24">
            <AnimatePresence mode="wait">
              {sortedYears.map((year) => (
                 <motion.div
                   key={year}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   transition={{ duration: 0.5 }}
                 >
                   {/* Year Divider */}
                   <div className="flex items-center gap-6 mb-12">
                     <h2 className="text-5xl md:text-6xl font-black text-[var(--text-primary)] opacity-10 font-sans tracking-tighter" style={{ fontFamily: 'var(--font-display)' }}>{year}</h2>
                     <div className="h-px bg-[var(--text-primary)] flex-1 opacity-10"></div>
                   </div>

                   {/* Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                     {groupedWorks[year].map((work, index) => (
                       <WorkCard 
                         key={work.title} 
                         work={work} 
                         index={index} 
                         onClick={() => setSelectedWork(work)} 
                       />
                     ))}
                   </div>
                 </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {isTeaser && (
            <div className="mt-20 flex justify-center">
              <a 
                href="/works"
                className="px-12 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full text-sm font-black tracking-[0.3em] uppercase transition-transform hover:scale-105 active:scale-95"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                View All Works
              </a>
            </div>
          )}
        </main>

        {!isTeaser && <Footer />}

        {selectedWork && (
          <Modal card={selectedWork} onClose={() => setSelectedWork(null)} />
        )}
      </div>
    </Providers>
  );
};

export default WorksPage;
