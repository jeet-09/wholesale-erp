"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "@/constants/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";
import { TheZoovaLogo } from "@/components/branding/the-zoova-logo";

type AppSidebarProps = {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  showCollapseControl?: boolean;
  onNavigate?: () => void;
  headerAction?: ReactNode;
};

export function AppSidebar({
  className,
  collapsed = false,
  onToggleCollapse,
  showCollapseControl = false,
  onNavigate,
  headerAction,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-slate-900 text-slate-100 transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[4.75rem]" : "w-64",
        className
      )}
    >
      {/* Small edge control — sits on the right border of the nav */}
      {showCollapseControl && onToggleCollapse ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute -right-2.5 top-8 z-20 flex h-5 w-5 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-300 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-700 hover:text-white"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
          ) : (
            <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
          )}
        </button>
      ) : null}

      <div
        className={cn(
          "border-b border-slate-800",
          collapsed ? "px-2 py-3" : "px-3 py-4 sm:px-4"
        )}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div title="TheZoova" className="flex justify-center">
              <TheZoovaLogo markOnly markSize={40} />
            </div>
            {headerAction ? (
              <div className="flex w-full justify-center">{headerAction}</div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <TheZoovaLogo wordmarkClassName="text-cream" markSize={32} />
            </div>
            {headerAction}
          </div>
        )}
      </div>

      <nav
        className={cn(
          "flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden py-3",
          collapsed ? "px-1" : "px-2 sm:px-3"
        )}
      >
        {mainNav.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            }
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

    </aside>
  );
}

function NavItem({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: (typeof mainNav)[number];
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const className = cn(
    "flex items-center rounded-lg text-sm font-medium transition-colors",
    collapsed
      ? "mx-auto h-10 w-10 justify-center"
      : "gap-3 px-3 py-2.5",
    item.disabled && "cursor-not-allowed",
    active && !item.disabled && "bg-slate-800 text-white",
    !active &&
      !item.disabled &&
      "text-slate-200 hover:bg-slate-800 hover:text-white",
    !active && item.disabled && (collapsed ? "text-slate-500" : "text-slate-500 opacity-60")
  );

  const label = collapsed ? (
    <span className="sr-only">{item.title}</span>
  ) : (
    <span className="truncate">{item.title}</span>
  );

  if (item.disabled) {
    return (
      <span
        className={className}
        title={item.title}
      >
        <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" />
        {label}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      title={collapsed ? item.title : undefined}
      onClick={onNavigate}
    >
      <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" />
      {label}
    </Link>
  );
}
