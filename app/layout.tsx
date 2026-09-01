import type { Metadata } from "next";
import "./globals.css";
import "./refinement.css";

export const metadata: Metadata = {
  title: "Babblu · Personal Job Pilot",
  description: "A transparent, resume-aware job sourcing and application workspace.",
  openGraph: { title: "Babblu · Personal Job Pilot", description: "Your job search, clearly in motion.", images: ["/og.png"] },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/babblu-logo.png",
    shortcut: "/babblu-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
