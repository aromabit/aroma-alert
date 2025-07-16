"use client"

import React, { FC, useState, useEffect } from "react"
import ThemeToggle from "./components/ThemeToggle"

type DataPoint = {
  id: string
  timestamp: Date
  status: "good" | "normal" | "bad"
  probability: number
}

const generateMockData = (previousProbability?: number): DataPoint => {
  let probability: number

  if (previousProbability === undefined) {
    probability = Math.random() * 100
  } else {
    const change = (Math.random() - 0.5) * 40
    probability = Math.max(0, Math.min(100, previousProbability + change))
  }

  let status: "good" | "normal" | "bad"
  if (probability <= 33) {
    status = "good"
  } else if (probability >= 66) {
    status = "bad"
  } else {
    status = "normal"
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
    status,
    probability,
  }
}

const ProbabilityChart: FC<{ dataPoints: DataPoint[] }> = ({ dataPoints }) => {
  const chartWidth = 800
  const chartHeight = 400
  const padding = 60

  const getTimeRange = () => {
    if (dataPoints.length === 0) return { start: new Date(), end: new Date() }
    const times = dataPoints.map((p) => p.timestamp.getTime())
    return {
      start: new Date(Math.min(...times)),
      end: new Date(Math.max(...times)),
    }
  }

  const { start, end } = getTimeRange()
  const timeRange = end.getTime() - start.getTime()

  const getXPosition = (timestamp: Date) => {
    if (timeRange === 0) return padding
    const relativeTime = timestamp.getTime() - start.getTime()
    return padding + (relativeTime / timeRange) * (chartWidth - 2 * padding)
  }

  const getYPosition = (probability: number) => {
    const plotArea = chartHeight - 2 * padding
    const yPos = padding + (plotArea * (100 - probability)) / 100
    return yPos
  }

  const generatePath = () => {
    if (dataPoints.length < 2) return ""

    const sortedPoints = [...dataPoints].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    )

    let path = `M ${getXPosition(sortedPoints[0].timestamp)} ${getYPosition(sortedPoints[0].probability)}`

    for (let i = 1; i < sortedPoints.length; i++) {
      const point = sortedPoints[i]
      path += ` L ${getXPosition(point.timestamp)} ${getYPosition(point.probability)}`
    }

    return path
  }

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "72rem",
        padding: "1rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "var(--text-primary)",
          fontSize: "1.5rem",
          fontWeight: "600",
        }}
      >
        Aroma Alert モニタリング
      </h2>

      <div>
        {dataPoints.length > 0 && (
          <div
            style={{
              background: "var(--bg-tertiary)",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px var(--shadow-color)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "var(--text-primary)",
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              最新測定値
            </h3>
            <div>
              <div
                style={{
                  marginBottom: "15px",
                  fontSize: "16px",
                }}
              >
                結果:
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "14px",
                    background:
                      dataPoints[0].status === "good"
                        ? "var(--status-good-bg)"
                        : dataPoints[0].status === "normal"
                          ? "var(--status-normal-bg)"
                          : "var(--status-bad-bg)",
                    color:
                      dataPoints[0].status === "good"
                        ? "var(--status-good-color)"
                        : dataPoints[0].status === "normal"
                          ? "var(--status-normal-color)"
                          : "var(--status-bad-color)",
                  }}
                >
                  {dataPoints[0].status}
                </span>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-secondary)",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "500",
                      color: "var(--text-secondary)",
                    }}
                  >
                    確率値:
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "var(--text-primary)",
                    }}
                  >
                    {dataPoints[0].probability.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <svg
        width={chartWidth}
        height={chartHeight}
        style={{
          background: "var(--bg-tertiary)",
          borderRadius: "8px",
          boxShadow: "0 4px 12px var(--shadow-color)",
        }}
      >
        <defs>
          <linearGradient id="goodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#28a745" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#28a745" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="normalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffc107" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffc107" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="badGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dc3545" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#dc3545" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <rect
          x={padding}
          y={padding}
          width={chartWidth - 2 * padding}
          height={chartHeight - 2 * padding}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="1"
        />

        <line
          x1={padding}
          x2={chartWidth - padding}
          y1={getYPosition(66)}
          y2={getYPosition(66)}
          stroke="var(--status-bad-border)"
          strokeWidth="2"
          strokeOpacity="0.5"
          strokeDasharray="5,5"
        />
        <line
          x1={padding}
          x2={chartWidth - padding}
          y1={getYPosition(33)}
          y2={getYPosition(33)}
          stroke="var(--status-good-border)"
          strokeWidth="2"
          strokeOpacity="0.5"
          strokeDasharray="5,5"
        />

        <text
          x={chartWidth - padding + 5}
          y={getYPosition(66) + 4}
          fill="var(--status-bad-border)"
          fontSize="11"
          fontWeight="bold"
        >
          66% (Bad閾値)
        </text>
        <text
          x={chartWidth - padding + 5}
          y={getYPosition(33) + 4}
          fill="var(--status-good-border)"
          fontSize="11"
          fontWeight="bold"
        >
          33% (Good閾値)
        </text>

        {[0, 25, 50, 75, 100].map((percent) => (
          <g key={percent}>
            <line
              x1={padding - 5}
              x2={padding}
              y1={getYPosition(percent)}
              y2={getYPosition(percent)}
              stroke="var(--text-secondary)"
              strokeWidth="1"
            />
            <text
              x={padding - 10}
              y={getYPosition(percent) + 4}
              textAnchor="end"
              fill="var(--text-secondary)"
              fontSize="10"
            >
              {percent}%
            </text>
          </g>
        ))}

        <path
          d={generatePath()}
          fill="none"
          stroke="var(--text-tertiary)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.8"
        />

        <text
          x={chartWidth / 2}
          y={chartHeight - 10}
          textAnchor="middle"
          fill="#666"
          fontSize="12"
        >
          時間
        </text>
        <text
          x="25"
          y="30"
          textAnchor="middle"
          fill="#666"
          fontSize="12"
          transform={`rotate(-90, 25, 30)`}
        >
          確率値 (%)
        </text>

        {dataPoints.map((point) => (
          <g key={point.id}>
            <circle
              cx={getXPosition(point.timestamp)}
              cy={getYPosition(point.probability)}
              r="6"
              fill={
                point.status === "good"
                  ? "var(--status-good-border)"
                  : point.status === "normal"
                    ? "var(--status-normal-border)"
                    : "var(--status-bad-border)"
              }
              opacity="0.8"
              style={{ cursor: "pointer" }}
            >
              <animate
                attributeName="r"
                values="6;8;6"
                dur="1s"
                repeatCount="1"
              />
              <title>
                {`時刻: ${point.timestamp.toLocaleTimeString("ja-JP")}\nステータス: ${point.status}\n確率値: ${point.probability.toFixed(1)}%`}
              </title>
            </circle>
            <text
              x={getXPosition(point.timestamp)}
              y={getYPosition(point.probability) - 12}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="8"
              fontWeight="bold"
            >
              {point.probability.toFixed(0)}%
            </text>
            <text
              x={getXPosition(point.timestamp)}
              y={chartHeight - 20}
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize="10"
            >
              {point.timestamp.toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

const Page: FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])

  useEffect(() => {
    const initialData = generateMockData()
    setDataPoints([initialData])

    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const previousProbability =
          prev.length > 0 ? prev[0].probability : undefined
        const newData = generateMockData(previousProbability)
        return [newData, ...prev].slice(0, 20)
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <ThemeToggle />
      <ProbabilityChart dataPoints={dataPoints} />
    </div>
  )
}

export default Page
