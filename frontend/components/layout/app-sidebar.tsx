"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav } from "@/constants/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

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
        "flex flex-col bg-slate-900 text-slate-100 transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[4.75rem]" : "w-64",
        className
      )}
    >
      <div
        className={cn(
          "border-b border-slate-800",
          collapsed ? "px-2 py-3" : "px-3 py-4 sm:px-4"
        )}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            {showCollapseControl && onToggleCollapse ? (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-200 ring-1 ring-slate-700/80 transition-colors hover:bg-slate-800 hover:text-white"
                title="Expand sidebar"
                aria-expanded={false}
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : null}
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xs font-bold tracking-tight text-white shadow-sm"
              title="Kisan Traders — Wholesale ERP"
            >
              KT
            </div>
            {headerAction ? (
              <div className="flex w-full justify-center">{headerAction}</div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {showCollapseControl && onToggleCollapse ? (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
                title="Collapse sidebar"
                aria-expanded
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Kisan Traders
              </p>
              <h1 className="text-lg font-semibold leading-tight text-white">
                Wholesale ERP
              </h1>
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
