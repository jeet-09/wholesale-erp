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

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Customer Groups", href: "/customer-groups", icon: Building2, disabled: true },
  { title: "Products", href: "/products", icon: Package },
  { title: "Daily Orders", href: "/daily-orders", icon: ClipboardList, disabled: true },
  { title: "Order Register", href: "/orders", icon: ListOrdered, disabled: true },
  { title: "Sales Invoices", href: "/invoices", icon: FileText, disabled: true },
  { title: "Delivery Challans", href: "/challans", icon: Truck, disabled: true },
  { title: "Payments", href: "/payments", icon: Wallet, disabled: true },
  { title: "Customer Ledgers", href: "/ledgers", icon: BookOpen, disabled: true },
  { title: "Inventory", href: "/inventory", icon: Boxes, disabled: true },
  { title: "Reports", href: "/reports", icon: BarChart3, disabled: true },
  { title: "Settings", href: "/settings", icon: Settings, disabled: true },
];
