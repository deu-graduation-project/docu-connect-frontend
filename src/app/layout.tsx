import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Plus_Jakarta_Sans as FontJakarta } from "next/font/google";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { TailwindIndicator } from "@/components/tailwind-indicator";
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

const fontJakartaSans = FontJakarta({
  subsets: ["latin"],
  variable: "--font-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.className} ${fontJakartaSans.variable} min-h-screen mx-auto `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {" "}
          {children}
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
