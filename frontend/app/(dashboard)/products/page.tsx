"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchProduct, fetchProducts } from "@/services/products";
import { ProductFormDialog } from "@/components/products/product-form-dialog";
import { ProductImportDialog } from "@/components/products/product-import-dialog";
import { ProductPriceDialog } from "@/components/products/product-price-dialog";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [priceProduct, setPriceProduct] = useState<{ id: number; name: string } | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", search],
    queryFn: () => fetchProducts(search || undefined),
  });

  const { data: editProduct } = useQuery({
    queryKey: ["product", editId],
    queryFn: () => fetchProduct(editId!),
    enabled: editId != null && formOpen,
  });

  return (
    <div>
      <PageHeader
        title="Items"
        description="Item master (EzzyBilling Items) — Item Type, Item Unit, Stock, Net Loss, pricing."
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <Input
              placeholder="Find Items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52"
            />
            <Button type="button" variant="outline" onClick={() => setImportOpen(true)}>
              Import CSV
            </Button>
            <Button
              type="button"
              onClick={() => {
                setEditId(null);
                setFormOpen(true);
              }}
            >
              New Item
            </Button>
          </div>
        }
      />

      {isLoading ? <p className="text-sm text-slate-600">Loading items…</p> : null}
      {isError ? <p className="text-sm text-red-600">Could not load items.</p> : null}

      <div className="-mx-4 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm sm:mx-0">
        <table className="erp-table min-w-[960px] w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-3">Item code</th>
              <th className="px-4 py-3">Item Name</th>
              <th className="hidden px-4 py-3 md:table-cell">Item Type</th>
              <th className="px-4 py-3">Item Unit</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="hidden px-4 py-3 text-right sm:table-cell">Purchase</th>
              <th className="hidden px-4 py-3 text-right md:table-cell">Stock Balance</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-800">{row.product_code}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="hidden px-4 py-3 md:table-cell">{row.category}</td>
                  <td className="px-4 py-3">{row.unit}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {row.default_selling_price}
                  </td>
                  <td className="hidden px-4 py-3 text-right tabular-nums sm:table-cell">
                    {row.purchase_price ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-right tabular-nums md:table-cell">
                    {row.stock_quantity}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditId(row.id);
                          setFormOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setPriceProduct({ id: row.id, name: row.name });
                          setPriceOpen(true);
                        }}
                      >
                        Special price
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-8 text-center text-slate-600" colSpan={8}>
                  No items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditId(null);
        }}
        product={editId && editProduct ? editProduct : null}
      />
      <ProductImportDialog open={importOpen} onOpenChange={setImportOpen} />
      {priceProduct ? (
        <ProductPriceDialog
          open={priceOpen}
          onOpenChange={setPriceOpen}
          productId={priceProduct.id}
          productName={priceProduct.name}
        />
      ) : null}
    </div>
  );
}
