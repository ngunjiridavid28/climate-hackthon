import React from "react";
import { motion } from "motion/react";

interface FeatureSectionProps {
  title: string;
  description: string;
  illustrationUrl: string;
  features?: Array<{
    icon?: React.ReactNode;
    title: string;
    description: string;
  }>;
  imagePosition?: "left" | "right";
  className?: string;
}

/**
 * Feature section component with illustration and bullet points
 */
export const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  illustrationUrl,
  features,
  imagePosition = "right",
  className = ""
}) => {
  const imageCol = (
    <motion.div
      initial={{ opacity: 0, x: imagePosition === "left" ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="flex items-center justify-center"
    >
      <img
        src={illustrationUrl}
        alt={title}
        className="max-h-96 w-full rounded-lg border border-border shadow-lg"
      />
    </motion.div>
  );

  const contentCol = (
    <motion.div
      initial={{ opacity: 0, x: imagePosition === "left" ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <p className="mt-2 text-lg text-foreground-muted">{description}</p>
      </div>

      {features && (
        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex gap-3">
              {feature.icon && (
                <div className="mt-1 flex-shrink-0 text-xl text-primary">
                  {feature.icon}
                </div>
              )}
              <div>
                <h4 className="font-semibold text-foreground">
                  {feature.title}
                </h4>
                <p className="mt-1 text-sm text-foreground-muted">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );

  return (
    <section className={`grid gap-12 md:grid-cols-2 items-center ${className}`}>
      {imagePosition === "left" ? (
        <>
          {imageCol}
          {contentCol}
        </>
      ) : (
        <>
          {contentCol}
          {imageCol}
        </>
      )}
    </section>
  );
};
