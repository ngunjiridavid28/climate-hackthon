import React, { useState } from "react";
import { UserProfile } from "../../types.js";
import { 
  ShoppingBag, BarChart3, Users, FileText, Shield, Settings,
  ChevronRight, Package, Zap, AlertCircle, HelpCircle, LogOut,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  user: UserProfile | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
  children?: {
    id: string;
    label: string;
    roles: string[];
  }[];
}

const navItems: NavItem[] = [
  {
    id: "marketplace",
    label: "Marketplace",
    icon: <ShoppingBag className="w-5 h-5" />,
    roles: ["SELLER", "RECYCLER", "MANUFACTURER", "EPR"],
    children: [
      { id: "browse_listings", label: "Browse Listings", roles: ["SELLER", "RECYCLER", "MANUFACTURER"] },
      { id: "my_listings", label: "My Listings", roles: ["SELLER", "RECYCLER", "MANUFACTURER"] },
      { id: "active_trades", label: "Active Trades", roles: ["SELLER", "RECYCLER", "MANUFACTURER"] },
    ]
  },
  {
    id: "seller_console",
    label: "Seller Console",
    icon: <Package className="w-5 h-5" />,
    roles: ["SELLER", "RECYCLER", "MANUFACTURER"],
    children: [
      { id: "inventory", label: "Inventory Management", roles: ["SELLER", "RECYCLER", "MANUFACTURER"] },
      { id: "orders", label: "Orders", roles: ["SELLER", "RECYCLER", "MANUFACTURER"] },
      { id: "analytics", label: "Analytics", roles: ["SELLER", "RECYCLER", "MANUFACTURER"] },
    ]
  },
  {
    id: "inbox",
    label: "Messages",
    icon: <AlertCircle className="w-5 h-5" />,
    roles: ["SELLER", "RECYCLER", "MANUFACTURER", "EPR"],
  },
  {
    id: "admin_suite",
    label: "Admin Suite",
    icon: <Shield className="w-5 h-5" />,
    roles: ["ADMIN"],
    children: [
      { id: "approvals", label: "Pending Approvals", roles: ["ADMIN"] },
      { id: "users", label: "User Management", roles: ["ADMIN"] },
      { id: "compliance", label: "Compliance Logs", roles: ["ADMIN"] },
    ]
  },
  {
    id: "epr_compliance",
    label: "EPR Compliance",
    icon: <Zap className="w-5 h-5" />,
    roles: ["EPR", "ADMIN"],
    children: [
      { id: "reports", label: "Reports", roles: ["EPR", "ADMIN"] },
      { id: "audit_logs", label: "Audit Logs", roles: ["EPR", "ADMIN"] },
    ]
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  onTabChange,
  isOpen = true,
  onClose
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set([activeTab])
  );

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleTabChange = (id: string) => {
    onTabChange(id);
    onClose?.();
  };

  const visibleItems = navItems.filter(item =>
    item.roles.includes(user?.role || "")
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static left-0 top-16 bottom-0 lg:top-0 w-64 h-[calc(100vh-4rem)] lg:h-screen bg-surface border-r border-border overflow-y-auto z-40 lg:z-auto"
        role="complementary"
        aria-label="Main Navigation"
      >
        <nav className="p-4 space-y-1" aria-label="Navigation Menu">
          {visibleItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  handleTabChange(item.id);
                  if (item.children) {
                    toggleExpand(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-foreground hover:bg-surface-alt text-foreground-muted hover:text-foreground"
                }`}
                aria-current={activeTab === item.id ? "page" : undefined}
                aria-expanded={item.children ? expandedItems.has(item.id) : undefined}
                aria-controls={item.children ? `submenu-${item.id}` : undefined}
              >
                <span className="flex items-center gap-3 flex-1 text-left">
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </span>
                {item.children && (
                  <motion.div
                    animate={{
                      rotate: expandedItems.has(item.id) ? 90 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </button>

              {/* Submenu */}
              <AnimatePresence>
                {item.children && expandedItems.has(item.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                    id={`submenu-${item.id}`}
                    role="region"
                    aria-label={`${item.label} submenu`}
                  >
                    <ul className="py-1 pl-2">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => handleTabChange(child.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition border-l-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${
                              activeTab === child.id
                                ? "bg-primary/5 text-primary border-l-primary"
                                : "text-foreground-muted hover:text-foreground hover:bg-surface-alt border-l-transparent"
                            }`}
                            aria-current={activeTab === child.id ? "page" : undefined}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                            {child.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface/80 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-surface-alt transition text-foreground-muted hover:text-foreground text-sm">
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-surface-alt transition text-foreground-muted hover:text-foreground text-sm">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </motion.aside>
    </>
  );
};
