import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[86vh] overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-slate-900/0 to-slate-900/60 pointer-events-none" />

      {/* PSP-style subtle scanlines */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '100% 3px'
      }} />

      {/* 3D Spline Scene */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[78vh]">
        <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-end sm:items-center">
        <div className="container mx-auto px-6 pb-12 sm:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 mb-4 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs tracking-wider uppercase text-blue-200/80">Product Designer Portfolio</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(56,189,248,0.15)]">
              Playful. Precise. Portable era vibes.
            </h1>
            <p className="mt-4 text-blue-100/80 text-base sm:text-lg leading-relaxed">
              Channeling the iconic PSP interface — clean grids, smooth pills, and fluid transitions — to present a modern, interactive portfolio.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#work" className="px-5 py-2.5 rounded-full bg-blue-500 text-white font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)] hover:bg-blue-400 transition-colors">
                View Selected Work
              </a>
              <a href="#about" className="px-5 py-2.5 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                About Me
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
