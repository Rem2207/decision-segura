import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Decisión Segura | Alfabetización en seguridad digital",
  description: "Experiencia educativa gamificada sobre phishing, contraseñas, ingeniería social y protección de información personal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>;
}
