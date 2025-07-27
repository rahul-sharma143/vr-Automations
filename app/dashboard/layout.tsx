"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type React from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const searchParams = new URLSearchParams(window.location.search);
      const isPreview = searchParams.get("preview") === "true";

      if (token || isPreview) {
        setAuthenticated(true);
      } else {
        router.push("/login");
      }

      setLoading(false);
    };

    if (typeof window !== "undefined") {
      checkAuth();
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 bg-muted/10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
