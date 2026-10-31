import { Link } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';

export default function Home() {
  const iaModules = [
    {
      title: 'DESIGN ENGINEERING & WORKFLOW',
      desc: '11-stage industrial product development pipeline, Design Engineer responsibilities, and interactive process simulator.',
      link: '/workflow',
      badge: 'WORKFLOW',
    },
    {
      title: 'INDUSTRIAL PROJECTS & CASE STUDIES',
      desc: '6 real-world engineering case studies including gear reverse engineering, wheelchair frame FEA, and retrofitting.',
      link: '/projects',
      badge: 'PROJECTS',
    },
    {
      title: 'ENGINEERING TOPICS & DRAFTING',
      desc: 'Orthographic, Isometric, Sectional drawings, Title Block Studio, BOM trees, and Engineering Analysis.',
      link: '/topics',
      badge: 'TOPICS',
    },
    {
      title: 'GEAR ENGINEERING LAB',
      desc: 'Interactive 3D involute gear generator, construction circles, spur/helical/bevel/worm types, and kinematics.',
      link: '/gear-lab',
      badge: '3D LAB',
    },
    {
      title: 'GD&T & INDUSTRIAL STANDARDS',
      desc: 'ASME Y14.5 & ISO standards, Feature Control Frames, material modifiers (MMC/LMC), and ISO 286 fits calculator.',
      link: '/standards',
      badge: 'STANDARDS',
    },
    {
      title: 'SHEET METAL FABRICATION',
      desc: 'Bend Allowance, K-Factor calculations, sheet unfolding, and punch pattern design.',
      link: '/sheet-metal',
      badge: 'COMING SOON',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            PRODUCTION-GRADE MECHANICAL PLATFORM
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-text-primary leading-tight tracking-tight">
            MECHANICAL DESIGN,<br />
            <span className="text-accent">VISUALIZED.</span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            Learn industrial mechanical design through interactive 3D WebGL models, engineering workflows, calculations, drawings, and ASME/ISO standards.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/gear-lab"
              className="px-6 py-3.5 bg-accent text-background font-extrabold rounded-xl hover:bg-accent-bright transition shadow-lg shadow-accent/25 flex items-center gap-2 text-sm"
            >
              Enter 3D Gear Lab →
            </Link>
            <Link
              to="/workflow"
              className="px-6 py-3.5 bg-surface-elevated text-text-primary border border-border font-bold rounded-xl hover:border-accent transition text-sm"
            >
              Explore Workflow Pipeline
            </Link>
          </div>
        </div>

        {/* Hero Cinematic 3D Animation */}
        <div className="lg:col-span-6 w-full h-[450px] lg:h-[500px] relative rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 8px 48px rgba(0,0,0,0.6), 0 0 80px rgba(34,211,238,0.08)' }}>
          <video
            src="/hero-animation.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Subtle bottom fade overlay for blending */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(10,10,15,0.55) 0%, transparent 50%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </section>

      {/* Information Architecture Grid */}
      <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto w-full border-t border-border space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Core Information Architecture
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Navigational modules derived directly from the textbook curriculum and handwritten reference architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {iaModules.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-surface border border-border hover:border-accent/50 transition flex flex-col justify-between group shadow-sm hover:shadow-xl"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-surface-elevated text-accent border border-border">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition">
                  {item.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>
              <Link
                to={item.link}
                className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5"
              >
                Explore Module →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
