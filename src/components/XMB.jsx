import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { Home, Briefcase, User, Mail, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Play } from 'lucide-react'

const categories = [
  {
    key: 'home',
    label: 'Home',
    icon: Home,
    items: [
      { key: 'intro', title: 'Welcome', subtitle: 'Enter portfolio', cta: 'Start', action: 'start' },
      { key: 'now', title: "Now", subtitle: 'What I\'m focused on', cta: 'View', action: 'about' },
    ],
  },
  {
    key: 'work',
    label: 'Work',
    icon: Briefcase,
    items: [
      { key: 'fintech', title: 'Fintech Mobile', subtitle: 'Onboarding + money movement', cta: 'Case', action: 'work' },
      { key: 'companion', title: 'Gaming Companion', subtitle: 'Quest + stats system', cta: 'Case', action: 'work' },
      { key: 'saas', title: 'SaaS Dashboard', subtitle: 'Design system + theming', cta: 'Case', action: 'work' },
    ],
  },
  {
    key: 'about',
    label: 'About',
    icon: User,
    items: [
      { key: 'bio', title: 'About Me', subtitle: 'Principles, process, skills', cta: 'Open', action: 'about' },
    ],
  },
  {
    key: 'contact',
    label: 'Contact',
    icon: Mail,
    items: [
      { key: 'email', title: 'Email', subtitle: 'hello@portfolio.dev', cta: 'Send', action: 'contact' },
      { key: 'linkedin', title: 'LinkedIn', subtitle: 'Connect professionally', cta: 'Open', action: 'contact' },
    ],
  },
]

export default function XMB() {
  const [col, setCol] = useState(0)
  const [row, setRow] = useState(0)
  const [open, setOpen] = useState(null) // 'work' | 'about' | 'contact' | 'start'
  const containerRef = useRef(null)

  const current = categories[col]
  const items = current.items
  const clampedRow = Math.min(row, items.length - 1)

  useEffect(() => {
    setRow(0)
  }, [col])

  useEffect(() => {
    const onKey = (e) => {
      if (open) {
        if (e.key === 'Escape') setOpen(null)
        return
      }
      if (e.key === 'ArrowRight') {
        setCol((c) => (c + 1) % categories.length)
      } else if (e.key === 'ArrowLeft') {
        setCol((c) => (c - 1 + categories.length) % categories.length)
      } else if (e.key === 'ArrowDown') {
        setRow((r) => Math.min(r + 1, items.length - 1))
      } else if (e.key === 'ArrowUp') {
        setRow((r) => Math.max(r - 1, 0))
      } else if (e.key === 'Enter' || e.key === ' ') {
        const action = items[clampedRow]?.action || current.key
        if (action === 'start') setOpen('work')
        else setOpen(action)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, items, clampedRow, current])

  const bgParallax = useMemo(() => ({
    x: (col - 1.5) * 20,
    y: (clampedRow - 1) * -10,
    scale: 1.02 + col * 0.01,
  }), [col, clampedRow])

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {/* 3D background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={bgParallax}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      >
        <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </motion.div>

      {/* Ambient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/10 to-slate-900/60" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '100% 3px'
      }} />

      {/* Top hint bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur px-4 py-2 text-xs text-blue-200/80 flex items-center gap-3">
        <ChevronLeft className="w-4 h-4" />
        <ChevronRight className="w-4 h-4" />
        <span>Navigate</span>
        <span className="mx-2 h-3 w-px bg-white/10" />
        <ChevronUp className="w-4 h-4" />
        <ChevronDown className="w-4 h-4" />
        <span>Select item</span>
        <span className="mx-2 h-3 w-px bg-white/10" />
        <Play className="w-4 h-4" />
        <span>Enter</span>
      </div>

      {/* XMB ribbon */}
      <div className="absolute left-0 right-0 top-1/3 sm:top-[38%]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {categories.map((c, i) => (
              <button
                key={c.key}
                onClick={() => setCol(i)}
                className="relative group"
              >
                <motion.div
                  animate={{ opacity: i === col ? 1 : 0.6, y: i === col ? 0 : 4, scale: i === col ? 1 : 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-full bg-blue-400/10 blur-xl" style={{ opacity: i === col ? 1 : 0 }} />
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                      <c.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <span className="mt-2 text-xs text-blue-100/80">{c.label}</span>
                </motion.div>
                {i === col && (
                  <motion.div layoutId="xmb-underline" className="h-0.5 bg-blue-400 rounded-full mt-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items rail */}
      <div className="absolute left-0 right-0 top-[55%]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-stretch gap-4 overflow-visible">
            {items.map((it, i) => (
              <motion.button
                key={it.key}
                onClick={() => setRow(i)}
                onDoubleClick={() => setOpen(it.action)}
                animate={{
                  y: i === clampedRow ? 0 : 10,
                  scale: i === clampedRow ? 1 : 0.92,
                  opacity: i === clampedRow ? 1 : 0.6,
                }}
                transition={{ type: 'spring', stiffness: 250, damping: 26 }}
                className="group relative w-[220px] sm:w-[260px] rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.04] p-4 text-left backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: 'radial-gradient(200px circle at var(--x, 50%) var(--y, 50%), rgba(59,130,246,0.18), transparent 40%)'
                }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-blue-200/80">
                    <span>{current.label}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5">{i + 1}/{items.length}</span>
                  </div>
                  <div className="mt-2 text-white text-lg font-semibold">{it.title}</div>
                  <div className="text-blue-200/80 text-sm">{it.subtitle}</div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/90">
                    <Play className="w-3.5 h-3.5" /> {it.cta}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Panels */}
      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40"
          >
            <motion.div
              initial={{ y: 40, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="absolute left-1/2 top-1/2 w-[92vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/60 p-6 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-blue-200/80 text-xs uppercase tracking-wider">{open}</div>
                <button onClick={() => setOpen(null)} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20">Close (Esc)</button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                {open === 'work' && (
                  <div className="space-y-4 text-blue-100/90">
                    <h3 className="text-white text-2xl font-bold">Selected Work</h3>
                    <p className="text-sm text-blue-200/80">A few highlights that blend craft with clarity.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {categories[1].items.map((p) => (
                        <div key={p.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-white font-semibold">{p.title}</div>
                          <div className="text-blue-200/80 text-sm">{p.subtitle}</div>
                          <button className="mt-3 text-blue-300 hover:text-white text-sm">Read case →</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {open === 'about' && (
                  <div className="space-y-4 text-blue-100/90">
                    <h3 className="text-white text-2xl font-bold">About</h3>
                    <p className="text-blue-200/80">I craft interfaces that feel inevitable — clear hierarchy, thoughtful motion, delightful detail.</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {['Design Systems','Interaction Design','Prototyping','User Research','Accessibility','Motion Design'].map(s => (
                        <div key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-blue-200/90">{s}</div>
                      ))}
                    </div>
                  </div>
                )}
                {open === 'contact' && (
                  <div className="space-y-4 text-blue-100/90">
                    <h3 className="text-white text-2xl font-bold">Let’s collaborate</h3>
                    <p className="text-blue-200/80">Open to freelance, contracts, and full-time roles.</p>
                    <div className="flex gap-3">
                      <a href="mailto:hello@portfolio.dev" className="px-5 py-2.5 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-400 transition-colors">Email me</a>
                      <a href="#" className="px-5 py-2.5 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">LinkedIn</a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-blue-200/70">
        © {new Date().getFullYear()} — PSP/XMB-inspired interactive menu. Use arrow keys and Enter.
      </div>
    </div>
  )
}
