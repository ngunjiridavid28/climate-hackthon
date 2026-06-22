import React, { useState } from "react";
import { UserProfile } from "../../types.js";
import { Header } from "./Header.js";
import { Sidebar } from "./Sidebar.js";

interface DashboardLayoutProps {
  user: UserProfile | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationCount?: number;
  unreadMessages?: number;
  onLogout: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  activeTab,
  onTabChange,
  notificationCount = 0,
  unreadMessages = 0,
  onLogout,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <Header
        user={user}
        notificationCount={notificationCount}
        unreadMessages={unreadMessages}
        onLogout={onLogout}
        onMenuToggle={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          user={user}
          activeTab={activeTab}
          onTabChange={onTabChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
