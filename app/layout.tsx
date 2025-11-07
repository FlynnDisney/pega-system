import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Positive Emotion Growth Assessment (PEGA)",
  description: "Discover your positive emotion profile and receive personalized courses to enhance your emotional well-being based on Barbara Fredrickson's broaden-and-build research.",
  keywords: "positive emotions, assessment, joy, gratitude, well-being, emotional growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
