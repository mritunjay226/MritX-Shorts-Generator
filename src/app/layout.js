import { Geist, Geist_Mono, Outfit, Sen } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "MritX AI Short Video Generator",
  description: "MritX AI Short Video Generator",
  icons: {
    icon: '/MLogo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: 'bottom',
          socialButtonsVariant: 'iconButton',
          logoPlacement: 'inside',
        },
        variables: {
          colorPrimary: '#EAB308', // Brand Yellow
          colorTextOnPrimaryBackground: 'black',
          fontFamily: sen.style.fontFamily, // Matches your app font
          borderRadius: '0.75rem',
        },
        elements: {
          // Main Card Styling (Adaptive Light/Dark)
          card: 'bg-white dark:bg-zinc-950 shadow-2xl border border-zinc-200 dark:border-white/10 rounded-3xl',
          
          // Header Text
          headerTitle: 'text-zinc-900 dark:text-white font-bold',
          headerSubtitle: 'text-zinc-500 dark:text-zinc-400',
          
          // Social Buttons (Google, etc.)
          socialButtonsIconButton: 'bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 transition-all',
          
          // Primary Submit Button (Gradient)
          formButtonPrimary: 'bg-gradient-to-r from-yellow-400 to-orange-500 border-0 text-black font-bold hover:opacity-90 transition-all shadow-lg shadow-orange-500/20',
          
          // Links (Sign up, Forgot password)
          footerActionLink: 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-semibold',
          
          // Inputs
          formFieldInput: 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-yellow-500 focus:ring-yellow-500/20 dark:bg-black/50 dark:border-white/10 dark:text-white dark:focus:border-yellow-500 transition-all rounded-xl',
          formFieldLabel: 'text-zinc-600 dark:text-zinc-400 font-medium',
          
          // Divider
          dividerLine: 'bg-zinc-200 dark:bg-white/10',
          dividerText: 'text-zinc-400 dark:text-zinc-500',
          
          // User Button Popover (Profile Menu)
          userButtonPopoverCard: 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 shadow-xl',
          userPreviewMainIdentifier: 'text-zinc-900 dark:text-white font-semibold',
          userPreviewSecondaryIdentifier: 'text-zinc-500 dark:text-zinc-400',
          userButtonPopoverActionButton: 'hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300',
          userButtonPopoverActionButtonIcon: 'text-zinc-500 dark:text-zinc-400',
          userButtonPopoverFooter: 'hidden', // Hide the 'Secured by Clerk' footer if desired
        }
      }}
    >
      <html lang="en" suppressHydrationWarning={true}>
        <body className={sen.className} suppressHydrationWarning={true}>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}