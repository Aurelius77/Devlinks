import localFont from 'next/font/local'
import './globals.css'
import GlobalStateProvider from './globalstate/context'

const myFont = localFont({ src: './TTFirsNeue-Regular.woff2', display: 'swap' })

export const metadata = {
  title: 'Devlinks',
  description: 'Link sharing app for developers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={myFont.className}>
        <GlobalStateProvider>
          {children}
        </GlobalStateProvider>
      </body>
    </html>
  )
}
