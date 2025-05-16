"use client";
import ClipLoader from "react-spinners/ClipLoader";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <p><ClipLoader color="#3b82f6" size={35} loading={true} /></p>;

  return <>{children}</>;
}
