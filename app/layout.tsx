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
          <main
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              height: "100vh",
              padding: "1rem",
              width: "100%",
            }}
          >
            {children}
          </main>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}
export default RootLayout
