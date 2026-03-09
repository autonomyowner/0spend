import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useEffect, useRef } from "react";

export function useCurrentUser() {
  const { data: session, isPending } = authClient.useSession();
  const user = useQuery(api.users.viewer);
  const ensureUser = useMutation(api.users.ensureUser);
  const ensuredRef = useRef(false);

  // Auto-create user record when authenticated but no user record exists
  useEffect(() => {
    if (session && user === null && !ensuredRef.current) {
      ensuredRef.current = true;
      ensureUser().then(() => {
        ensuredRef.current = false;
      });
    }
  }, [session, user, ensureUser]);

  return {
    user,
    isLoading: isPending || (session && user === undefined),
    isAuthenticated: !!session,
  };
}

export function useConvexAuth() {
  const { data: session, isPending } = authClient.useSession();
  return {
    isAuthenticated: !!session,
    isLoading: isPending,
  };
}
