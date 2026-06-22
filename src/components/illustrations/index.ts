export { IllustrationCard } from "./IllustrationCard";
export { EmptyState } from "./EmptyState";
export { FeatureSection } from "./FeatureSection";
export { HeroBanner } from "./HeroBanner";

// Illustration asset paths
export const ILLUSTRATIONS = {
  TEXTILE_SORTING: "/illustrations/textile-sorting.png",
  RECYCLING_CYCLE: "/illustrations/recycling-cycle.png",
  SUSTAINABILITY_MISSION: "/illustrations/sustainability-mission.png",
  WASTE_REDUCTION: "/illustrations/waste-reduction.png",
  MARKETPLACE_NETWORK: "/illustrations/marketplace-network.png",
  PRODUCT_CATALOG: "/illustrations/product-catalog.png"
} as const;

export type IllustrationKey = keyof typeof ILLUSTRATIONS;
