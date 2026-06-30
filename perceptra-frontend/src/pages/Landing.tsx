import { useNavigate, Link } from 'react-router-dom'

const LOGO_URL =
'https://perceptra-phi.vercel.app/favicon.svg'
const HERO_BG =
'https://images.pexels.com/photos/6570858/pexels-photo-6570858.jpeg?_gl=1*m3ohn*_ga*OTQ2OTIwMDY5LjE3Nzc3MTUzMDA.*_ga_8JE65Q40S6*czE3ODEyNTE4MDIkbzUkZzEkdDE3ODEyNTMwNzckajQ2JGwwJGgw'
const FEED_IMG_1 =
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHQDVCcy5DgrQ_KLguPhdoCGRVD8z5Lj4aqcZbAtaRHM4wc-43'
const FEED_IMG_2 =
  'https://i.pinimg.com/736x/ca/13/7a/ca137af7d7e0636d4b463fa73a84d251.jpg'

const FEED_IMG_3 =
'https://images.pexels.com/photos/22307556/pexels-photo-22307556.jpeg?_gl=1*z317b9*_ga*OTQ2OTIwMDY5LjE3Nzc3MTUzMDA.*_ga_8JE65Q40S6*czE3ODEyNTE4MDIkbzUkZzEkdDE3ODEyNTIxMjEkajU5JGwwJGgw'


const FEATURES = [
  {
    img: FEED_IMG_1,
    icon: 'visibility',
    title: 'Live Feed Monitoring',
    desc: 'Continuous oversight across distributed camera arrays with unified, low-latency event streaming.',
  },
  {
    img: FEED_IMG_2,
    icon: 'psychology',
    title: 'AI Inference Engine',
    desc: 'YOLOv8 object detection runs at the edge, classifying threats with high confidence in every frame.',
  },
  {
    img: FEED_IMG_3,
    icon: 'notifications_active',
    title: 'Automated Alerting',
    desc: 'High and critical severity events trigger instant notifications across SMS, email, and the web dashboard.',
  },
]

