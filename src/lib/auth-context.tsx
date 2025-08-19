import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { me } from "@/lib/api";
import { authService } from "./auth-service";

export type AuthUser = {
  id: number;
  email: string;
  name?: string;
  role?: string;
  phone?: string;
  createdAt?: string;
  avatarUrl?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  setSession: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
  reload: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      console.log("Fetching user data...");
      const data = await me();
      console.log("User data received:", data);
      setUser(data as AuthUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    // Always attempt to fetch user data on initial load
    (async () => {
      console.log("Initial auth check - attempting fetchMe...");
      try {
        await fetchMe();
      } catch (error) {
        console.log("Initial fetchMe failed, user not logged in or session expired.", error);
        // No need to explicitly setUser(null) here, fetchMe already does it on error
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        if (e.newValue) {
          fetchMe();
        } else {
          setUser(null);
        }
      }
    };
    const onCustom = () => fetchMe();
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:token", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:token", onCustom as EventListener);
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    setSession: (u: AuthUser, accessToken: string) => {
      authService.setAccessToken(accessToken);
      setUser(u);
      window.dispatchEvent(new Event("auth:token"));
    },
    logout: async () => {
      await authService.logout();
      setUser(null);
      window.dispatchEvent(new Event("auth:token"));
    },
    reload: fetchMe,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


