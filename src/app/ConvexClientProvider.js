"use client";
import React from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk"; // ✅ correct import
import { useAuth } from "@clerk/nextjs";
import Provider from "./provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

const ConvexClientProvider = ({ children }) => {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Provider>{children}</Provider>
    </ConvexProviderWithClerk>
  );
};

export default ConvexClientProvider;
