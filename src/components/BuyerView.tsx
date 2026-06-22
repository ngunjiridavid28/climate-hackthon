import React, { useState, useEffect } from "react";
import { api } from "../lib/api.js";
import { ListingItem, UserProfile } from "../types.js";
import { Search, MapPin, Scale, Leaf, Heart, ArrowRight, ShieldCheck, HelpCircle, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BuyerViewProps {
  user: UserProfile;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
  listings: ListingItem[];
  onRefresh: () => void;
  openContactPartner: (partnerId: string, partnerName: string, listingId: string) => void;
}

export const BuyerView: React.FC<BuyerViewProps> = ({ 
  user, 
  showToast, 
  listings: initialListings, 
  onRefresh,
  openContactPartner
}) => {
  const [listings, setListings] = useState<ListingItem[]>(initialListings);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [material, setMaterial] = useState("");
  const [location, setLocation] = useState("");
  const [minRecyclability, setMinRecyclability] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Saved listings storage
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);

  // Selected Listing Detail Popup
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  
  // Quotation Submission Drawer
  const [bidMessage, setBidMessage] = useState("");
  const [submittingBid, setSubmittingBid] = useState(false);

  // Fetch / Query filtered list
  const applyFilters = async () => {
    setLoading(true);
    try {
      const response = await api.getListings({
        search,
        material,
        location,
        minRecyclability: Number(minRecyclability),
        maxPrice: maxPrice ? Number(maxPrice) : "",
        condition
      });
      setListings(response.listings);
    } catch (e: any) {
      showToast("Failed to apply filters.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [search, material, location, minRecyclability, maxPrice, condition]);

  // Load Saved Listings list
  useEffect(() => {
    const saved = localStorage.getItem(`saved_listings_${user.id}`);
    if (saved) {
      setSavedListingIds(JSON.parse(saved));
    }
  }, [user.id]);

  const toggleSaveListing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (savedListingIds.includes(id)) {
      updated = savedListingIds.filter(item => item !== id);
      showToast("Listing removed from favorites", "info");
    } else {
      updated = [...savedListingIds, id];
      showToast("Listing saved to favorites!", "success");
    }
    setSavedListingIds(updated);
    localStorage.setItem(`saved_listings_${user.id}`, JSON.stringify(updated));
  };

  const handleQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing || !bidMessage) return;
    setSubmittingBid(true);

    try {
      await api.requestQuotation({
        listingId: selectedListing.id,
        message: bidMessage
      });
      showToast("Quotation request sent to seller!", "success");
      setBidMessage("");
      setSelectedListing(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || "Quotation submittal failed", "error");
    } finally {
      setSubmittingBid(false);
    }
  };

  return (
    <div className="space-y-6" id="buyer-page-wrapper">
      {/* Search and Filters Hub */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-md space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by material fabric, composition, location or keywords..."
              className="w-full bg-surface-alt border border-border-light focus:border-primary text-foreground text-sm pl-10 pr-4 py-3 rounded-xl outline-none transition"
              id="buyer-search-input"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 rounded-xl border font-semibold flex items-center gap-2 cursor-pointer transition text-xs ${
              showFilters ? "bg-primary/10 text-primary border-primary/30" : "bg-surface-alt text-foreground-muted border-border hover:text-foreground"
            }`}
            id="btn-toggle-filters"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters Panel Expansion */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border/50 overflow-hidden"
              id="expanded-filters-panel"
            >
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted">Fabric Composition</label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full text-xs bg-surface-alt border border-border text-foreground rounded-lg p-2.5 outline-none focus:border-primary"
                >
                  <option value="">All Materials</option>
                  <option value="Cotton">Pure Cotton</option>
                  <option value="Denim">Recycled Denim</option>
                  <option value="Polyester">Polyester (Synthetic)</option>
                  <option value="Fleece">Fleece Fabrics</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted">Location Base</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mombasa"
                  className="w-full text-xs bg-surface-alt border border-border text-foreground rounded-lg p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted">Min Recyclability</label>
                <select
                  value={minRecyclability}
                  onChange={(e) => setMinRecyclability(e.target.value)}
                  className="w-full text-xs bg-surface-alt border border-border text-foreground rounded-lg p-2.5 outline-none focus:border-primary"
                >
                  <option value="0">Any Score</option>
                  <option value="50">50% + (Intermediate)</option>
                  <option value="75">75% + (Pure Monomaterial)</option>
                  <option value="90">90% + (Highly Recyclable)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted">Max Budget (KES)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full text-xs bg-surface-alt border border-border text-foreground rounded-lg p-2.5 outline-none focus:border-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid of Listings */}
      {loading ? (
        <div className="text-center py-20 text-foreground-muted">Querying marketplace records...</div>
      ) : listings.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center text-foreground-muted text-sm">
          No matching textile waste batches found. Try broadening your query!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="buyer-listings-grid">
          {listings.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedListing(item)}
              className="bg-surface border border-border/60 hover:border-border hover:shadow-lg rounded-2xl overflow-hidden shadow-md flex flex-col justify-between group cursor-pointer transition relative"
              id={`listing-card-${item.id}`}
            >
              {/* Image Section */}
              <div className="relative h-44 overflow-hidden bg-surface-alt">
                <img
                  src={item.imageUrl}
                  alt={item.fabricType}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                
                {/* Floating Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <span className="bg-primary text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    RECYCLABILITY: {item.recyclabilityScore}%
                  </span>
                  {item.status === "SOLD" && (
                    <span className="bg-secondary text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">
                      SOLD
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => toggleSaveListing(item.id, e)}
                  className="absolute top-3 right-3 bg-background/80 hover:bg-background text-foreground p-1.5 rounded-full transition"
                  title="Bookmark"
                >
                  <Heart className={`w-4 h-4 ${savedListingIds.includes(item.id) ? "fill-red-500 text-red-500" : "text-white/80"}`} />
                </button>

                {/* Foot indicators */}
                <div className="absolute bottom-3 left-3 bg-background/80 border border-border backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] text-accent font-bold flex items-center gap-1.5 shadow-sm">
                  <Leaf className="w-3.5 h-3.5 text-accent" />
                  -{item.carbonSavingsKg} Kg CO2
                </div>
              </div>

              {/* Text Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition truncate">{item.fabricType}</h3>
                  <p className="text-xs text-foreground-muted mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                  <div className="flex justify-between text-xs text-foreground-muted font-medium">
                    <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5" /> {item.weightKg} Kg</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location.split(",")[0]}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1.5">
                    <span className="text-primary font-black text-base">
                      KES {item.estimatedPriceKES?.toLocaleString()}
                    </span>
                    <span className="text-[10px] bg-surface-alt text-foreground-muted px-2 py-1 border border-border/60 rounded font-bold uppercase truncate max-w-28" title={item.material}>
                      {item.material.split(" ")[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Popup Modal */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 bg-background/85 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface border border-border rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative block"
              id="buyer-detail-modal"
            >
              {/* Modal Body Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-full bg-surface-alt border-r border-border/30">
                  <img
                    src={selectedListing.imageUrl}
                    alt={selectedListing.fabricType}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex flex-col justify-end p-5">
                    <h3 className="text-xl font-black text-foreground">{selectedListing.fabricType}</h3>
                    <div className="text-xs text-accent font-bold flex items-center gap-1 mt-1">
                      <Leaf className="w-4 h-4 text-accent" />
                      Saving approx {selectedListing.carbonSavingsKg} kg in carbon outputs
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-primary/10 text-primary border border-primary/30 text-[10px] px-2.5 py-1 rounded font-bold uppercase">
                        RECYCLABILITY: {selectedListing.recyclabilityScore}%
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="text-foreground-muted hover:text-foreground font-semibold text-xs"
                      id="modal-close"
                    >
                      Close [X]
                    </button>
                  </div>

                  <div className="space-y-3">
                    <span className="text-foreground-muted text-[10px] uppercase font-bold tracking-wider block">Description & composition</span>
                    <p className="text-xs text-foreground leading-relaxed font-semibold">{selectedListing.description}</p>
                    <div className="bg-surface-alt/70 p-3.5 rounded-xl border border-border text-xs text-foreground grid grid-cols-2 gap-2 font-medium">
                      <span>• Composition: <strong className="text-foreground">{selectedListing.material}</strong></span>
                      <span>• Condition: <strong className="text-foreground">{selectedListing.condition}</strong></span>
                      <span>• Weight: <strong className="text-foreground">{selectedListing.weightKg} Kg</strong></span>
                      <span>• Color palette: <strong className="text-foreground">{selectedListing.color}</strong></span>
                    </div>
                  </div>

                  {/* Recommendation and Upcycles */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-foreground-muted text-[10px] uppercase font-bold tracking-wider block">Recommended Upcycling Actions</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedListing.upcyclingIdeas?.map((idea, i) => (
                          <span key={i} className="bg-surface-alt border border-border text-foreground text-[10px] px-2 py-1 rounded">
                            {idea}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-border/50 pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-foreground-muted text-[9px]">Sellers Valuation estimate</span>
                          <div className="text-xl font-bold text-primary">KES {selectedListing.estimatedPriceKES?.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-foreground-muted text-[9px]">Location Base</span>
                          <div className="text-sm font-bold text-foreground uppercase">{selectedListing.location.split(",")[0]}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit quotation bid action form */}
                  {selectedListing.status !== "SOLD" && selectedListing.sellerId !== user.id && (
                    <form onSubmit={handleQuotationSubmit} className="border-t border-border/50 pt-4 space-y-3">
                      <span className="text-foreground-muted text-[10px] uppercase font-bold tracking-wider block">Request Quotation / Submit Bid Terms</span>
                      <textarea
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        placeholder="Hi! State your purchase price proposal, pickup logistics, and payment terms..."
                        required
                        className="w-full min-h-[70px] bg-surface-alt border border-border focus:border-primary text-foreground text-xs p-2.5 rounded-xl outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedListing(null);
                            openContactPartner(selectedListing.sellerId, selectedListing.sellerName || "Seller", selectedListing.id);
                          }}
                          className="bg-surface-alt hover:bg-surface border border-border text-foreground font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Send Message
                        </button>
                        <button
                          type="submit"
                          disabled={submittingBid || !bidMessage}
                          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          Submit Bid Offer
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
