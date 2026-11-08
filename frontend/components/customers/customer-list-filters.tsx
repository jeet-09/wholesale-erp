"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { CustomerListFilters } from "@/services/customers";
import type { CustomerGroup } from "@/services/customer-groups";
import { cn } from "@/lib/utils";

/** Default list: only active customers until the user changes filters. */
export const DEFAULT_CUSTOMER_LIST_FILTERS: CustomerListFilters = { active: "true" };

type Props = {
  /** Filters currently applied to the API query. */
  applied: CustomerListFilters;
  onApply: (filters: CustomerListFilters) => void;
  groups?: CustomerGroup[];
};

const VIEWPORT_PAD = 16;
const PANEL_WIDTH = 20.5; // rem — matches comfortable form width

/** Inset ring so focus styles are not clipped by the panel scroll area. */
const FILTER_FIELD_FOCUS =
  "focus-visible:ring-inset focus-visible:ring-offset-0 focus-visible:ring-emerald-600/80";

type PanelPlacement = {
  top: number;
  right: number;
  width: number;
  maxHeight: number;
};

export function CustomerListFiltersMenu({ applied, onApply, groups }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CustomerListFilters>(applied);
  const [placement, setPlacement] = useState<PanelPlacement | null>(null);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // When opening, sync draft from what is already applied on the table.
  useEffect(() => {
    if (open) setDraft({ ...applied });
  }, [open, applied]);

  useEffect(() => setMounted(true), []);

  const computePlacement = useCallback((): PanelPlacement | null => {
    const btn = buttonRef.current;
    if (!btn) return null;

    const pad = VIEWPORT_PAD;
    const gap = 8;
    const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const width = Math.min(PANEL_WIDTH * rootFont, window.innerWidth - pad * 2);
    const btnRect = btn.getBoundingClientRect();
    const vh = window.innerHeight;

    // Anchor to the filter button’s right edge; stay inside horizontal padding.
    let right = Math.max(pad, window.innerWidth - btnRect.right);
    const panelLeft = window.innerWidth - right - width;
    if (panelLeft < pad) {
      right = window.innerWidth - width - pad;
    }

    const spaceBelow = vh - btnRect.bottom - gap - pad;
    const spaceAbove = btnRect.top - gap - pad;
    const openBelow = spaceBelow >= 220 || spaceBelow >= spaceAbove;

    let top: number;
    let maxHeight: number;

    if (openBelow) {
      top = btnRect.bottom + gap;
      maxHeight = spaceBelow;
    } else {
      maxHeight = spaceAbove;
      top = btnRect.top - gap - maxHeight;
    }

    // Keep the full panel inside the viewport (never clip off the top or bottom).
    maxHeight = Math.max(140, Math.min(maxHeight, vh - pad * 2));
    top = Math.max(pad, Math.min(top, vh - pad - maxHeight));

    if (top + maxHeight > vh - pad) {
      maxHeight = vh - pad - top;
    }

    return { top, right, width, maxHeight };
  }, []);

  /** After paint, nudge if the measured box still crosses the viewport edge. */
  const clampPlacementToViewport = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const pad = VIEWPORT_PAD;
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;

    setPlacement((prev) => {
      if (!prev) return prev;
      let { top, maxHeight } = prev;
      if (rect.top < pad) {
        top += pad - rect.top;
      }
      if (rect.bottom > vh - pad) {
        top -= rect.bottom - (vh - pad);
      }
      top = Math.max(pad, top);
      maxHeight = Math.min(prev.maxHeight, vh - pad - top);
      if (Math.abs(top - prev.top) < 1 && Math.abs(maxHeight - prev.maxHeight) < 1) {
        return prev;
      }
      return { ...prev, top, maxHeight };
    });
  }, []);

  const updatePlacement = useCallback(() => {
    const next = computePlacement();
    if (next) setPlacement(next);
  }, [computePlacement]);

  useLayoutEffect(() => {
    if (!open) {
      setPlacement(null);
      return;
    }
    updatePlacement();
    const onScroll = () => updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, updatePlacement]);

  useLayoutEffect(() => {
    if (!open || !panelRef.current) return;
    clampPlacementToViewport();
  }, [open, clampPlacementToViewport]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const set = (key: keyof CustomerListFilters, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(trimFilters(draft));
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = { ...DEFAULT_CUSTOMER_LIST_FILTERS };
    setDraft(cleared);
    onApply(cleared);
    setOpen(false);
  };

  const filterActive = countActiveFilterFields(applied) > 0;

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        size="sm"
        className="relative gap-1.5 px-2.5"
        aria-label="Filter customers"
        aria-expanded={open}
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          const next = computePlacement();
          if (next) setPlacement(next);
          setOpen(true);
        }}
      >
        <Filter className="h-4 w-4" aria-hidden />
        {filterActive ? (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-600" />
        ) : null}
      </Button>

      {open && mounted && placement
        ? createPortal(
            <div
              ref={panelRef}
              className="fixed z-[100] box-border rounded-xl border border-slate-200 bg-white shadow-xl"
              style={{
                top: placement.top,
                right: placement.right,
                width: placement.width,
                maxHeight: placement.maxHeight,
              }}
              role="dialog"
              aria-label="Customer filters"
            >
              <div className="flex h-full max-h-[inherit] flex-col p-5 sm:p-6">
                <p className="shrink-0 pb-1 text-sm font-semibold text-slate-800">
                  Filter customers
                </p>
                <div className="min-h-0 flex-1 space-y-3.5 overflow-x-hidden overflow-y-auto overscroll-contain px-0.5 py-3">
                  <FilterField label="Code">
                    <Input
                      placeholder="Code"
                      value={draft.customer_code ?? ""}
                      onChange={(e) => set("customer_code", e.target.value)}
                      className={cn("h-9 font-mono text-xs", FILTER_FIELD_FOCUS)}
                    />
                  </FilterField>
                  <FilterField label="Abbrev">
                    <Input
                      placeholder="Abbrev"
                      value={draft.abbreviation ?? ""}
                      onChange={(e) => set("abbreviation", e.target.value)}
                      className={cn("h-9 font-mono text-xs", FILTER_FIELD_FOCUS)}
                    />
                  </FilterField>
                  <FilterField label="Account">
                    <Input
                      placeholder="Account name"
                      value={draft.account_name ?? ""}
                      onChange={(e) => set("account_name", e.target.value)}
                      className={cn("h-9", FILTER_FIELD_FOCUS)}
                    />
                  </FilterField>
                  <FilterField label="Type">
                    <Select
                      value={draft.customer_type ?? ""}
                      onChange={(e) => set("customer_type", e.target.value)}
                      className={cn("h-9", FILTER_FIELD_FOCUS)}
                    >
                      <option value="">All types</option>
                      <option value="individual">Individual</option>
                      <option value="branch">Branch</option>
                    </Select>
                  </FilterField>
                  <FilterField label="Group">
                    <Select
                      value={draft.customer_group_id ?? ""}
                      onChange={(e) => set("customer_group_id", e.target.value)}
                      className={cn("h-9", FILTER_FIELD_FOCUS)}
                    >
                      <option value="">All groups</option>
                      {groups?.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </Select>
                  </FilterField>
                  <FilterField label="City">
                    <Input
                      placeholder="City"
                      value={draft.city ?? ""}
                      onChange={(e) => set("city", e.target.value)}
                      className={cn("h-9", FILTER_FIELD_FOCUS)}
                    />
                  </FilterField>
                  <FilterField label="Status">
                    <Select
                      value={draft.active ?? ""}
                      onChange={(e) => set("active", e.target.value)}
                      className={cn("h-9", FILTER_FIELD_FOCUS)}
                    >
                      <option value="">All</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Select>
                  </FilterField>
                  <FilterField label="Quick search">
                    <Input
                      placeholder="Any field…"
                      value={draft.search ?? ""}
                      onChange={(e) => set("search", e.target.value)}
                      className={cn("h-9", FILTER_FIELD_FOCUS)}
                    />
                  </FilterField>
                </div>
                <div className="flex shrink-0 justify-end gap-2 border-t border-slate-100 pt-4">
                  <Button type="button" variant="outline" size="sm" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button type="button" size="sm" onClick={handleApply}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/** Drop empty strings so the API only receives meaningful filters. */
function trimFilters(filters: CustomerListFilters): CustomerListFilters {
  const out: CustomerListFilters = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value != null && String(value).trim() !== "") {
      (out as Record<string, string>)[key] = String(value).trim();
    }
  }
  return out;
}

/** Show dot on filter icon when user has more than the default active-only filter. */
function countActiveFilterFields(filters: CustomerListFilters): number {
  const trimmed = trimFilters(filters);
  const keys = Object.keys(trimmed);
  if (keys.length === 0) return 0;
  if (keys.length === 1 && keys[0] === "active" && trimmed.active === "true") return 0;
  return keys.length;
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      <div className="w-full min-w-0">{children}</div>
    </div>
  );
}
