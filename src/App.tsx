import React, { useState, useEffect } from "react";
import { api, getToken, removeToken } from "./lib/api.js";
import { UserProfile, ListingItem, SystemNotification, BuyerRequestItem } from "./types.js";
import { AuthCard } from "./components/AuthCard.js";
import { SellerView } from "./components/SellerView.js";
import { BuyerView } from "./components/BuyerView.js";
import { AdminView } from "./components/AdminView.js";
import { EPrView } from "./components/EPrView.js";
import { InboxView } from "./components/InboxView.js";
import { ToastContainer, ToastMessage } from "./components/Banner.js";
import { 
  LogOut, Shield, ShieldCheck, Mail, Bell, MessageSquare, ShoppingBag, 
  Settings, UserCheck, ShieldAlert, CheckCircle, HelpCircle, Layout 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [showNotificationList, setShowNotificationList] = useState(false);

  // Active App Navigation tab
  const [activeTab, setActiveTab] = useState<string>("marketplace");

  // Quotation requests bids state
  const [bids, setBids] = useState<BuyerRequestItem[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);

  // Connection presets to route conversation instantly from buyer clicks
  const [partnerIdPreset, setPartnerIdPreset] = useState<string | null>(null);
  const [partnerNamePreset, setPartnerNamePreset] = useState<string | null>(null);
  const [listingIdPreset, setListingIdPreset] = useState<string | null>(null);

  // Display helpers: toast notifications generator
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Auto purge in 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleToastClose = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync / pull listings, bids, and notifications
  const pullPlatformData = async () => {
    if (!getToken()) return;
    try {
      const listRes = await api.getListings();
      setListings(listRes.listings);

      const notifRes = await api.getNotifications();
      setNotifications(notifRes.notifications);

      setLoadingBids(true);
      const bidsRes = await api.getBids();
      setBids(bidsRes.requests);
    } catch (e) {
      console.warn("Soft: failed to update marketplace synchronization logs.");
    } finally {
      setLoadingBids(false);
    }
  };

  // Profile handshake on mount
  const checkSession = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.getProfile();
      setUser(response.user);
      
      // Auto assign default view based on user roles
      if (response.user.role === "SELLER") {
        setActiveTab("seller_console");
      } else if (response.user.role === "ADMIN") {
        setActiveTab("admin_suite");
      } else if (response.user.role === "EPR") {
        setActiveTab("epr_compliance");
      } else {
        setActiveTab("marketplace");
      }

      await pullPlatformData();
    } catch (err) {
      console.error("Expired session context, clearing authorization token.", err);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleSignout = () => {
    removeToken();
    setUser(null);
    showToast("Logged out successfully.", "info");
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setUser(profile);
    
    // Route tab naturally
    if (profile.role === "SELLER") {
      setActiveTab("seller_console");
    } else if (profile.role === "ADMIN") {
      setActiveTab("admin_suite");
    } else if (profile.role === "EPR") {
      setActiveTab("epr_compliance");
    } else {
      setActiveTab("marketplace");
    }

    pullPlatformData();
  };

  const handleClearNotifications = async () => {
    if (notifications.length === 0) return;
    try {
      await api.markNotificationsAsRead();
      const notifRes = await api.getNotifications();
      setNotifications(notifRes.notifications);
      showToast("Cleared and read all notifications", "success");
    } catch (e) {
      showToast("Could not modify notification state.", "error");
    }
  };

  const handleResolveBid = async (id: string, status: "ACCEPTED" | "DECLINED") => {
    try {
      await api.updateBidStatus(id, status);
      showToast(`Bid offer resolved successfully as: ${status}`, "success");
      pullPlatformData();
    } catch (e) {
      showToast("Failed to process transaction decision.", "error");
    }
  };

  const handleSimulateEmailVerification = async () => {
    try {
      await api.verifyAccount();
      showToast("Email address verified (simulation active)!", "success");
      // refresh user state
      const response = await api.getProfile();
      setUser(response.user);
    } catch (e) {
      showToast("Verification attempt failed.", "error");
    }
  };

  const triggerDirectMessagePreset = (partnerId: string, partnerName: string, listingId: string) => {
    setPartnerIdPreset(partnerId);
    setPartnerNamePreset(partnerName);
    setListingIdPreset(listingId);
    setActiveTab("chat_inbox");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400" id="global-loading-stage">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-teal-400 rounded-full animate-spin" />
          <Shield className="w-5 h-5 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="mt-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">UziLink secure node syncing...</div>
      </div>
    );
  }

  // Not logged in -> Show Authentication State card
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden" id="auth-stage-wrapper">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
        
        <AuthCard onSuccess={handleAuthSuccess} showToast={showToast} />
        <ToastContainer toasts={toasts} onClose={handleToastClose} />
      </div>
    );
  }

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col" id="applet-dashboard-shell">
      {/* Toast container alert hub */}
      <ToastContainer toasts={toasts} onClose={handleToastClose} />

      {/* Primary Top Header Navigation bar */}
      <header className="bg-slate-900 border-b border-slate-800 py-3.5 px-6 sticky top-0 z-30" id="app-primary-navbar">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-teal-500 to-blue-600 p-2 rounded-xl border border-teal-400/25">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">UziLink</span>
              <span className="text-[9px] block uppercase tracking-widest text-slate-500 font-bold">B2B Textile circularity</span>
            </div>
          </div>

          {/* User profile identifier and verification badge */}
          <div className="flex items-center gap-4">
            
            {/* Verification banner alert */}
            {!user.verified && (
              <button 
                onClick={handleSimulateEmailVerification}
                className="hidden sm:flex items-center gap-1.5 bg-[#452E10]/40 border border-[#6B4B18]/40 hover:bg-[#452E10] text-[10px] px-2.5 py-1.5 text-amber-200 rounded-lg transition"
                title="Verify your profile email (Mock simulated)"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Unverified Email
              </button>
            )}

            {/* In-app Notifications Bell drop container toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationList(!showNotificationList)}
                className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition relative cursor-pointer"
                id="btn-navbar-notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotificationList && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-80 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl z-50 overflow-hidden"
                    id="notification-dropdown-menu"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/80 mb-2">
                      <span className="text-xs font-bold text-slate-300">Notifications ({unreadNotifications.length})</span>
                      <button
                        onClick={handleClearNotifications}
                        className="text-[10px] text-teal-400 hover:text-teal-300 transition font-bold"
                      >
                        Read All
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-60 overflow-y-auto" id="notification-items-list">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 text-xs">No alerts. You are completely up to date!</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`text-[11px] p-2 rounded-lg border leading-tight ${n.read ? "bg-slate-950/25 text-slate-400 border-slate-850" : "bg-slate-950/80 text-slate-200 border-teal-800/40"}`}>
                            <div className="font-bold mb-0.5">{n.title}</div>
                            <div>{n.message}</div>
                            <span className="text-[8px] text-slate-500 font-normal block mt-1">{new Date(n.createdAt).toLocaleTimeString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile info greetings */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white uppercase tracking-wide">{user.name}</span>
              <span className="text-[10px] text-teal-400 font-black block mt-0.5">Role: {user.role}</span>
            </div>

            {/* Signout button */}
            <button
              onClick={handleSignout}
              className="bg-slate-950 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-850 text-rose-400 hover:text-rose-300 transition cursor-pointer"
              id="btn-navbar-logout"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Account Verification & Admin Review status ticker info */}
      {user.approvalStatus === "PENDING" && (
        <div className="bg-[#451111]/35 border-b border-rose-900/40 text-rose-300 py-2.5 px-6 text-xs font-medium text-center flex items-center justify-center gap-1.5" id="critical-account-review-strip">
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Your {user.role} account is currently pending administrative review. Full platform permissions are temporarily locked until authorization completes.</span>
        </div>
      )}

      {/* Core Full Page Layout Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8" id="dashboard-stage-grid">
        
        {/* Navigation Sidebar Rail (Left) */}
        <nav className="lg:col-span-1 space-y-2 border-r border-slate-800/50 pr-4" id="sidebar-navigation">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 block mb-3">Circular Workspaces</span>

          {user.role === "SELLER" && (
            <button
              onClick={() => setActiveTab("seller_console")}
              className={`w-full text-left font-bold px-3 py-2.5 text-xs rounded-xl flex items-center gap-3 transition ${
                activeTab === "seller_console" ? "bg-teal-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
              id="sidebar-btn-seller"
            >
              <Layout className="w-4 h-4" />
              Declare waste Batch
            </button>
          )}

          <button
            onClick={() => setActiveTab("marketplace")}
            className={`w-full text-left font-bold px-3 py-2.5 text-xs rounded-xl flex items-center gap-3 transition ${
              activeTab === "marketplace" ? "bg-teal-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
            id="sidebar-btn-marketplace"
          >
            <ShoppingBag className="w-4 h-4" />
            B2B Textile Feed
          </button>

          <button
            onClick={() => setActiveTab("chat_inbox")}
            className={`w-full text-left font-bold px-3 py-2.5 text-xs rounded-xl flex items-center gap-3 transition ${
              activeTab === "chat_inbox" ? "bg-teal-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
            id="sidebar-btn-chat"
          >
            <MessageSquare className="w-4 h-4" />
            Chat Discussions
          </button>

          <button
            onClick={() => setActiveTab("bids_activities")}
            className={`w-full text-left font-bold px-3 py-2.5 text-xs rounded-xl flex items-center gap-3 transition ${
              activeTab === "bids_activities" ? "bg-teal-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
            id="sidebar-btn-bids"
          >
            <Mail className="w-4 h-4" />
            Quotation Bids ({bids.length})
          </button>

          {user.role === "EPR" && (
            <button
              onClick={() => setActiveTab("epr_compliance")}
              className={`w-full text-left font-bold px-3 py-2.5 text-xs rounded-xl flex items-center gap-3 transition ${
                activeTab === "epr_compliance" ? "bg-teal-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
              id="sidebar-btn-epr"
            >
              <Shield className="w-4 h-4" />
              EPR Compliance
            </button>
          )}

          {user.role === "ADMIN" && (
            <button
              onClick={() => setActiveTab("admin_suite")}
              className={`w-full text-left font-bold px-3 py-2.5 text-xs rounded-xl flex items-center gap-3 transition ${
                activeTab === "admin_suite" ? "bg-teal-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
              id="sidebar-btn-admin"
            >
              <UserCheck className="w-4 h-4" />
              Moderation Suite
            </button>
          )}
        </nav>

        {/* Dynamic Display Workspace Stage View (Right Viewports window) */}
        <main className="lg:col-span-3 min-h-[480px]" id="dynamic-viewport-stage">
          <AnimatePresence mode="wait">
            {activeTab === "seller_console" && user.role === "SELLER" && (
              <motion.div key="seller_viewport" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="block">
                <SellerView user={user} showToast={showToast} onRefresh={pullPlatformData} />
              </motion.div>
            )}

            {activeTab === "marketplace" && (
              <motion.div key="marketplace_viewport" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="block">
                <BuyerView 
                  user={user} 
                  showToast={showToast} 
                  listings={listings} 
                  onRefresh={pullPlatformData}
                  openContactPartner={triggerDirectMessagePreset}
                />
              </motion.div>
            )}

            {activeTab === "chat_inbox" && (
              <motion.div key="chat_viewport" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="block">
                <InboxView 
                  user={user} 
                  showToast={showToast} 
                  partnerIdPreset={partnerIdPreset}
                  partnerNamePreset={partnerNamePreset}
                  listingIdPreset={listingIdPreset}
                  onClearPreset={() => {
                    setPartnerIdPreset(null);
                    setPartnerNamePreset(null);
                    setListingIdPreset(null);
                  }}
                />
              </motion.div>
            )}

            {activeTab === "bids_activities" && (
              <motion.div key="bids_viewport" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="block">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-white mb-2">Track B2B Bidding and Quotations</h2>
                  <p className="text-xs text-slate-400 mb-6">Listed transactions made under your marketplace listings or purchase proposals submitted to other traders.</p>

                  {loadingBids ? (
                    <div className="text-center py-10 text-slate-500">Querying transaction pipeline...</div>
                  ) : bids.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">No bidding quotation requests registered yet. Submit a bid inside B2B feed!</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-400">
                        <thead className="text-[10px] text-slate-500 uppercase bg-slate-950/45">
                          <tr>
                            <th scope="col" className="px-6 py-3 rounded-l-lg">shipment details</th>
                            <th scope="col" className="px-6 py-3">Counterparty bidder</th>
                            <th scope="col" className="px-6 py-3">Proposed bid conditions</th>
                            <th scope="col" className="px-6 py-3">Circularity status</th>
                            <th scope="col" className="px-6 py-3 rounded-r-lg text-right">Moderations</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {bids.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-850/50">
                              <td className="px-6 py-4 font-bold text-white">{b.listingTitle}</td>
                              <td className="px-6 py-4">{b.buyerName} ({b.buyerRole})</td>
                              <td className="px-6 py-4 max-w-xs truncate" title={b.message}>{b.message}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  b.status === "PENDING" ? "bg-amber-500/10 text-amber-400" :
                                  b.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {user.role === "SELLER" && b.status === "PENDING" ? (
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => handleResolveBid(b.id, "DECLINED")}
                                      className="bg-rose-950 border border-rose-900/40 text-rose-400 px-2 py-1 rounded text-[10px] font-bold transition hover:bg-rose-900 cursor-pointer"
                                    >
                                      Decline
                                    </button>
                                    <button
                                      onClick={() => handleResolveBid(b.id, "ACCEPTED")}
                                      className="bg-emerald-500 text-slate-950 px-2 py-1 rounded text-[10px] font-bold transition hover:bg-emerald-400 cursor-pointer"
                                    >
                                      Accept
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-500 font-medium">No actions</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "epr_compliance" && user.role === "EPR" && (
              <motion.div key="epr_viewport" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="block">
                <EPrView user={user} listings={listings} showToast={showToast} />
              </motion.div>
            )}

            {activeTab === "admin_suite" && user.role === "ADMIN" && (
              <motion.div key="admin_viewport" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="block">
                <AdminView user={user} showToast={showToast} onRefresh={pullPlatformData} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
