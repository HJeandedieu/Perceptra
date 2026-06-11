import Sidebar from '../components/Sidebar'

export default function Settings() {
  return (
    <div className="bg-background text-text-body min-h-screen font-body-md">
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="fixed bottom-0 left-64 w-1/3 h-1/3 bg-threat-critical/5 blur-[100px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      <Sidebar />

      <header className="fixed top-0 right-0 w-[calc(100%-16rem)] backdrop-blur-xl border-b border-glass-stroke flex justify-between items-center h-16 px-gutter z-40 bg-surface-dim/80">
        <h2 className="font-headline-md text-headline-md text-text-heading">Settings</h2>
      </header>

      <main className="ml-64 mt-16 p-container-margin min-h-screen relative z-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="glass-card rounded-xl p-10 text-center max-w-lg mx-auto mt-20">
            <span className="material-symbols-outlined text-5xl text-primary/40 mb-4 block">construction</span>
            <h3 className="font-headline-md text-headline-md text-text-heading mb-2">Settings Panel</h3>
            <p className="text-on-surface-variant font-body-md">
              System configuration and user preferences will be available here.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
