"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLoggedIn, useAuthSession } from "@/hooks/use-auth-session";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authQuery = useAuthSession();
  const { isPending, isError } = authQuery;
  const user = isLoggedIn(authQuery) ? authQuery.data : null;

  useEffect(() => {
    if (!isPending && isError) {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      router.replace("/login");
    }
  }, [isPending, isError, queryClient, router]);

  if (isPending) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="h-32 rounded bg-slate-200" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <header className="mb-4 flex flex-wrap items-center justify-end gap-2 text-sm sm:mb-6 sm:gap-3">
        <span className="font-medium text-slate-800">
          {user.name}{" "}
          <span className="font-normal text-slate-600">({user.role})</span>
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await logout();
            queryClient.removeQueries({ queryKey: ["auth", "me"] });
            router.replace("/login");
          }}
        >
          Log out
        </Button>
      </header>
      {children}
    </div>
  );
}
