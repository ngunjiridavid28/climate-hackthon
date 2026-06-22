import React from "react";
import { motion } from "motion/react";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  ctaButton?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Hero banner component with background illustration
 */
export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaButton,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-lg border border-border bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 p-12 md:p-16 ${className}`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }
          : {}
      }
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/95" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-foreground leading-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl text-lg text-foreground-muted"
        >
          {subtitle}
        </motion.p>

        {ctaButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={ctaButton.onClick}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {ctaButton.label}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
