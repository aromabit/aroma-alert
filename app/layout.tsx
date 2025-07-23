import ThemeToggle from "./components/ThemeToggle"
import { ThemeProvider } from "./contexts/ThemeContext"
import "./globals.css"

export const metadata = {
  title: "Aroma Alert - データモニタリング",
  description: "アロマアラートシステム - リアルタイム確率モニタリング",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <ThemeProvider>
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <header
              style={{
                background: "var(--bg-secondary)",
                borderBottom: "1px solid var(--border-color)",
                padding: "1rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <h1
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  Aroma Alert
                </h1>
              </div>
              <ThemeToggle />
            </header>

            <main
              style={{
                flex: 1,
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                padding: "1rem",
                width: "100%",
              }}
            >
              {children}
            </main>

            <footer
              style={{
                background: "var(--bg-secondary)",
                borderTop: "1px solid var(--border-color)",
                padding: "1rem 2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
              }}
            >
              <img
                src="/logo.png"
                alt="Aroma Bit Logo"
                style={{ height: "1.5rem" }}
              />
              <p style={{ padding: ".5rem" }}>
                © 2025 Aroma Bit, Inc. All rights reserved.
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
export default RootLayout
