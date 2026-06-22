import React from "react";
import { motion } from "motion/react";

interface IllustrationCardProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

/**
 * Reusable illustration card component with optional animation
 */
export const IllustrationCard: React.FC<IllustrationCardProps> = ({
  src,
  alt,
  title,
  description,
  size = "md",
  className = "",
  animated = true
}) => {
  const sizeMap = {
    sm: "w-32 h-32 md:w-48 md:h-48",
    md: "w-48 h-48 md:w-96 md:h-96",
    lg: "w-80 h-80 md:w-full md:h-auto"
  };

  const Component = animated ? motion.div : "div";
  const props = animated
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        viewport: { once: true }
      }
    : {};

  return (
    <Component
      className={`flex flex-col items-center gap-4 ${className}`}
      {...props}
    >
      <div className={`${sizeMap[size]} flex items-center justify-center overflow-hidden rounded-lg border border-border bg-surface`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      {title && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-2 text-sm text-foreground-muted">{description}</p>
          )}
        </div>
      )}
    </Component>
  );
};
