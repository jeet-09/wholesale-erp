"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { fetchCustomers } from "@/services/customers";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["customers", search],
    queryFn: () => fetchCustomers(search || undefined),
  });

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Restaurants and franchise branches. Create and edit forms arrive in the next iteration."
        actions={
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
        }
      />

      {isLoading ? <p className="text-sm text-slate-500">Loading customers…</p> : null}
      {isError ? <p className="text-sm text-red-600">Could not load customers. Is the API running?</p> : null}

      <div className="-mx-4 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm sm:mx-0">
        <table className="erp-table min-w-[640px] w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Abbrev</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Type</th>
              <th className="hidden px-4 py-3 md:table-cell">Group</th>
              <th className="px-4 py-3">City</th>
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-800">
                    {row.customer_code}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{row.abbreviation}</td>
                  <td className="px-4 py-3">{row.account_name}</td>
                  <td className="px-4 py-3 capitalize">{row.customer_type}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {row.customer_group_name ?? "—"}
                  </td>
                  <td className="px-4 py-3">{row.city ?? "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-8 text-center text-slate-600" colSpan={6}>
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
