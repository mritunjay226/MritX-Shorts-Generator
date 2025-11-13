"use client";
import React, { useEffect } from "react";
import AppSidebar from "./_components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./_components/AppHeader";
import { useAuthContext } from "../provider";
import { useRouter } from "next/navigation";

const DashboardProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to homepage if user not signed in
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    // Avoid rendering protected UI before auth is determined
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (!isSignedIn) {
    // Just in case the router redirect hasn’t triggered yet
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <AppHeader />
        <div className="p-10">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardProvider;
