import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mario Bortolazzi | Senior HVAC & BMS Advisor",
  description: "Consulenza avanzata e diagnostica remota per sistemi HVAC e BMS. Ottimizza i tuoi progetti termotecnici e riduci i rischi tecnologici con 30+ anni di esperienza sul campo.",
  openGraph: {
    title: "Mario Bortolazzi | Senior HVAC & BMS Advisor",
    description: "L'anello di congiunzione tra Efficienza Energetica e Automazione Digitale. Consulenza strategico-operativa esente da responsabilità ex DM 37/08.",
    type: "website",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-950 text-zinc-300 antialiased selection:bg-emerald-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
