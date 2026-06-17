import { Router } from "express";
import { 
  getListings, 
  getListingById, 
  createListing, 
  updateListing, 
  requestQuotation, 
  getBuyerRequests, 
  updateRequestStatus 
} from "../controllers/listing.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getListings);
router.get("/bids", requireAuth, getBuyerRequests);
router.get("/:id", requireAuth, getListingById);
router.post("/", requireAuth, requireRole(["SELLER", "ADMIN"]), createListing);
router.patch("/:id", requireAuth, updateListing);
router.post("/quotation", requireAuth, requireRole(["RECYCLER", "MANUFACTURER", "ADMIN"]), requestQuotation);
router.patch("/bids/:id", requireAuth, requireRole(["SELLER", "ADMIN"]), updateRequestStatus);

export default router;
