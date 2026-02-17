import { Inter } from 'next/font/google'
import Home from './page' 
import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// ✅ MUST be at top-level (module scope)
const inter = Inter({
  subsets: ['latin'],
})
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

