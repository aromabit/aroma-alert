"use client"

import React, { FC, useState, useEffect } from "react"

interface DataPoint {
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
    <div className="chart-container">
      <h2 className="chart-title">データモニタリング - 一次元確率表示</h2>

      <div className="threshold-info">
        <div className="threshold-card">
          <h3>閾値設定</h3>
          <div className="threshold-items">
            <div className="threshold-item good">
              <span>Good:</span> <strong>0% - 33%</strong>
            </div>
            <div className="threshold-item normal">
              <span>Normal:</span> <strong>34% - 65%</strong>
            </div>
            <div className="threshold-item bad">
              <span>Bad:</span> <strong>66% - 100%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="latest-measurement">
        {dataPoints.length > 0 && (
          <div className="measurement-card">
            <h3>最新測定値</h3>
            <div className="measurement-details">
              <div className="measurement-status">
                結果:
                <span className={`status-badge ${dataPoints[0].status}`}>
                  {dataPoints[0].status}
                </span>
              </div>
              <div className="measurement-value">
                <div className="value-display">
                  <span className="value-label">確率値:</span>
                  <span className="value-number">
                    {dataPoints[0].probability.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <svg width={chartWidth} height={chartHeight} className="chart-svg">
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
          stroke="#e0e0e0"
          strokeWidth="1"
        />

        <line
          x1={padding}
          x2={chartWidth - padding}
          y1={getYPosition(66)}
          y2={getYPosition(66)}
          stroke="#dc3545"
          strokeWidth="2"
          strokeOpacity="0.5"
          strokeDasharray="5,5"
        />
        <line
          x1={padding}
          x2={chartWidth - padding}
          y1={getYPosition(33)}
          y2={getYPosition(33)}
          stroke="#28a745"
          strokeWidth="2"
          strokeOpacity="0.5"
          strokeDasharray="5,5"
        />

        <text
          x={chartWidth - padding + 5}
          y={getYPosition(66) + 4}
          fill="#dc3545"
          fontSize="11"
          fontWeight="bold"
        >
          66% (Bad閾値)
        </text>
        <text
          x={chartWidth - padding + 5}
          y={getYPosition(33) + 4}
          fill="#28a745"
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
              stroke="#666"
              strokeWidth="1"
            />
            <text
              x={padding - 10}
              y={getYPosition(percent) + 4}
              textAnchor="end"
              fill="#666"
              fontSize="10"
            >
              {percent}%
            </text>
          </g>
        ))}

        <path
          d={generatePath()}
          fill="none"
          stroke="#ccc"
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
                  ? "#28a745"
                  : point.status === "normal"
                    ? "#ffc107"
                    : "#dc3545"
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
              fill="#333"
              fontSize="8"
              fontWeight="bold"
            >
              {point.probability.toFixed(0)}%
            </text>
            <text
              x={getXPosition(point.timestamp)}
              y={chartHeight - 20}
              textAnchor="middle"
              fill="#666"
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

      <style>{`
        .chart-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: #f8f9fa;
          border-radius: 12px;
        }
        .chart-title {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: 600;
        }
        .probability-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 30px;
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px 25px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .stat.good {
          background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
          border: 2px solid #28a745;
        }
        .stat.normal {
          background: linear-gradient(135deg, #fff8e1 0%, #ffe8a1 100%);
          border: 2px solid #ffc107;
        }
        .stat.bad {
          background: linear-gradient(135deg, #fdf2f2 0%, #f8d7da 100%);
          border: 2px solid #dc3545;
        }
        .stat-label {
          font-size: 14px;
          font-weight: 500;
          color: #666;
          margin-bottom: 5px;
        }
        .stat-value {
          font-size: 20px;
          font-weight: bold;
        }
        .stat.good .stat-value {
          color: #155724;
        }
        .stat.normal .stat-value {
          color: #856404;
        }
        .stat.bad .stat-value {
          color: #721c24;
        }
        .chart-svg {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .threshold-info {
          margin-top: 20px;
        }
        .threshold-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 15px;
          border: 1px solid #dee2e6;
        }
        .threshold-card h3 {
          margin: 0 0 12px 0;
          color: #333;
          font-size: 16px;
          font-weight: 600;
        }
        .threshold-items {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        .threshold-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 14px;
        }
        .threshold-item.good {
          background: #e8f5e8;
          color: #155724;
        }
        .threshold-item.normal {
          background: #fff8e1;
          color: #856404;
        }
        .threshold-item.bad {
          background: #fdf2f2;
          color: #721c24;
        }
        .latest-measurement {
          margin-top: 20px;
        }
        .measurement-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
        }
        .measurement-card h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }
        .measurement-status {
          margin-bottom: 15px;
          font-size: 16px;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 6px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 14px;
        }
        .status-badge.good {
          background: #d4edda;
          color: #155724;
        }
        .status-badge.normal {
          background: #ffe8a1;
          color: #856404;
        }
        .status-badge.bad {
          background: #f8d7da;
          color: #721c24;
        }
        .measurement-value {
          margin-top: 10px;
        }
        .value-display {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        .value-label {
          font-weight: 500;
          color: #666;
        }
        .value-number {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
      `}</style>
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
      <ProbabilityChart dataPoints={dataPoints} />
    </div>
  )
}

export default Page
