import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  UserCredential
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { setToken, removeToken } from "../lib/api";
import { UserProfile } from "../types";

/**
 * Auth service wrapper for Firebase operations
 */

export class AuthService {
  /**
   * Register with email and password
   */
  static async registerWithEmail(
    email: string,
    password: string,
    userDetails: {
      name: string;
      role: "SELLER" | "RECYCLER" | "MANUFACTURER" | "EPR";
      organizationName: string;
      location: string;
    }
  ): Promise<{ user: UserProfile; token: string }> {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();
      
      // Create user profile in backend
      const response = await fetch("/api/auth/firebase-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseId: credential.user.uid,
          email,
          ...userDetails
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create user profile");
      }

      const data = await response.json();
      setToken(token);
      return { user: data.user, token };
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  }

  /**
   * Sign in with email and password
   */
  static async loginWithEmail(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();

      // Get user profile from backend
      const response = await fetch("/api/auth/firebase-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ firebaseId: credential.user.uid })
      });

      if (!response.ok) {
        throw new Error("Failed to load user profile");
      }

      const data = await response.json();
      setToken(token);
      return { user: data.user, token };
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }

  /**
   * Sign in with Google
   */
  static async loginWithGoogle(): Promise<{ user: UserProfile; token: string }> {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const token = await credential.user.getIdToken();

      // Get or create user profile in backend
      const response = await fetch("/api/auth/firebase-google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firebaseId: credential.user.uid,
          email: credential.user.email,
          name: credential.user.displayName || credential.user.email?.split("@")[0] || "User",
          photoURL: credential.user.photoURL
        })
      });

      if (!response.ok) {
        throw new Error("Failed to load user profile");
      }

      const data = await response.json();
      setToken(token);
      return { user: data.user, token };
    } catch (error: any) {
      throw new Error(error.message || "Google sign-in failed");
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || "Password reset failed");
    }
  }

  /**
   * Sign out user
   */
  static async logout(): Promise<void> {
    try {
      await auth.signOut();
      removeToken();
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  }

  /**
   * Get current Firebase user
   */
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Get current user's ID token
   */
  static async getIdToken(forceRefresh: boolean = false): Promise<string | null> {
    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken(forceRefresh);
      }
      return null;
    } catch (error) {
      console.error("[AuthService] Failed to get ID token:", error);
      return null;
    }
  }
}
