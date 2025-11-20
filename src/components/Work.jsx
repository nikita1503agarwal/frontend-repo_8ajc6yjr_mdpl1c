import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Fintech Mobile App',
    tag: 'Case Study',
    desc: 'Designing a frictionless onboarding and money movement experience.',
  },
  {
    title: 'Gaming Companion',
    tag: 'UI System',
    desc: 'A modular, PSP-inspired card system for quests, stats, and socials.',
  },
  {
    title: 'SaaS Dashboard',
    tag: 'Design System',
    desc: 'Accessible components, motion guidelines, and theming tokens.',
  },
]

export default function Work() {
  return (
    <section id="work" className="relative py-16 sm:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Selected Work</h2>
          <p className="text-blue-200/80 mt-2">A few highlights that blend craft with clarity.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(59,130,246,0.15), transparent 40%)'
              }} />
              <div className="relative z-10">
                <span className="inline-block text-[11px] uppercase tracking-wider text-blue-200/80 bg-white/10 rounded-full px-2 py-1 mb-3">{p.tag}</span>
                <h3 className="text-white text-lg font-semibold">{p.title}</h3>
                <p className="text-blue-200/80 text-sm mt-2">{p.desc}</p>
                <button className="mt-4 text-sm text-blue-300 hover:text-white">Read case →</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
