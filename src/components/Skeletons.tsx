import React from "react";
import { motion } from "motion/react";

const skeletonAnimation = {
  animate: { backgroundPosition: ["0% 0%", "100% 100%"] },
  transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
};

/**
 * Generic skeleton bar for building other skeletons
 */
function SkeletonBar({ width = "w-full", height = "h-4", className = "" }) {
  return (
    <motion.div
      {...skeletonAnimation}
      className={`${width} ${height} ${className} bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded bg-[length:200%_100%]`}
    />
  );
}

/**
 * Auth card skeleton - matches AuthCard loading state
 */
export function AuthCardSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-900 rounded-lg border border-slate-800 space-y-4">
      {/* Title */}
      <SkeletonBar width="w-2/3" height="h-8" className="mb-6" />

      {/* Email input */}
      <SkeletonBar width="w-full" height="h-12" className="rounded-lg" />

      {/* Password input */}
      <SkeletonBar width="w-full" height="h-12" className="rounded-lg" />

      {/* Submit button */}
      <SkeletonBar width="w-full" height="h-12" className="rounded-lg mt-6" />

      {/* Divider and Google button */}
      <div className="pt-2 space-y-3">
        <SkeletonBar width="w-full" height="h-px" />
        <SkeletonBar width="w-2/3" height="h-10" className="rounded-lg mx-auto" />
      </div>
    </div>
  );
}

/**
 * Listing card skeleton - matches ListingItem display
 */
export function ListingCardSkeleton() {
  return (
    <div className="w-full p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-3">
      {/* Image placeholder */}
      <SkeletonBar width="w-full" height="h-40" className="rounded-lg" />

      {/* Title */}
      <SkeletonBar width="w-3/4" height="h-6" className="rounded" />

      {/* Description lines */}
      <div className="space-y-2">
        <SkeletonBar width="w-full" height="h-4" className="rounded" />
        <SkeletonBar width="w-5/6" height="h-4" className="rounded" />
      </div>

      {/* Price and button row */}
      <div className="flex justify-between items-end pt-2">
        <SkeletonBar width="w-1/3" height="h-6" className="rounded" />
        <SkeletonBar width="w-1/4" height="h-10" className="rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Chat thread skeleton
 */
export function ChatThreadSkeleton() {
  return (
    <div className="w-full p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-3">
      {/* Header with avatar and name */}
      <div className="flex items-center gap-3">
        <SkeletonBar width="w-12" height="h-12" className="rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBar width="w-2/3" height="h-5" className="rounded" />
          <SkeletonBar width="w-1/2" height="h-4" className="rounded" />
        </div>
      </div>

      {/* Message preview */}
      <div className="space-y-2 pl-15">
        <SkeletonBar width="w-5/6" height="h-4" className="rounded" />
        <SkeletonBar width="w-4/5" height="h-4" className="rounded" />
      </div>
    </div>
  );
}

/**
 * Notification item skeleton
 */
export function NotificationSkeleton() {
  return (
    <div className="w-full p-3 bg-slate-900 rounded-lg border border-slate-800 flex gap-3">
      {/* Icon placeholder */}
      <SkeletonBar width="w-10" height="h-10" className="rounded-full flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <SkeletonBar width="w-2/3" height="h-5" className="rounded" />
        <SkeletonBar width="w-5/6" height="h-4" className="rounded" />
        <SkeletonBar width="w-1/3" height="h-3" className="rounded text-xs" />
      </div>
    </div>
  );
}

/**
 * Dashboard stats skeleton
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
          <SkeletonBar width="w-1/2" height="h-4" className="rounded" />
          <SkeletonBar width="w-3/4" height="h-8" className="rounded" />
          <SkeletonBar width="w-2/3" height="h-3" className="rounded text-xs" />
        </div>
      ))}
    </div>
  );
}

/**
 * Full page skeleton for dashboard loading
 */
export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <SkeletonBar width="w-1/3" height="h-8" className="rounded" />
        <SkeletonBar width="w-2/3" height="h-5" className="rounded" />
      </div>

      {/* Stats row */}
      <StatsSkeleton />

      {/* Content section */}
      <div className="space-y-3">
        <SkeletonBar width="w-1/4" height="h-6" className="rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Listing detail page skeleton
 */
export function ListingDetailSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Hero image */}
      <SkeletonBar width="w-full" height="h-96" className="rounded-lg" />

      {/* Title and info */}
      <div className="space-y-4">
        <SkeletonBar width="w-2/3" height="h-8" className="rounded" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonBar width="w-full" height="h-4" className="rounded" />
              <SkeletonBar width="w-3/4" height="h-6" className="rounded" />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2">
          <SkeletonBar width="w-full" height="h-4" className="rounded" />
          <SkeletonBar width="w-full" height="h-4" className="rounded" />
          <SkeletonBar width="w-5/6" height="h-4" className="rounded" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <SkeletonBar width="w-1/2" height="h-12" className="rounded-lg" />
          <SkeletonBar width="w-1/2" height="h-12" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Inbox/Chat list skeleton
 */
export function InboxSkeleton() {
  return (
    <div className="w-full space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <ChatThreadSkeleton key={i} />
      ))}
    </div>
  );
}
