import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLvIwfwhOrhaPU06b2fqE5zcqwt-2Hji0GL1dreeIQJfKNkRa1hDroUmKGVzs7VYNLPQA5R7T_CzSQc5yl7ydS7sRgtbqvRg0s0IY1MZ1zWDjx5mi7c1x4Q3raCbA9tvIh4Ir6Yd86Fo7uDdyrVh5uF4BHN_Nuj6RkeiVzVSMC4zGf4PQjgBDDlzrmGOvVEbJjAEkZC6uJB9wZvETKba9M2EncDsrwOIBxFyxLLLS1s17EcTMrOvW-08AgQ'

const HERO_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB2UT4sOxiDyPptVMJCarqABUra33UOQKA1YTDPYpMr-3PjlVhczyoZzYwS_s8jOFau9lqj0HU_zkNQXx2ey-rCCys3Hq1ORPMm1zAxBcqifOX5bSsbnO25Cwu8n_g4ubc8oCsCmdNYMh1HZGc00GDiNdWJyqSIgxkKbcZgbZXJvTKJ-vTGJ2V0gA7IoGfjlVMQqBjcKmdrEDgUPAe2NaywOCmDTHVztuwC5V7yQWt7PDh9EQSo3dSmut2UdFf-QTxWjx1DtxQax-g'

const FEED_IMG_1 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBQNZnDAJ9JyFoX6BBvW8J4LVj_tkxe5kdZ5Er8WZLCzXdH6n3B-yx03z7KcCPY7FXf8e4L57VQeiz23Mha2Ny6934fkF0lxDQlsw02uTPjddZ5pMvp7VeQyKy-KjJWwqUGQAcIhj9-ZJ2vjaz8X0NXXd5Y1_PUqyh_VDw4krQWPJg-ViQdRTJibFF6Z4RekZU0AoCyKAw5ku0nTGtp2iqysG8dsLGLTAC-rWOmJNTA8gPg3tMCWj0fGDB8eQ2GHQ8R60WwvCH0Aig'
const FEED_IMG_2 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDbXkZf8oZuirFz6OF7NYsU-s4pIqSDSw7toN6iekKSsRzDYpMda-MUdus_A4EJNy6z-yK-lFQGpLisM4BOdQNaKZ1r5MBoJO4DH6frjZrnBeJCc5XErRRG2q6ICHQ0Y_CzMBIBO9M4OP2v3riDsSWsCg6nTQoQrzYLYAIXiYqDeVhq2WdA1OMPT4nwHFW7ymOhjbBiGfk5pRZkplcYzChPGdPBnbgEFHUff_m_c20_yyMg4HAy_tzjcXQv56_xstxz_ndU1OXMDJQ'
const FEED_IMG_3 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBNSJXLCm2bXRfVaNPg8iLfYyZsWIJLVmhUdmv-1lDOQSxSDySOSxShoOQ9Qxq07a67fMiMVlXKYY3LFZCVXg3jJ4-R0BEp4w6X1hwc_e7eDvaYvY8zkqcT6k2zVIgNZc8vWNId4D6UKCxb5YD61CbsU00y5wR8A-EK-KpD9HwjT2S5YKTqZQ_9vea1BQKprG3ZRKFAXAysdGS4Wk4ntzGv47vuweaTv6rAUWJp3hvfgyTsYlKt_3VJdKklwb4RkENLmAhEVs8RmPo'

