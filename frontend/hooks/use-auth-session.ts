"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser, type AuthUser } from "@/services/auth";

/**
 * Shared session check. On 401, React Query may still hold stale user data —
 * only treat the user as logged in when the latest fetch succeeded.
 */
export function useAuthSession() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function isLoggedIn(
  query: ReturnType<typeof useAuthSession>,
): query is { data: AuthUser; isSuccess: true; isError: false } {
  return query.isSuccess && query.data != null;
}
