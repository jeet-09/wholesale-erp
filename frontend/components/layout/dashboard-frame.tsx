"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { TheZoovaLogo } from "@/components/branding/the-zoova-logo";

const STORAGE_KEY = "erp-sidebar-collapsed";

export function DashboardFrame({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const desktopCollapsed = hydrated && sidebarCollapsed;

  return (
    <div className="flex min-h-dvh w-full bg-slate-100">
      {/* Desktop: full-height collapsible sidebar */}
      <div className="relative z-20 hidden shrink-0 overflow-visible lg:block">
        <AppSidebar
          className="sticky top-0 h-dvh"
          collapsed={desktopCollapsed}
          showCollapseControl
          onToggleCollapse={toggleSidebarCollapsed}
        />
      </div>

      {/* Mobile: slide-over drawer (always expanded) */}
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out lg:hidden ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar
          className="h-dvh w-[min(18rem,85vw)] shadow-xl"
          collapsed={false}
          onNavigate={() => setMobileNavOpen(false)}
          headerAction={
            <button
              type="button"
              aria-label="Close navigation"
              className="rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => setMobileNavOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          }
        />
      </div>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <TheZoovaLogo markSize={28} />
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <DashboardShell>{children}</DashboardShell>
        </main>
      </div>
    </div>
  );
}
