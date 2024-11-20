import './globals.css'

export const metadata = {
  title: 'JD Tool - Job Description Generator and Comparison',
  description: 'Create and compare job descriptions using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
