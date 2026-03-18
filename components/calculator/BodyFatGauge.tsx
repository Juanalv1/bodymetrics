"use client"

import { useEffect, useState } from "react"
import type { Sex } from "@/lib/types"
import { CATEGORIES } from "@/lib/types"

interface BodyFatGaugeProps {
  percentage: number
  sex: Sex
  color: string
}

// The gauge goes from -180deg to 0deg (a semicircle at the bottom)
// We map percentage 0–60 to the arc

const MIN_PCT = 0
const MAX_PCT = 60

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1"
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

// Map percentage to angle on semicircle (-180 to 0)
function pctToAngle(pct: number): number {
  const clamped = Math.max(MIN_PCT, Math.min(MAX_PCT, pct))
  // -180 = left tip (0%), 0 = right tip (60%)
  return -180 + (clamped / MAX_PCT) * 180
}

export default function BodyFatGauge({ percentage, sex, color }: BodyFatGaugeProps) {
  const [animatedPct, setAnimatedPct] = useState(0)

  useEffect(() => {
    // Animate from 0 to percentage
    let start: number | null = null
    const duration = 1200
    const target = percentage

    function step(timestamp: number) {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedPct(eased * target)
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [percentage])

  const cx = 160
  const cy = 160
  const r = 120
  const trackWidth = 18

  // Arc segments for categories (background colored bands)
  const arcSegments: { start: number; end: number; color: string }[] = []
  for (const cat of CATEGORIES) {
    const [catMin, catMax] = cat.range[sex]
    const clampedMin = Math.min(catMin, MAX_PCT)
    const clampedMax = Math.min(catMax, MAX_PCT)
    if (clampedMin >= clampedMax) continue
    arcSegments.push({
      start: pctToAngle(clampedMin) + 90,
      end: pctToAngle(clampedMax) + 90,
      color: cat.color,
    })
  }

  const needleAngle = pctToAngle(animatedPct)
  const needleTip = polarToCartesian(cx, cy, r - 10, needleAngle + 90)
  const needleBase1 = polarToCartesian(cx, cy, 12, needleAngle + 90 + 90)
  const needleBase2 = polarToCartesian(cx, cy, 12, needleAngle + 90 - 90)

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 320 190"
        className="w-full max-w-xs"
        aria-label={`Gauge mostrando ${percentage}% de grasa corporal`}
      >
        {/* Track background */}
        <path
          d={describeArc(cx, cy, r, -90, 90)}
          fill="none"
          stroke="#1e1e1e"
          strokeWidth={trackWidth}
          strokeLinecap="round"
        />

        {/* Category colored segments */}
        {arcSegments.map((seg, i) => (
          <path
            key={i}
            d={describeArc(cx, cy, r, seg.start - 90, seg.end - 90)}
            fill="none"
            stroke={seg.color}
            strokeWidth={trackWidth}
            strokeLinecap="butt"
            opacity={0.35}
          />
        ))}

        {/* Active fill arc */}
        <path
          d={describeArc(cx, cy, r, -90, needleAngle + 90)}
          fill="none"
          stroke={color}
          strokeWidth={trackWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />

        {/* Needle */}
        <polygon
          points={`${needleTip.x},${needleTip.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
          fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={10} fill="#111" stroke={color} strokeWidth={2} />

        {/* Min / Max labels */}
        <text x={30} y={cy + 24} fontSize="10" fill="#444" textAnchor="middle">0%</text>
        <text x={292} y={cy + 24} fontSize="10" fill="#444" textAnchor="middle">60%</text>
      </svg>

      {/* Percentage display */}
      <div className="text-center -mt-4">
        <div
          className="font-display"
          style={{
            fontSize: "4.5rem",
            lineHeight: 1,
            color: color,
            textShadow: `0 0 30px ${color}66`,
          }}
        >
          {animatedPct.toFixed(1)}
          <span
            className="font-display"
            style={{ fontSize: "2rem", color: color, opacity: 0.7 }}
          >
            %
          </span>
        </div>
        <div className="text-sm mt-1" style={{ color: "#666" }}>
          grasa corporal
        </div>
      </div>
    </div>
  )
}
