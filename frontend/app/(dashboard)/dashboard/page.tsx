import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

const quickActions = [
  { label: "Create Customer", href: "/customers", disabled: true },
  { label: "Add Product", href: "/products", disabled: true },
  { label: "Enter Order", href: "/daily-orders", disabled: true },
  { label: "Record Payment", href: "/payments", disabled: true },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of today's wholesale operations. Metrics connect to live data in Phase 2+."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          "Today's orders",
          "Today's sales",
          "Pending deliveries",
          "Total outstanding",
        ].map((label) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-700">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">—</p>
            <p className="mt-1 text-xs text-slate-500">Awaiting Phase 2 data</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Quick actions</h3>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button key={action.label} variant="outline" disabled>
              {action.label}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
