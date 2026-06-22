import { Router } from "express";
import { 
  register, 
  login, 
  getProfile, 
  requestVerification, 
  requestForgotPassword,
  firebaseRegister,
  firebaseLogin,
  firebaseGoogleSignIn
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Traditional auth endpoints
router.post("/register", register);
router.post("/login", login);
router.get("/profile", requireAuth, getProfile);
router.post("/verify", requireAuth, requestVerification);
router.post("/forgot-password", requestForgotPassword);

// Firebase auth endpoints
router.post("/firebase-register", firebaseRegister);
router.post("/firebase-login", requireAuth, firebaseLogin);
router.post("/firebase-google", requireAuth, firebaseGoogleSignIn);

export default router;
