import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { Volume2, VolumeX } from "lucide-react";
import "./index.css";
import "./App.css";

const images = [
  { src: "/images/photo1.jpeg", caption: "Their first international trip together ❤️" },
  { src: "/images/photo2.jpeg", caption: "Love for the mountains!!" },
  { src: "/images/photo3.jpeg", caption: "The proposal moment 💍" },
  { src: "/images/photo4.jpeg", caption: "So Happy Together!!" },
  { src: "/images/photo5.jpeg", caption: "Yahan kuch likhna padega" },
  { src: "/images/photo6.jpeg", caption: "Yahan kuch likhna padega" },
  { src: "/images/photo7.jpeg", caption: "Yahan kuch likhna padega" },
  { src: "/images/photo8.jpeg", caption: "Fofo doesn't like sharing :(" },
  { src: "/images/photo9.jpeg", caption: "But Fofo share for Nikki :)" },
];

function MusicPlayer() {
  const audioRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (audioRef.current && !hasInteracted) {
        audioRef.current.play().then(() => {
          setHasInteracted(true);
          setPlaying(true);
        }).catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
      }
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="fixed top-5 left-5 z-50 flex items-center gap-2">
      <audio
        ref={audioRef}
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/song.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <button
        onClick={toggleMute}
        className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {!muted && playing && (
        <div className="flex gap-[2px]">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-[3px] h-4 bg-white rounded"
              animate={{
                height: ["6px", "24px", "6px"],
              }}
              transition={{
                duration: 0.6 + i * 0.2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [current, setCurrent] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrent((prev) => (prev + 1) % images.length),
    onSwipedRight: () => setCurrent((prev) => (prev - 1 + images.length) % images.length),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    const cache = {};
    images.forEach((img) => {
      const image = new Image();
      image.src = img.src;
      image.onload = () => {
        cache[img.src] = true;
        setLoadedImages((prev) => ({ ...prev, [img.src]: true }));
      };
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const isLoaded = loadedImages[images[current].src];

  return (
    <div
      {...handlers}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center"
    >
      <div className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center">
        {!isLoaded && (
          <div className="absolute text-gray-400 text-sm animate-pulse">
            Loading...
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={images[current].src}
            src={images[current].src}
            alt={`Slide ${current}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
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

      <MusicPlayer />
    </div>
  );
}

export default App;
