"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { fetchProducts } from "@/services/products";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", search],
    queryFn: () => fetchProducts(search || undefined),
  });

  return (
    <div>
      <PageHeader
        title="Products"
        description="Product catalogue (~317 items). Bulk import UI follows in Phase 1."
        actions={
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
        }
      />

      {isLoading ? <p className="text-sm text-slate-600">Loading products…</p> : null}
      {isError ? <p className="text-sm text-red-600">Could not load products.</p> : null}

      <div className="-mx-4 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm sm:mx-0">
        <table className="erp-table min-w-[720px] w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="hidden px-4 py-3 sm:table-cell">Category</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="hidden px-4 py-3 text-right sm:table-cell">Stock</th>
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-800">
                    {row.product_code}
                  </td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{row.category}</td>
                  <td className="px-4 py-3">{row.unit}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {row.default_selling_price}
                  </td>
                  <td className="hidden px-4 py-3 text-right tabular-nums sm:table-cell">
                    {row.stock_quantity}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-8 text-center text-slate-600" colSpan={6}>
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