const AVATAR_1 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDb4-vfeNGk43Qq-nuJGttE7Mor59c4nJFeEv5iffRFDlIYhiPnE1wtO_1W-LhNmY4HFDl30PbQ9YYc_418MNvOtfD_DUPfzvdCAPBJR-i5mBV5gBVO4111cVxcm-op-BsHQZ4rzUbkt-B-Uuoe054rbmQJYkI_zxG1hPBrxtJfhsEjPNztAwVaUY0uje0pYNbjFmJ7qu98g8_rnq3o16b_VtdCZ-tATyRuVFsNg2tZTmKZRQ7wpipnB7N0o5_CzGQ-CUMX9fHTy90'
const AVATAR_2 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA7kHOFK7BMurgP5vnxLYPRIFlhGEKy1DdAOArp9vM5b_DfaVEM2DkS7qOCDOsPuXhxQ5LsvBYlzgyHa0CGw-zF6e5-PnqUswG9OCel5zEa8zq4zQrSu7EjQ_J27NLzZJe6Lf9HlbyM0_k6gScV0dFnyTTP7wHAUeH3Iqz3h3FQorPu6PMBvSq4RyVQ3nmxWSG63OFL_JFLBBk_EIm86BYOI-rgImGuBLKjLV79jto3kLBBZ9A2iVwAcVn3nXcBotK-ono8iu8ga5Y'
const AVATAR_3 =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBbz46MGmquXZUeCj9WCEINKvLx9ZQDgL7xAwkr-eC8gndMl_u69dMXA2LQAco6Z4crSf1b4BJ-Z56ZxTuo9klPguPz2cOhK8mU3njYFcBdhg82sSd6SOx7WG4pVrnqjJvF6jmTQZcLBhk6_3uL9P90SjAGodY31sMRWvzaTEwSU86vlPnqaGj1EiHalAlpnbG55HDiabfVY5E_vVIxQ376nGQu_sQcsW3Pho-BQVRmuwpvFYpRKdlbEONpe7cRBR6mebtqBi9hYuE'
const CITY_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBwhPKboX4O_R87pqMSX0JpTFZUNQ52SbIrdqNBwCVohZ8LDi0r-xQ3ukSwPXEd5UI6NJys0NEeguT3hTEUXsnYtNh6P4Utv7vXVReAscPFhQvcaUIOx_qhCv3VrNYEvEuw84W-5tGBaPlB5dHU7Wn7sa-jwfPFsgZMbwp3FdVd1pQkTVFM84f3CkgfWsJpdD6PafPPFXb5bZteM4lAMHbXtXNFKzihCdyriRi4Y_2CAI5hL_MZbSLBh049JWimqYE4rSCpQvpinf4'

