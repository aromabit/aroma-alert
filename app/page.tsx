"use client"

import React, { FC, useState, useEffect } from "react"
import dynamic from "next/dynamic"

const Plot = dynamic(
  () => import("react-plotly.js").then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-primary)",
        }}
      >
        Loading chart...
      </div>
    ),
  }
)

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
    probability = Math.max(0.5, Math.min(99.5, previousProbability + change))
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
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date(),
    status,
    probability,
  }
}

const ProbabilityChart: FC<{ dataPoints: DataPoint[] }> = ({ dataPoints }) => {
  const sortedPoints = [...dataPoints].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  )

  const getCSSVar = (varName: string) => {
    if (typeof window !== "undefined") {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim()
    }
    return ""
  }

  const plotData = [
    {
      x: sortedPoints.map((point) => point.timestamp),
      y: sortedPoints.map((point) => point.probability),
      type: "scatter" as const,
      mode: "lines+markers" as const,
      name: "確率値",
      line: {
        color: getCSSVar("--text-tertiary"),
        width: 3,
      },
      marker: {
        size: 8,
        color: sortedPoints.map((point) => {
          switch (point.status) {
            case "good":
              return getCSSVar("--status-good-border")
            case "normal":
              return getCSSVar("--status-normal-border")
            case "bad":
              return getCSSVar("--status-bad-border")
            default:
              return getCSSVar("--text-tertiary")
          }
        }),
      },
      hovertemplate:
        "<b>%{customdata}</b><br>" +
        "時刻: %{x}<br>" +
        "確率値: %{y:.1f}%<br>" +
        "<extra></extra>",
      customdata: sortedPoints.map((point) => point.status),
    },
  ]

  const layout = {
    title: {
      text: "Aroma Alert モニタリング",
      font: {
        size: 24,
        color: getCSSVar("--text-primary"),
      },
      x: 0.5,
    },
    xaxis: {
      title: {
        text: "時間",
        font: {
          size: 14,
          color: getCSSVar("--text-secondary"),
        },
      },
      gridcolor: getCSSVar("--border-color"),
      tickfont: {
        color: getCSSVar("--text-secondary"),
      },
      linecolor: getCSSVar("--border-color"),
      type: "date" as const,
      range: [new Date(Date.now() - 60 * 1000), new Date()],
    },
    yaxis: {
      title: {
        text: "確率値 (%)",
        font: {
          size: 14,
          color: getCSSVar("--text-secondary"),
        },
      },
      range: [-5, 105],
      gridcolor: getCSSVar("--border-color"),
      tickfont: {
        color: getCSSVar("--text-secondary"),
      },
      linecolor: getCSSVar("--border-color"),
    },
    plot_bgcolor: getCSSVar("--bg-tertiary"),
    paper_bgcolor: getCSSVar("--bg-secondary"),
    font: {
      color: getCSSVar("--text-primary"),
    },
    shapes: [
      {
        type: "line" as const,
        x0: new Date(Date.now() - 60 * 1000),
        x1: new Date(),
        y0: 33,
        y1: 33,
        line: {
          color: getCSSVar("--status-good-border"),
          width: 2,
          dash: "dash" as const,
        },
        name: "Good閾値",
      },
      {
        type: "line" as const,
        x0: new Date(Date.now() - 60 * 1000),
        x1: new Date(),
        y0: 66,
        y1: 66,
        line: {
          color: getCSSVar("--status-bad-border"),
          width: 2,
          dash: "dash" as const,
        },
        name: "Bad閾値",
      },
    ],
    annotations: [
      {
        x: new Date(Date.now() - 0.5 * 60 * 1000).toISOString(),
        y: 33,
        text: "33% (Good閾値)",
        showarrow: false,
        xanchor: "left" as const,
        font: {
          color: getCSSVar("--status-good-border"),
          size: 12,
        },
      },
      {
        x: new Date(Date.now() - 0.5 * 60 * 1000).toISOString(),
        y: 66,
        text: "66% (Bad閾値)",
        showarrow: false,
        xanchor: "left" as const,
        font: {
          color: getCSSVar("--status-bad-border"),
          size: 12,
        },
      },
    ],
    margin: {
      t: 80,
      b: 60,
      l: 60,
      r: 40,
    },
    autosize: true,
  }

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      "pan2d" as const,
      "select2d" as const,
      "lasso2d" as const,
      "zoomIn2d" as const,
      "zoomOut2d" as const,
      "autoScale2d" as const,
      "hoverClosestCartesian" as const,
      "hoverCompareCartesian" as const,
    ],
    modeBarButtonsToAdd: [],
    toImageButtonOptions: {
      format: "png" as const,
      filename: "aroma-alert-chart",
      height: 500,
      width: 800,
      scale: 1,
    },
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
        width: "100%",
      }}
    >
      <div>
        {dataPoints.length > 0 && (
          <div
            style={{
              background: "var(--bg-tertiary)",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px var(--shadow-color)",
              border: "1px solid var(--border-color)",
              marginBottom: "1rem",
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

      <div
        style={{
          background: "var(--bg-tertiary)",
          borderRadius: "8px",
          boxShadow: "0 4px 12px var(--shadow-color)",
          padding: "1rem",
          width: "100%",
        }}
      >
        <div style={{ width: "100%", height: "500px" }}>
          <Plot
            data={plotData}
            layout={layout}
            config={config}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        </div>
      </div>
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
        return [newData, ...prev].slice(0, 100)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <ProbabilityChart dataPoints={dataPoints} />
}

export default Page
