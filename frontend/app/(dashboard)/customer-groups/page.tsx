"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createCustomerGroup,
  fetchCustomerGroup,
  fetchCustomerGroups,
} from "@/services/customer-groups";
import { CustomerFormDialog } from "@/components/customers/customer-form-dialog";
import { StatusBadge } from "@/components/customers/status-badge";

export default function CustomerGroupsPage() {
  const [groupDialog, setGroupDialog] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [branchDialog, setBranchDialog] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ["customer_groups"],
    queryFn: fetchCustomerGroups,
  });

  const { data: detail } = useQuery({
    queryKey: ["customer_group", detailId],
    queryFn: () => fetchCustomerGroup(detailId!),
    enabled: detailId != null,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createCustomerGroup({ name, code, abbreviation, notes, active: true }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer_groups"] });
      setGroupDialog(false);
      setName("");
      setCode("");
      setAbbreviation("");
      setNotes("");
    },
  });

  return (
    <div>
      <PageHeader
        title="Customer groups"
        description="Franchise / group accounts with multiple branches."
        actions={
          <Button type="button" onClick={() => setGroupDialog(true)}>
            New group
          </Button>
        }
      />

      {isLoading ? <p className="text-sm text-slate-600">Loading…</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups?.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setDetailId(g.id)}
            className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:shadow"
          >
            <p className="font-semibold text-slate-900">{g.name}</p>
            <p className="mt-1 font-mono text-xs text-slate-600">{g.code}</p>
            <p className="mt-2 text-sm text-slate-600">
              {g.branches_count} branch{g.branches_count === 1 ? "" : "es"}
            </p>
          </button>
        ))}
      </div>

      <Dialog
        open={detailId != null}
        onOpenChange={(open) => !open && setDetailId(null)}
        title={detail?.name ?? "Group"}
        description={detail ? `Code ${detail.code}` : undefined}
        className="sm:max-w-2xl"
      >
        {detail ? (
          <div className="space-y-4">
            <AddBranchRow onAdd={() => setBranchDialog(true)} />
            <ul className="divide-y divide-slate-200 rounded-md border border-slate-200">
              {detail.branches.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-900">{b.account_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-600">{b.abbreviation}</span>
                    <StatusBadge active={b.active} />
                  </div>
                </li>
              ))}
              {detail.branches.length === 0 ? (
                <li className="px-3 py-6 text-center text-slate-500">No branches yet.</li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </Dialog>

      <CustomerFormDialog
        open={branchDialog}
        onOpenChange={setBranchDialog}
        defaultType="branch"
        defaultGroupId={detailId ?? undefined}
      />

      <Dialog
        open={groupDialog}
        onOpenChange={setGroupDialog}
        title="New customer group"
      >
        <div className="space-y-3">
          <Field label="Group name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Group code">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="font-mono"
            />
          </Field>
          <Field label="Abbreviation">
            <Input value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} />
          </Field>
          <Field label="Notes">
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={createMutation.isPending || !name || !code}
              onClick={() => createMutation.mutate()}
            >
              Create group
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function AddBranchRow({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex justify-end">
      <Button type="button" size="sm" onClick={onAdd}>
        Add branch
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
