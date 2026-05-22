"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const particles = Array.from({ length: 20 }, (_, i) => {
  const x = Math.random() * 100;
  return {
    id: i,
    x,
    animateY: -200 - Math.random() * 200,
    animateX: `${x + (Math.random() - 0.5) * 40}vw`,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    color: [
      "bg-navy",
      "bg-navy-light",
      "bg-amber-400",
      "bg-green-400",
      "bg-blue-400",
      "bg-purple-400",
      "bg-pink-400",
    ][Math.floor(Math.random() * 7)],
  };
});

export default function Celebration() {
  const [visible, setVisible] = useState(true);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    // Clean up the query param silently without triggering a re-render
    window.history.replaceState(null, "", "/dashboard");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 backdrop-blur-sm"
        >
          {/* Particles */}
          {showParticles &&
            particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 0, x: `${p.x}vw`, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [0, p.animateY],
                  x: p.animateX,
                  scale: [0, 1, 1, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeOut",
                }}
                className={`pointer-events-none absolute bottom-0 ${p.color} rounded-full`}
                style={{ width: p.size, height: p.size }}
              />
            ))}

          {/* Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
            className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
          >
            {/* Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                duration: 0.6,
                delay: 0.2,
                bounce: 0.5,
              }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
              </motion.div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Sparkles className="mx-auto mb-3 h-6 w-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-navy">
                You&apos;re all set!
              </h2>
              <p className="mt-2 text-sm text-navy/50">
                Your personalized portfolio is ready. Let&apos;s start building
                your financial future.
              </p>
            </motion.div>

            {/* Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-8"
            >
              <button
                onClick={handleDismiss}
                className="w-full rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-navy/30 transition-all hover:bg-navy-light"
              >
                Start exploring
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
