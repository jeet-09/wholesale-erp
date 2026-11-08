"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchCurrentUser } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace("/login");
    }
  }, [isLoading, isError, router]);

  if (isLoading) {
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
            await refetch();
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
