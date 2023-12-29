import localFont from 'next/font/local'
import './globals.css'

const myFont = localFont({ src: './TTFirsNeue-Regular.woff2', display: 'swap' })

export const metadata = {
  title: 'Devlinks',
  description: 'Link sharing app for developers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={myFont.className}>{children}</body>
    </html>
  )
}
