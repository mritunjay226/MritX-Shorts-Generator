"use client";
import React, { useEffect, useState } from "react";
import AppSidebar from "./_components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./_components/AppHeader";
import { useAuthContext } from "../provider";
import { useRouter } from "next/navigation";

const DashboardProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useAuthContext();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to homepage if user not signed in
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Return the same structure for server and client to avoid hydration mismatch
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <AppHeader />
        <div className="p-4">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardProvider;
