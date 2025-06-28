import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BackLoop Demo',
  description: 'Returns Made Easier',
  generator: 'Akmal',
  icons: {
    icon: [
      { url: 'https://cdn-icons-png.freepik.com/512/2819/2819071.png', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
