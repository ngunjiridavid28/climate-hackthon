import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { hashPassword, verifyPassword, generateToken } from "../utils/crypto.js";
import { db } from "../db.js";

/**
 * Handle user registration
 */
export async function register(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, email, password, role, organizationName, location } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill in all mandatory fields" });
    }

    const emailNorm = email.trim().toLowerCase();
    
    // Check if user exists
    const users = db.getUsers();
    if (users.some((u) => u.email.toLowerCase() === emailNorm)) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const validRoles = ["SELLER", "RECYCLER", "MANUFACTURER", "EPR", "ADMIN"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid system role provided" });
    }

    // Recyclers and manufacturers require administrative document review / approval
    const isRelationalBusiness = role === "RECYCLER" || role === "MANUFACTURER";
    const approvalStatus = isRelationalBusiness ? "PENDING" : "APPROVED";

    const newUser = {
      id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      email: emailNorm,
      passwordHash: hashPassword(password),
      role: role as any,
      verified: false, // will require simulated verification
      approvalStatus: approvalStatus as any,
      organizationName: organizationName?.trim() || "",
      location: location?.trim() || "",
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);

    // If approval is pending, send notifications to admins
    if (isRelationalBusiness) {
      db.getUsers().forEach(u => {
        if (u.role === "ADMIN") {
          db.addNotification({
            id: `notif-${Date.now()}`,
            userId: u.id,
            title: "Business Approval Needed",
            message: `New resource: ${newUser.name} registered as ${newUser.role} and requires credentials review.`,
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      });
    }

    // Auto generate JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return res.status(201).json({
      message: "Account registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        approvalStatus: newUser.approvalStatus,
        verified: newUser.verified,
        organizationName: newUser.organizationName,
        location: newUser.location
      }
    });
  } catch (error) {
    console.error("Registration endpoint failed:", error);
    return res.status(500).json({ message: "Internal server registry error" });
  }
}

/**
 * Handle user login
 */
export async function login(req: AuthenticatedRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const emailNorm = email.trim().toLowerCase();
    const users = db.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === emailNorm);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(400).json({ message: "Invalid email or login credentials" });
    }

    // Log the successful login
    db.addAuditLog(user.id, "USER_LOGIN", `User ${user.email} logged in successfully.`);

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        verified: user.verified,
        organizationName: user.organizationName,
        location: user.location
      }
    });
  } catch (error) {
    console.error("Login endpoint failed:", error);
    return res.status(500).json({ message: "Internal login handler failed" });
  }
}

/**
 * Fetch authenticated profile information
 */
export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = db.getUsers();
    const user = users.find((u) => u.id === req.user!.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        verified: user.verified,
        organizationName: user.organizationName,
        location: user.location,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile details" });
  }
}

/**
 * Handle verification request simulation
 */
export async function requestVerification(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    db.updateUser(req.user.id, { verified: true });
    db.addAuditLog(req.user.id, "VERIFY_EMAIL", `Verified user email address successfully.`);
    
    return res.json({ message: "Email verification simulated and verified successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Email verification process failed" });
  }
}

/**
 * Forgot password simulation
 */
export async function requestForgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Please provide an email address" });

    return res.json({ 
      message: `A password reset link has been mock-dispatched to: ${email}. Please check your inbox (simulated).` 
    });
  } catch (error) {
    return res.status(500).json({ message: "Forgot password procedure failed" });
  }
}

/**
 * Firebase Email/Password Registration
 */
