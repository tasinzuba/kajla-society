import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoBangla = Noto_Sans_Bengali({
  variable: "--font-noto-bangla",
  subsets: ["bengali"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kajla Society — A Connected Community",
    template: "%s | Kajla Society",
  },
  description:
    "Kajla Society — building a vibrant, connected community where neighbors become friends and every member feels at home.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Kajla Society",
    description: "A connected community",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoBangla.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
