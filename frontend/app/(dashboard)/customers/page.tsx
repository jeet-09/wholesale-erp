"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  archiveCustomer,
  restoreCustomer,
  fetchCustomers,
  type Customer,
  type CustomerListFilters,
} from "@/services/customers";
import { fetchCustomerGroups } from "@/services/customer-groups";
import { CustomerFormDialog } from "@/components/customers/customer-form-dialog";
import {
  CustomerListFiltersMenu,
  DEFAULT_CUSTOMER_LIST_FILTERS,
} from "@/components/customers/customer-list-filters";
import { StatusBadge } from "@/components/customers/status-badge";

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerListFilters>(
    DEFAULT_CUSTOMER_LIST_FILTERS,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const queryClient = useQueryClient();

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  const { data: groups } = useQuery({
    queryKey: ["customer_groups"],
    queryFn: fetchCustomerGroups,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["customers", filterKey],
    queryFn: () => fetchCustomers(filters),
  });

  const archiveMutation = useMutation({
    mutationFn: archiveCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const restoreMutation = useMutation({
    mutationFn: restoreCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  return (
    <div>
      <PageHeader
        title="Accounts"
        description="Client accounts (EzzyBilling Accounts). Main Group, Abbreviation, Opening Balance."
        actions={
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            <CustomerListFiltersMenu
              applied={filters}
              onApply={setFilters}
              groups={groups}
            />
            <Button
              type="button"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              New Account
            </Button>
          </div>
        }
      />

      {isLoading ? <p className="text-sm text-slate-600">Loading accounts…</p> : null}
      {isError ? <p className="text-sm text-red-600">Could not load accounts.</p> : null}

      <div className="-mx-4 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm sm:mx-0">
        <table className="erp-table min-w-[960px] w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Abbreviation</th>
              <th className="px-4 py-3">Account Name</th>
              <th className="hidden px-4 py-3 md:table-cell">Main Group</th>
              <th className="px-4 py-3 text-right">Op Balance</th>
              <th className="px-4 py-3">Balance Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={!row.active ? "bg-slate-50/80" : undefined}
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-800">
                    {row.customer_code}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{row.abbreviation}</td>
                  <td className="px-4 py-3">{row.account_name}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {row.customer_group_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {row.opening_balance}
                  </td>
                  <td className="px-4 py-3">
                    {row.balance_type === "credit" ? "Cr." : "Dr."}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={row.active} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(row);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      {row.active ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-red-700"
                          disabled={archiveMutation.isPending}
                          onClick={() => {
                            if (confirm(`Archive ${row.account_name}?`)) {
                              archiveMutation.mutate(row.id);
                            }
                          }}
                        >
                          Archive
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-emerald-800"
                          disabled={restoreMutation.isPending}
                          onClick={() => {
                            if (
                              confirm(
                                `Restore ${row.account_name} to active?`,
                              )
                            ) {
                              restoreMutation.mutate(row.id);
                            }
                          }}
                        >
                          Active
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-8 text-center text-slate-600" colSpan={8}>
                  No accounts match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CustomerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={editing}
      />
    </div>
  );
}