export async function firebaseRegister(req: Request, res: Response) {
  try {
    const { firebaseId, email, name, role, organizationName, location } = req.body;

    if (!firebaseId || !email || !name || !role) {
      return res.status(400).json({ message: "Missing required Firebase registration fields" });
    }

    const emailNorm = email.trim().toLowerCase();
    const users = db.getUsers();
    
    // Check if user already exists
    if (users.some((u) => u.email.toLowerCase() === emailNorm)) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const validRoles = ["SELLER", "RECYCLER", "MANUFACTURER", "EPR", "ADMIN"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid system role provided" });
    }

    // Recyclers and manufacturers require admin approval
    const isRelationalBusiness = role === "RECYCLER" || role === "MANUFACTURER";
    const approvalStatus = isRelationalBusiness ? "PENDING" : "APPROVED";

    const newUser = {
      id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      email: emailNorm,
      passwordHash: "", // Firebase handles password
      firebaseId: firebaseId, // Link to Firebase UID
      role: role as any,
      verified: true, // Firebase-verified by default
      approvalStatus: approvalStatus as any,
      organizationName: organizationName?.trim() || "",
      location: location?.trim() || "",
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);

    // Notify admins if business approval needed
    if (isRelationalBusiness) {
      db.getUsers().forEach(u => {
        if (u.role === "ADMIN") {
          db.addNotification({
            id: `notif-${Date.now()}`,
            userId: u.id,
            title: "Business Approval Needed",
            message: `New resource: ${newUser.name} registered as ${newUser.role} and requires credentials review.`,
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      });
    }

    db.addAuditLog(newUser.id, "FIREBASE_REGISTER", `User registered via Firebase: ${email}`);

    return res.status(201).json({
      message: "Firebase account registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        approvalStatus: newUser.approvalStatus,
        verified: newUser.verified,
        organizationName: newUser.organizationName,
        location: newUser.location
      }
    });
  } catch (error) {
    console.error("Firebase registration failed:", error);
    return res.status(500).json({ message: "Firebase registration process failed" });
  }
}

/**
 * Firebase Email/Password Login
 */
export async function firebaseLogin(req: AuthenticatedRequest, res: Response) {
  try {
    const { firebaseId } = req.body;

    if (!firebaseId || !req.user) {
      return res.status(401).json({ message: "Firebase authentication required" });
    }

    const users = db.getUsers();
    const user = users.find((u) => u.id === req.user!.id);

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    db.addAuditLog(user.id, "FIREBASE_LOGIN", `User logged in via Firebase: ${user.email}`);

    return res.json({
      message: "Firebase login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        verified: user.verified,
        organizationName: user.organizationName,
        location: user.location
      }
    });
  } catch (error) {
    console.error("Firebase login failed:", error);
    return res.status(500).json({ message: "Firebase login process failed" });
  }
}

/**
 * Firebase Google Sign-In
 */
export async function firebaseGoogleSignIn(req: AuthenticatedRequest, res: Response) {
  try {
    const { firebaseId, email, name, photoURL } = req.body;

    if (!firebaseId || !email || !req.user) {
      return res.status(401).json({ message: "Firebase authentication required" });
    }

    const emailNorm = email.trim().toLowerCase();
    const users = db.getUsers();
    let user = users.find((u) => u.email.toLowerCase() === emailNorm);

    // Auto-create user if doesn't exist (first-time Google sign-in)
    if (!user) {
      user = {
        id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: name || emailNorm.split("@")[0],
        email: emailNorm,
        passwordHash: "",
        firebaseId: firebaseId,
        photoURL: photoURL || "",
        role: "SELLER" as any, // Default role for Google sign-in
        verified: true, // Google-verified
        approvalStatus: "APPROVED" as any,
        organizationName: "",
        location: "",
        createdAt: new Date().toISOString()
      };
      db.addUser(user);
      db.addAuditLog(user.id, "GOOGLE_SIGNIN_NEW", `New user created via Google Sign-In: ${email}`);
    } else {
      // Update Firebase ID if not set
      if (!user.firebaseId) {
        db.updateUser(user.id, { firebaseId, photoURL });
      }
      db.addAuditLog(user.id, "GOOGLE_SIGNIN", `User logged in via Google: ${email}`);
    }

    return res.json({
      message: "Google Sign-In successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        verified: user.verified,
        organizationName: user.organizationName || "",
        location: user.location || ""
      }
    });
  } catch (error) {
    console.error("Google Sign-In failed:", error);
    return res.status(500).json({ message: "Google Sign-In process failed" });
  }
}
