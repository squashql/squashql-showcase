import type { Metadata } from "next"
import { Inter } from "next/font/google"
import 'bootstrap/dist/css/bootstrap.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SquashQL Pivot Table",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
