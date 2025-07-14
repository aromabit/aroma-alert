export const metadata = {
  title: "Page title",
  description: "Page description",
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
export default RootLayout