export default function Landing() {
  const navigate = useNavigate()
  const heroImgRef = useRef<HTMLImageElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${scrolled * 0.4}px)`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const cards = cardsRef.current
    const handlers: (() => void)[] = []

    cards.forEach((card) => {
      if (!card) return
      const handler = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        card.style.setProperty('--mouse-x', `${x}px`)
        card.style.setProperty('--mouse-y', `${y}px`)
      }
      card.addEventListener('mousemove', handler)
      handlers.push(() => card.removeEventListener('mousemove', handler))
    })

    return () => handlers.forEach((h) => h())
  }, [])

  return (
    <div className="bg-background text-on-surface font-body-inter selection:bg-primary-container selection:text-on-primary-container">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-transparent backdrop-blur-md">
        <div className="flex justify-between items-center px-gutter py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3">
            <img alt="Perceptra" className="h-10 w-10 object-contain" src={LOGO_URL} />
            <span className="text-[40px] leading-[48px] font-bold text-on-surface tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Perceptra
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 glass-nav px-8 py-2.5 rounded-full">
            <a className="text-primary font-semibold border-b-2 border-primary pb-1 font-body-md text-body-md" href="#">Platform</a>
            <a className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md" href="#">Solutions</a>
            <a className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md" href="#">Intelligence</a>
            <a className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md" href="#">Resources</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link className="hidden sm:block text-on-surface/70 font-medium hover:text-primary transition-colors font-body-md" to="/login">Login</Link>
            <button className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-all duration-300 button-glow flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/signup')}
            >
              Get Started
              <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0 hero-mask">
            <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-surface/60 to-background" />
            <img
              ref={heroImgRef}
              className="w-full h-full object-cover opacity-60"
              src={HERO_BG}
              alt=""
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-[1440px] mx-auto px-gutter w-full">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-card border-primary/20 mb-8 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#7c3aed]" />
                <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">
                  YOLOv8 Vision Engine Active
                </span>
              </div>
              <h1
                className="text-[40px] md:text-[72px] leading-[48px] md:leading-[80px] tracking-tighter mb-6 text-glow font-bold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Unforgettable Threat Intelligence.<br />
                <span className="text-primary">Real-Time Perception.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
                Deploy the world&apos;s most advanced vision-based security infrastructure. Perceptra leverages
                real-time YOLOv8 neural networks to identify, track, and neutralize threats before they manifest.
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <button
                  className="bg-primary-container text-on-primary-container px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-primary/20 cursor-pointer"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </button>
                <button
                  className="glass-card px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Trust Panel */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div className="glass-card p-6 rounded-2xl flex items-center gap-6 group hover:border-primary/50 transition-colors">
                <div className="flex -space-x-4">
                  <img className="w-12 h-12 rounded-full border-2 border-surface object-cover" src={AVATAR_1} alt="" />
                  <img className="w-12 h-12 rounded-full border-2 border-surface object-cover" src={AVATAR_2} alt="" />
                  <img className="w-12 h-12 rounded-full border-2 border-surface object-cover" src={AVATAR_3} alt="" />
                  <div className="w-12 h-12 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-xs font-bold">
                    +500
                  </div>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-primary leading-none">500+</div>
                  <div className="text-on-surface/60 font-medium">Nodes Secured Worldwide</div>
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl flex items-center gap-6 group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-primary leading-none">99.9%</div>
                  <div className="text-on-surface/60 font-medium">Detection Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-section-padding px-gutter max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="font-label-mono text-label-mono text-primary uppercase tracking-[0.2em] mb-4 block">
                Core Capabilities
              </span>
              <h2
                className="font-headline-lg text-[32px] md:text-[48px] leading-tight font-semibold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Advanced Perception Powered by YOLOv8 Intelligence
              </h2>
            </div>
            <div className="pb-2">
              <a className="text-primary font-semibold flex items-center gap-2 group" href="#">
                Explore Full Architecture
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div
              ref={(el) => { cardsRef.current[0] = el }}
              className="group relative overflow-hidden rounded-3xl glass-card flex flex-col h-[500px] transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-3/5 overflow-hidden relative">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" src={FEED_IMG_1} alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
              </div>
              <div className="p-8 flex flex-col justify-end flex-grow">
                <div className="mb-4 text-primary bg-primary/10 w-fit p-3 rounded-xl">
                  <span className="material-symbols-outlined text-3xl">visibility</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Live Feed Oversight
                </h3>
                <p className="text-on-surface-variant font-body-md">
                  Omniscient monitoring across distributed camera arrays with unified latency control.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              ref={(el) => { cardsRef.current[1] = el }}
              className="group relative overflow-hidden rounded-3xl glass-card flex flex-col h-[500px] transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-3/5 overflow-hidden relative">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" src={FEED_IMG_2} alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
              </div>
              <div className="p-8 flex flex-col justify-end flex-grow">
                <div className="mb-4 text-primary bg-primary/10 w-fit p-3 rounded-xl">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  AI Inference Engine
                </h3>
                <p className="text-on-surface-variant font-body-md">
                  Edge-optimized YOLOv8 models providing sub-millisecond object detection in every frame.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              ref={(el) => { cardsRef.current[2] = el }}
              className="group relative overflow-hidden rounded-3xl glass-card flex flex-col h-[500px] transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-3/5 overflow-hidden relative">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" src={FEED_IMG_3} alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
              </div>
              <div className="p-8 flex flex-col justify-end flex-grow">
                <div className="mb-4 text-primary bg-primary/10 w-fit p-3 rounded-xl">
                  <span className="material-symbols-outlined text-3xl">notification_important</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Integrated Alerts
                </h3>
                <p className="text-on-surface-variant font-body-md">
                  Instant SMS, Email, and Push notifications triggered by custom anomalous behavior detection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Visualization */}
        <section className="relative py-section-padding overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
          </div>
          <div className="relative max-w-[1440px] mx-auto px-gutter text-center">
            <h2
              className="text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] mb-8 max-w-4xl mx-auto font-semibold tracking-tighter"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              See the world through the eyes of Perceptra.
            </h2>
            <div className="glass-card aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border-white/20 p-1">
              <img className="w-full h-full object-cover rounded-2xl" src={CITY_IMG} alt="" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-padding bg-surface-container-lowest border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-lg px-gutter max-w-[1440px] mx-auto">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img alt="Perceptra" className="h-8 w-8 object-contain" src={LOGO_URL} />
              <span className="font-headline-md text-headline-md font-bold text-on-surface" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Perceptra
              </span>
            </div>
            <p className="text-on-surface-variant font-body-md mb-6 pr-8">
              The sentinel of the digital age. Advanced threat intelligence powered by deep neural networks.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-headline-md text-headline-md font-bold text-on-surface mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Product</h4>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Documentation</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">API Reference</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Integrations</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline-md text-headline-md font-bold text-on-surface mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Company</h4>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Team</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline-md text-headline-md font-bold text-on-surface mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Intelligence</h4>
            <div className="glass-card p-6 rounded-2xl">
              <p className="text-on-surface-variant text-sm mb-4">Stay updated on the latest global threat landscape.</p>
              <div className="flex">
                <input className="bg-surface border-outline-variant rounded-l-xl w-full focus:border-primary focus:ring-0 text-sm outline-none px-3 py-2" placeholder="Email address" type="email" />
                <button className="bg-primary-container text-on-primary-container px-4 rounded-r-xl hover:bg-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-gutter mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-sm">&copy; 2024 Perceptra Threat Intel. All rights reserved.</p>
          <div className="flex gap-8 text-sm text-on-surface-variant">
            <span>ISO 27001 Certified</span>
            <span>SOC2 Type II</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
