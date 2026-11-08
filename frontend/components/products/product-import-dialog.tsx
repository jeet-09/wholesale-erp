"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  downloadProductImportTemplate,
  importProducts,
  type ImportSummary,
} from "@/services/products";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductImportDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("Choose a CSV file");
      return importProducts(file, true);
    },
    onSuccess: async (data) => {
      setSummary(data);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setFile(null);
          setSummary(null);
        }
        onOpenChange(v);
      }}
      title="Import products (CSV)"
      description="Download the template, fill rows, upload. Existing codes can be updated."
    >
      <div className="space-y-4">
        <Button type="button" variant="outline" onClick={() => downloadProductImportTemplate()}>
          Download template
        </Button>

        <div className="space-y-2">
          <Label htmlFor="csv">CSV file</Label>
          <input
            id="csv"
            type="file"
            accept=".csv,text/csv"
            className="block w-full text-sm text-slate-700"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {summary ? (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
            <p>Created: {summary.created}</p>
            <p>Updated: {summary.updated}</p>
            {summary.errors.length > 0 ? (
              <ul className="mt-2 max-h-32 list-disc overflow-y-auto pl-4 text-red-700">
                {summary.errors.map((e) => (
                  <li key={`${e.line}-${e.message}`}>
                    Line {e.line}: {e.message}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="button"
            disabled={!file || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Importing…" : "Import"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
