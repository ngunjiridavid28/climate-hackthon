import React, { useState } from "react";
import { UserProfile } from "../../types.js";
import { 
  LogOut, Bell, MessageSquare, Settings, ShieldCheck, Menu, X, 
  User as UserIcon, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  user: UserProfile | null;
  notificationCount: number;
  unreadMessages: number;
  onLogout: () => void;
  onMenuToggle?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notificationCount,
  unreadMessages,
  onLogout,
  onMenuToggle
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
              onMenuToggle?.(!showMobileMenu);
            }}
            className="lg:hidden p-1.5 hover:bg-surface-alt rounded-lg transition"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">
              UziLink
            </span>
          </div>
        </div>

        {/* Middle: Title (for current view) */}
        <div className="hidden md:block flex-1 text-center">
          <h2 className="text-sm font-semibold text-foreground-muted">
            {user?.role === "SELLER" && "Seller Console"}
            {user?.role === "RECYCLER" && "Recycler Dashboard"}
            {user?.role === "MANUFACTURER" && "Manufacturing Hub"}
            {user?.role === "ADMIN" && "Admin Suite"}
            {user?.role === "EPR" && "EPR Compliance"}
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-surface-alt rounded-lg transition group">
            <Bell className="w-5 h-5 text-foreground-muted group-hover:text-foreground" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            )}
          </button>

          {/* Messages */}
          <button className="relative p-2 hover:bg-surface-alt rounded-lg transition group">
            <MessageSquare className="w-5 h-5 text-foreground-muted group-hover:text-foreground" />
            {unreadMessages > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full" />
            )}
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-surface-alt rounded-lg transition group">
            <Settings className="w-5 h-5 text-foreground-muted group-hover:text-foreground" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-alt rounded-lg transition group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline truncate max-w-[100px]">
                {user?.name || "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-foreground-muted group-hover:text-foreground transition" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-3 border-b border-border/50">
                    <p className="text-xs text-foreground-muted">Signed in as</p>
                    <p className="text-sm font-semibold text-foreground">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-alt rounded-lg transition text-sm text-foreground">
                      <UserIcon className="w-4 h-4" />
                      Profile Settings
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-alt rounded-lg transition text-sm text-foreground">
                      <Settings className="w-4 h-4" />
                      Preferences
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-error/10 rounded-lg transition text-sm text-error"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
