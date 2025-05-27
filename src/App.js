import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";
import "./App.css";

const images = [
  { src: "/images/photo1.jpeg", caption: "Their first trip together ❤️" },
  { src: "/images/photo2.jpeg", caption: "Love for the mountains!!" },
  { src: "/images/photo3.jpeg", caption: "The proposal moment 💍" },
  { src: "/images/photo4.jpeg", caption: "So Happy Together!!" },
  { src: "/images/photo5.jpeg", caption: "Yahan kuch likhna padega" },
  { src: "/images/photo6.jpeg", caption: "Yahan kuch likhna padega" },
  { src: "/images/photo7.jpeg", caption: "Yahan kuch likhna padega" },
  { src: "/images/photo8.jpeg", caption: "Fofo doesn't like sharing :(" },
  { src: "/images/photo9.jpeg", caption: "But Fofo share for Nikki :)" },
];

function App() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={images[current].src}
            src={images[current].src}
            alt={`Slide ${current}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6 }}
            className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain"
          />
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
    <motion.p
      key={images[current].caption || current}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="mt-4 text-lg italic text-gray-300"
    >
      {images[current].caption}
    </motion.p>
  </AnimatePresence>

      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${
              idx === current ? "bg-white" : "bg-gray-600"
            }`}
            onClick={() => setCurrent(idx)}
            role="button"
            aria-label={`Go to slide ${idx + 1}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setCurrent(idx);
            }}
          />
        ))}
      </div>

      <audio autoPlay loop>
        <source src="/song.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default App;
