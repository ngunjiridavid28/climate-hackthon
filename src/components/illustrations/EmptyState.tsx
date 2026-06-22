import React from "react";
import { motion } from "motion/react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustrationUrl?: string;
}

/**
 * Empty state component for when no content is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  illustrationUrl
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface/50 py-16 px-4 text-center"
    >
      {illustrationUrl ? (
        <img
          src={illustrationUrl}
          alt={title}
          className="mb-6 h-32 w-32 object-cover rounded-lg opacity-80"
        />
      ) : icon ? (
        <div className="mb-4 text-5xl text-foreground-muted">{icon}</div>
      ) : null}

      <h3 className="text-xl font-semibold text-foreground">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-foreground-muted">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};
