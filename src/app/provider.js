"use client";
import React, { useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useUser } from "@clerk/nextjs";
import { AuthContext } from "@/context/authContext";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const Provider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const createUser = useMutation(api.users.CreateNewUser);
  const [convexUser, setConvexUser] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const syncUser = async () => {
      try {
        const dbUser = await createUser({
          clerkId: user.id,
          name: user.fullName || user.username || "Unnamed",
          email: user.primaryEmailAddress?.emailAddress || "unknown@example.com",
          pictureUrl: user.imageUrl,
        });
        console.log("✅ Synced Convex User:", dbUser);
        setConvexUser(dbUser);
      } catch (error) {
        console.error("❌ Error syncing user:", error);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, createUser]);

  return (
    <AuthContext.Provider
      value={{
        user: convexUser, // ✅ Now 'user' has Convex _id
        isLoaded,
        isSignedIn,
      }}
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export default Provider;
