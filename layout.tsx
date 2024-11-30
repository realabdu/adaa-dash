import type { Metadata } from "'next'"
import { IBM_Plex_Sans_Arabic } from "'next/font/google'"
import "'./globals.css'"

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({ 
  subsets: ["'arabic'"],
  weight: ["'300'", "'400'", "'500'", "'600'", "'700'"],
  variable: "'--font-ibm-plex-sans-arabic'",
})

export const metadata: Metadata = {
  title: "'Statistics Dashboard'",
  description: "'Protected statistics dashboard for Umrah data'",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexSansArabic.variable}>
      <body className={ibmPlexSansArabic.className}>{children}</body>
    </html>
  )
}

