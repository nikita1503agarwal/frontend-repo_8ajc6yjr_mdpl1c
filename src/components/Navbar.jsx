import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, User, Briefcase, Mail } from 'lucide-react'

const tabs = [
  { key: 'home', label: 'Home', icon: Home, href: '#home' },
  { key: 'about', label: 'About', icon: User, href: '#about' },
  { key: 'work', label: 'Work', icon: Briefcase, href: '#work' },
  { key: 'contact', label: 'Contact', icon: Mail, href: '#contact' },
]

export default function Navbar() {
  const [active, setActive] = useState('home')

  const handleClick = (key, href) => {
    setActive(key)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
      <div className="relative rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2 px-3 py-2">
          {tabs.map(({ key, label, icon: Icon, href }) => (
            <button
              key={key}
              onClick={() => handleClick(key, href)}
              className="relative group px-3 py-2 rounded-full text-blue-200/80 hover:text-white focus:outline-none"
            >
              {active === key && (
                <motion.span
                  layoutId="psp-pill"
                  className="absolute inset-0 rounded-full bg-white/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline-block">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
