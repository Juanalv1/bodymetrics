import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "BodyMetrics — Calculadora de Grasa Corporal Gratis"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(170,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(170,255,0,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(170,255,0,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
            padding: "8px 16px",
            borderRadius: 999,
            border: "1px solid rgba(170,255,0,0.3)",
            background: "rgba(170,255,0,0.06)",
            width: "fit-content",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#AAFF00" }} />
          <span style={{ color: "#AAFF00", fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Gratis · Sin registro
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            color: "#FAFAFA",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Calcula tu{" "}
          <span style={{ color: "#AAFF00" }}>grasa corporal</span>
          {" "}al instante
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 24, color: "#666", marginBottom: 60, maxWidth: 700 }}>
          Método U.S. Navy · Categorías ACE · Resultado inmediato
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 40 }}>
          {[
            { val: "U.S. Navy", label: "Método validado" },
            { val: "4",         label: "Categorías ACE" },
            { val: "100%",      label: "Gratis siempre" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#AAFF00", fontSize: 32, fontWeight: 700 }}>{s.val}</span>
              <span style={{ color: "#555", fontSize: 14 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Site name */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            fontSize: 28,
            color: "#FAFAFA",
            fontWeight: 700,
          }}
        >
          Body<span style={{ color: "#AAFF00" }}>Metrics</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
