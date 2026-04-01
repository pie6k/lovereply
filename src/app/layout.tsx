import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/Providers";
import { StyledComponentsRegistry } from "@/lib/StyledComponentsRegistry";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "LoveReply — Reply with love",
  description:
    "Understand what your partner is really saying and reply with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
