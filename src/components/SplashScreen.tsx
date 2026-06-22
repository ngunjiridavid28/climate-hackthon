import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface SplashScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function SplashScreen({ isVisible, onComplete }: SplashScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "Preparing your experience...",
    "Loading UziLink...",
    "Connecting textile marketplace...",
    "Almost there..."
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible, messages.length]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,255,200,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,100,255,0.1),transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          {/* UziLink Logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              {/* Outer circle */}
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-emerald-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="50" cy="50" r="45" opacity="0.3" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  opacity="1"
                  strokeDasharray="282.6"
                  strokeDashoffset="70.65"
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          </motion.div>

          {/* Brand Text */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-bold text-white tracking-tight"
          >
            UziLink
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-slate-400 font-medium"
          >
            Textile Marketplace Platform
          </motion.p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scaleY: [1, 1.5, 1],
                backgroundColor: ["rgb(16 185 129)", "rgb(6 182 212)", "rgb(16 185 129)"]
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                repeat: Infinity,
                repeatDelay: 0.3
              }}
              className="w-2 h-8 rounded-full bg-emerald-500"
            />
          ))}
        </motion.div>

        {/* Rotating Message */}
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4 }}
          className="mt-4 text-center"
        >
          <p className="text-slate-400 text-sm h-5">
            {messages[messageIndex]}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-6 w-48 h-1 bg-slate-800 rounded-full overflow-hidden"
        >
          <motion.div
            animate={{ width: ["0%", "100%"] }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.5
            }}
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500"
          />
        </motion.div>
      </div>

      {/* Bottom Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 text-xs text-slate-500"
      >
        Building the future of textile commerce
      </motion.p>
    </motion.div>
  );
}