const STATS = [
  { value: '< 80ms', label: 'Detection Latency' },
  { value: '99.9%', label: 'Platform Uptime' },
  { value: '500+', label: 'Nodes Monitored' },
  { value: '94.7%', label: 'Detection Accuracy' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        background: '#F8F8F6',
        color: '#1E1E1E',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <header
        className="fixed top-0 left-0 w-full z-50"
        style={{
          background: 'rgba(248, 248, 246, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <div className="flex items-center justify-between max-w-[1280px] mx-auto px-8 h-16">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
              style={{
                background: '#dad8cd6c',
                border: '1px solid #69614961',
              }}
            >
              <img
                alt="Perceptra"
                className="h-10 w-10 object-contain"
                src={LOGO_URL}
              />
            </div>

            <span
              className="font-bold"
              style={{
                fontSize: 16,
                color: '#1E1E1E',
                letterSpacing: '-0.01em',
              }}
            >
              Perceptra
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Platform', 'Solutions', 'Analytics', 'Resources'].map(
              (label) => (
                <a
                  key={label}
                  href="#"
                  className="transition-colors duration-150"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#6B7280',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#1E1E1E'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6B7280'
                  }}
                >
                  {label}
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block p-btn-ghost px-4 py-2"
              style={{ fontSize: 14 }}
            >
              Sign In
            </Link>

            <button
              onClick={() => navigate('/signup')}
              className="p-btn-primary px-5 py-2 flex items-center gap-1.5"
              style={{ fontSize: 14 }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative pt-16 min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_BG}
              alt=""
              className="w-full h-full object-cover"
              style={{ opacity: 1 }}
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(248,248,246,0.3) 0%, rgba(248,248,246,0.85) 70%, #F8F8F6 100%)',
              }}
            />
          </div>

          <div className="relative z-10 max-w-[1280px] mx-auto px-8 w-full py-20">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
              style={{
                background: '#F0FDF4',
                border: '1px solid #A7F3D0',
              }}
            >
              <span className="status-dot status-dot-online status-dot-pulse" />

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#065F46',
                  letterSpacing: '0.05em',
                }}
              >
                YOLOV8 ENGINE ACTIVE
              </span>
            </div>

            <h1
              className="font-bold leading-tight mb-6 max-w-3xl"
              style={{
                fontSize: 'clamp(36px, 5vw, 60px)',
                color: '#1E1E1E',
                letterSpacing: '-0.03em',
              }}
            >
              AI-powered threat detection
              <br />
              <span style={{ color: '#D4A017' }}>
                for the modern enterprise.
              </span>
            </h1>

            <p
              className="max-w-xl mb-10"
              style={{
                fontSize: 17,
                color: '#6B7280',
                lineHeight: 1.7,
              }}
            >
              Perceptra combines a YOLOv8 computer vision engine with
              real-time WebSocket streaming to detect, classify, and alert on
              security threats.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <button
                onClick={() => navigate('/signup')}
                className="p-btn-primary px-8 py-3"
              >
                Start Monitoring
              </button>

              <button
                onClick={() => navigate('/login')}
                className="p-btn-secondary px-8 py-3"
              >
                View Dashboard
              </button>
            </div>

            <div className="flex flex-wrap gap-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div
                    className="font-bold leading-none mb-1"
                    style={{
                      fontSize: 24,
                      color: '#1E1E1E',
                    }}
                  >
                    {stat.value}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: '#9CA3AF',
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-8 max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
            <div>
              <p className="section-label mb-3">Core Capabilities</p>

              <h2
                className="font-bold leading-tight max-w-lg"
                style={{
                  fontSize: 'clamp(26px, 3vw, 38px)',
                  color: '#1E1E1E',
                }}
              >
                Everything your security team needs, in one platform.
              </h2>
            </div>

            <a
              href="#"
              className="flex items-center gap-1.5 flex-shrink-0 transition-colors duration-150"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#D4A017',
              }}
            >
              View full documentation
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-card p-card-hover rounded-xl overflow-hidden flex flex-col"
              >
                <div
                  className="h-52 overflow-hidden"
                  style={{ background: '#F3F4F6' }}
                >
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-lg mb-4"
                    style={{
                      background: '#FEF3C7',
                      border: '1px solid #FCD34D',
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: 18,
                        color: '#D4A017',
                      }}
                    >
                      {feature.icon}
                    </span>
                  </div>

                  <h3
                    className="font-semibold mb-2"
                    style={{
                      fontSize: 16,
                      color: '#1E1E1E',
                    }}
                  >
                    {feature.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 14,
                      color: '#6B7280',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                background: '#dad8cd6c',
                border: '1px solid #69614961',
              }}
                >
                  <img
                    alt="Perceptra"
                    className="h-10 w-10 object-contain"
                    src={LOGO_URL}
                  />
                </div>

                <span
                  className="font-bold"
                  style={{
                    fontSize: 15,
                    color: '#1E1E1E',
                  }}
                >
                  Perceptra
                </span>
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: '#9CA3AF',
                  lineHeight: 1.6,
                }}
              >
                Enterprise AI surveillance and real-time threat detection.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: [
                  'Documentation',
                  'API Reference',
                  'Integrations',
                  'Security',
                ],
              },
              {
                title: 'Company',
                links: [
                  'Team',
                  'Privacy Policy',
                  'Terms of Service',
                  'Contact',
                ],
              },
              {
                title: 'Resources',
                links: [
                  'System Status',
                  'Changelog',
                  'Support',
                  'Community',
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4
                  className="font-semibold mb-4"
                  style={{
                    fontSize: 13,
                    color: '#1E1E1E',
                  }}
                >
                  {col.title}
                </h4>

                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="transition-colors duration-150 hover:underline underline-offset-4"
                        style={{
                          fontSize: 13,
                          color: '#9CA3AF',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#1E1E1E'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#9CA3AF'
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
            style={{
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: '#D1D5DB',
              }}
            >
              © {new Date().getFullYear()} Perceptra. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {['ISO 27001', 'SOC 2 Type II', 'AES-256'].map((badge) => (
                <span
                  key={badge}
                  style={{
                    fontSize: 11,
                    color: '#D1D5DB',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}