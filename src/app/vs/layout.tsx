import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export default function VsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        {children}
      </main>
      <Footer />
    </>
  )
}
