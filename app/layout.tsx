import type { Metadata } from "next";
import { Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Sharan Deepak R B — Resume",
  description:
    "Backend-focused software engineer. Open the resume and ask anything a recruiter would ask.",
};

const themeBootScript = `try {
  var t = localStorage.getItem("resume-bot.theme");
  if (t) document.documentElement.setAttribute("data-theme", t);
} catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="recruiter-light"
      suppressHydrationWarning
      className={`${interTight.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
