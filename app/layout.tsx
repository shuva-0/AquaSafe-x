import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AquaSafe X∞ — Autonomous Water Intelligence',
  description: 'Multi-layer water quality analysis and public health decision support platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0B0F19] text-slate-200 font-body antialiased">
        {children}
      </body>
    </html>
  )
}