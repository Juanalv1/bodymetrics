"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #2a2a2a",
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="font-display text-xl tracking-tight"
            style={{ color: "#FAFAFA" }}
          >
            Body
            <span style={{ color: "#AAFF00" }}>Metrics</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink href="/" active={pathname === "/"}>
            Inicio
          </NavLink>
          <NavLink href="/calculator" active={pathname === "/calculator"}>
            Calculadora
          </NavLink>
          <NavLink href="/ai-analysis" active={pathname === "/ai-analysis"}>
            <span style={{ color: "#AAFF00" }}>✦</span> IA Visual
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string
  children: React.ReactNode
  active: boolean
}) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        color: active ? "#AAFF00" : "#888888",
        background: active ? "rgba(170,255,0,0.08)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = "#FAFAFA"
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = "#888888"
      }}
    >
      {children}
    </Link>
  )
}
