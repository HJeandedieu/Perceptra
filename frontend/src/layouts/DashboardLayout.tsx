import Sidebar from '../components/Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="bg-background text-text-body min-h-screen">
      {/* Atmosphere decor */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-1/3 h-1/3 bg-threat-critical/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <Sidebar />

      <main className="ml-64 pt-24 pb-12 px-container-margin min-h-screen relative z-10">
        <div className="max-w-[1440px] mx-auto">
          {title && (
            <div className="mb-8">
              {subtitle && <p className="font-label-caps text-label-caps text-primary mb-1">{subtitle}</p>}
              <h2 className="font-headline-lg text-headline-lg text-text-heading">{title}</h2>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
