import type { Metadata } from "next"
import { DM_Sans, DM_Serif_Display } from "next/font/google"
import "./globals.css"
import { BASE_URL } from "@/lib/config"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: "400",
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "BodyMetrics — Calculadora de Grasa Corporal Gratis",
    template: "%s | BodyMetrics",
  },
  description:
    "Calcula tu porcentaje de grasa corporal gratis con el método U.S. Navy. Sin registro. Resultado instantáneo con categorías según el American Council on Exercise.",
  keywords: [
    "calculadora grasa corporal",
    "porcentaje grasa corporal",
    "calcular grasa corporal gratis",
    "método navy grasa corporal",
    "composición corporal",
    "body fat calculator español",
    "grasa corporal hombre mujer",
  ],
  authors: [{ name: "BodyMetrics" }],
  creator: "BodyMetrics",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "BodyMetrics",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bodymetrics",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body className={`${dmSans.variable} ${dmSerif.variable} grain-overlay`}>
        {children}
      </body>
    </html>
  )
}
