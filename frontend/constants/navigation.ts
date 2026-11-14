import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ClipboardList,
  ListOrdered,
  FileText,
  Truck,
  Wallet,
  BookOpen,
  Boxes,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

/** Nav titles align with EzzyBilling module names where possible. */
export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Accounts", href: "/customers", icon: Users },
  { title: "Main Groups", href: "/customer-groups", icon: Building2 },
  { title: "Items", href: "/products", icon: Package },
  { title: "Order Book", href: "/daily-orders", icon: ClipboardList, disabled: true },
  { title: "Order Register", href: "/orders", icon: ListOrdered, disabled: true },
  { title: "Sales Invoice", href: "/invoices", icon: FileText, disabled: true },
  { title: "Hotel Challan", href: "/challans", icon: Truck, disabled: true },
  { title: "Quick Payment", href: "/payments", icon: Wallet, disabled: true },
  { title: "Ledger Book", href: "/ledgers", icon: BookOpen, disabled: true },
  { title: "Inventory", href: "/inventory", icon: Boxes, disabled: true },
  { title: "Day Book / Reports", href: "/reports", icon: BarChart3, disabled: true },
  { title: "Settings", href: "/settings", icon: Settings, disabled: true },
];
