import type { Metadata } from "next"
import { DM_Sans, DM_Serif_Display } from "next/font/google"
import "./globals.css"

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
  title: "BodyMetrics — Calculadora de Grasa Corporal",
  description: "Calcula tu porcentaje de grasa corporal con métodos validados científicamente. Rápido, preciso y gratuito.",
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
