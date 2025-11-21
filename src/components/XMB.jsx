import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { Home, Briefcase, User, Mail, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Play, Gamepad2, Sun, Moon } from 'lucide-react'

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

function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
  }, [key, val])
  return [val, setVal]
}

function useSounds() {
  const ctxRef = useRef(null)
  const ensureCtx = () => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      ctxRef.current = new Ctx()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }
  const blip = (freq = 900, dur = 0.06, gain = 0.05) => {
    const ctx = ensureCtx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'triangle'
    o.frequency.value = freq
    g.gain.value = gain
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + dur)
  }
  const click = () => blip(700, 0.05, 0.04)
  const confirm = () => blip(440, 0.12, 0.07)
  const back = () => blip(300, 0.08, 0.05)
  return { click, confirm, back }
}

export default function XMB() {
  const [col, setCol] = useLocalStorage('xmb-col', 0)
  const [row, setRow] = useLocalStorage('xmb-row', 0)
  const [open, setOpen] = useLocalStorage('xmb-open', null) // 'work' | 'about' | 'contact' | null
  const [theme, setTheme] = useLocalStorage('xmb-theme', 'psp-blue') // 'psp-blue' | 'light'

  const { click, confirm, back } = useSounds()

  const containerRef = useRef(null)
  const timeRef = useRef(0)
  const [drift, setDrift] = useState({ x: 0, y: 0, s: 1 })

  const current = categories[col]
  const items = current.items
  const clampedRow = Math.min(row, items.length - 1)

  useEffect(() => { setRow(0) }, [col])

  useEffect(() => {
    const onKey = (e) => {
      if (open) {
        if (e.key === 'Escape') { setOpen(null); back() }
        return
      }
      if (e.key === 'ArrowRight') { setCol((c) => (c + 1) % categories.length); click() }
      else if (e.key === 'ArrowLeft') { setCol((c) => (c - 1 + categories.length) % categories.length); click() }
      else if (e.key === 'ArrowDown') { setRow((r) => Math.min(r + 1, items.length - 1)); click() }
      else if (e.key === 'ArrowUp') { setRow((r) => Math.max(r - 1, 0)); click() }
      else if (e.key === 'Enter' || e.key === ' ') {
        const action = items[clampedRow]?.action || current.key
        if (action === 'start') { setOpen('work'); confirm() }
        else { setOpen(action); confirm() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, items, clampedRow, current, click, confirm, back, setOpen, setCol, setRow])

  // Gamepad support
  useEffect(() => {
    let raf
    let last = { lx: 0, ly: 0, dpad: { l: false, r: false, u: false, d: false }, a: false, b: false }
    const threshold = 0.4
    const tick = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : []
      const gp = pads && pads[0]
      if (gp) {
        const lx = gp.axes[0] || 0
        const ly = gp.axes[1] || 0
        const dpadL = gp.buttons[14]?.pressed
        const dpadR = gp.buttons[15]?.pressed
        const dpadU = gp.buttons[12]?.pressed
        const dpadD = gp.buttons[13]?.pressed
        const a = gp.buttons[0]?.pressed // Cross
        const b = gp.buttons[1]?.pressed // Circle

        const horiz = Math.abs(lx) > threshold ? Math.sign(lx) : 0
        const vert = Math.abs(ly) > threshold ? Math.sign(ly) : 0

        const pressOnce = (prev, now, fn) => { if (!prev && now) fn() }

        // Horizontal
        pressOnce(last.lx > 0 || last.dpad.r, horiz > 0 || dpadR, () => { if (!open) { setCol((c) => (c + 1) % categories.length); click() } })
        pressOnce(last.lx < 0 || last.dpad.l, horiz < 0 || dpadL, () => { if (!open) { setCol((c) => (c - 1 + categories.length) % categories.length); click() } })
        // Vertical
        pressOnce(last.ly < 0 || last.dpad.u, vert < 0 || dpadU, () => { if (!open) { setRow((r) => Math.max(r - 1, 0)); click() } })
        pressOnce(last.ly > 0 || last.dpad.d, vert > 0 || dpadD, () => { if (!open) { setRow((r) => Math.min(r + 1, items.length - 1)); click() } })
        // A/B
        pressOnce(last.a, a, () => {
          if (open) return
          const action = items[clampedRow]?.action || current.key
          if (action === 'start') { setOpen('work'); confirm() } else { setOpen(action); confirm() }
        })
        pressOnce(last.b, b, () => { if (open) { setOpen(null); back() } })

        last = { lx, ly, dpad: { l: dpadL, r: dpadR, u: dpadU, d: dpadD }, a, b }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [open, items, clampedRow, current, setCol, setRow, setOpen, click, confirm, back])

  // Analog drift (idle sway + bloom intensity)
  useAnimationFrame((t) => {
    timeRef.current = t / 1000
    const x = Math.sin(timeRef.current * 0.6) * 10
    const y = Math.cos(timeRef.current * 0.4) * 6
    const s = 1 + Math.sin(timeRef.current * 0.7) * 0.006
    setDrift({ x, y, s })
  })

  const bgParallax = useMemo(() => ({
    x: (col - 1.5) * 20 + drift.x,
    y: (clampedRow - 1) * -10 + drift.y,
    scale: 1.02 + col * 0.01 * drift.s,
  }), [col, clampedRow, drift])

  const themeClasses = theme === 'psp-blue'
    ? {
        text: 'text-blue-200/80',
        label: 'text-blue-100/80',
        chip: 'bg-white/10 border-white/10',
        glass: 'from-white/10 to-white/[0.04]',
        accent: 'bg-blue-400',
        bloom: 'from-blue-500/20 to-transparent',
        bgGrad: 'from-slate-900/30 via-slate-900/10 to-slate-900/60',
      }
    : {
        text: 'text-slate-700',
        label: 'text-slate-600',
        chip: 'bg-white/60 border-black/10',
        glass: 'from-white/80 to-white/60',
        accent: 'bg-blue-600',
        bloom: 'from-blue-400/20 to-transparent',
        bgGrad: 'from-white/60 via-white/40 to-white/70',
      }

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--x', `${x}%`)
    e.currentTarget.style.setProperty('--y', `${y}%`)
  }

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

      {/* Dynamic bloom overlay based on drift */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{ opacity: 0.25 + Math.abs(Math.sin(timeRef.current * 0.8)) * 0.2 }}
        style={{ background: 'radial-gradient(800px circle at 50% 60%, rgba(59,130,246,0.22), transparent 60%)' }}
      />

      {/* Ambient overlays */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${themeClasses.bgGrad}`} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '100% 3px'
      }} />

      {/* Top hint bar and theme toggle */}
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

      <button
        onClick={() => setTheme(theme === 'psp-blue' ? 'light' : 'psp-blue')}
        className="absolute top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
        aria-label="Toggle theme"
      >
        {theme === 'psp-blue' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        {theme === 'psp-blue' ? 'PSP Blue' : 'Light'}
      </button>

      {/* Depth zoom on panel open (S-curve) */}
      <motion.div
        className="absolute inset-0"
        animate={open ? { scale: 0.96, filter: 'blur(2px) saturate(0.9)' } : { scale: 1, filter: 'none' }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* XMB ribbon */}
        <div className="absolute left-0 right-0 top-1/3 sm:top-[38%]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-center gap-3 sm:gap-4">
              {categories.map((c, i) => (
                <button
                  key={c.key}
                  onClick={() => { setCol(i); click() }}
                  className="relative group"
                  aria-current={i === col}
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
                    <span className={`mt-2 text-xs ${themeClasses.label}`}>{c.label}</span>
                  </motion.div>
                  {i === col && (
                    <motion.div layoutId="xmb-underline" className={`h-0.5 ${themeClasses.accent} rounded-full mt-2`} />
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
                  onMouseMove={handleCardMouseMove}
                  onClick={() => { setRow(i); click() }}
                  onDoubleClick={() => { setOpen(it.action); confirm() }}
                  animate={{
                    y: i === clampedRow ? 0 : 10,
                    scale: i === clampedRow ? 1 + Math.sin(timeRef.current * 2) * 0.01 : 0.92,
                    rotate: i === clampedRow ? Math.sin(timeRef.current * 1.6) * 0.3 : 0,
                    opacity: i === clampedRow ? 1 : 0.6,
                  }}
                  transition={{ type: 'spring', stiffness: 250, damping: 26 }}
                  className={`group relative w-[220px] sm:w-[260px] rounded-3xl border ${themeClasses.chip} bg-gradient-to-br ${themeClasses.glass} p-4 text-left backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                    background: 'radial-gradient(200px circle at var(--x, 50%) var(--y, 50%), rgba(59,130,246,0.18), transparent 40%)'
                  }} />
                  <div className="relative z-10">
                    <div className={`flex items-center justify-between text-[11px] uppercase tracking-wider ${themeClasses.text}`}>
                      <span>{current.label}</span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5">{i + 1}/{items.length}</span>
                    </div>
                    <div className="mt-2 text-white text-lg font-semibold">{it.title}</div>
                    <div className={`${themeClasses.text} text-sm`}>{it.subtitle}</div>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/90">
                      <Play className="w-3.5 h-3.5" /> {it.cta}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

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
              initial={{ y: 50, scale: 0.94, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute left-1/2 top-1/2 w-[92vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/60 p-6 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-blue-200/80 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 opacity-60" /> {open}
                </div>
                <button onClick={() => { setOpen(null); back() }} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/20">Close (Esc)</button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                {open === 'work' && (
                  <div className="space-y-4 text-blue-100/90">
                    <h3 className="text-white text-2xl font-bold">Selected Work</h3>
                    <p className="text-sm text-blue-200/80">A few highlights that blend craft with clarity.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {categories[1].items.map((p, idx) => (
                        <motion.div
                          key={p.key}
                          whileHover={{ rotateY: 5 }}
                          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          {/* Disc */}
                          <motion.div
                            initial={false}
                            animate={{ rotate: Math.sin((timeRef.current + idx) * 0.6) * 2 }}
                            className="absolute -right-8 -top-8 h-28 w-28 rounded-full"
                            style={{
                              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(180,200,255,0.35) 40%, rgba(120,140,220,0.25) 60%, transparent 70%)',
                              boxShadow: '0 0 25px rgba(59,130,246,0.35)'
                            }}
                          />
                          <div className="relative">
                            <div className="text-white font-semibold">{p.title}</div>
                            <div className="text-blue-200/80 text-sm">{p.subtitle}</div>
                            <motion.button
                              whileTap={{ scale: 0.98, rotate: -0.5 }}
                              className="mt-3 text-blue-300 hover:text-white text-sm"
                            >
                              Read case →
                            </motion.button>
                          </div>
                        </motion.div>
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
        © {new Date().getFullYear()} — PSP/XMB-inspired interactive menu. Use arrow keys, Enter, or a gamepad.
      </div>
    </div>
  )
}
