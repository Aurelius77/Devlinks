import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import GlobalStateProvider from './globalstate/context'

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata = {
  title: 'Devlinks | Developer Portfolio & Link Hub',
  description: 'Share your developer portfolio, projects, social channels, and code repositories with one clean link.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.className} bg-[#0b0f19] text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white`}>
        <GlobalStateProvider>
          {children}
        </GlobalStateProvider>
      </body>
    </html>
  )
}

