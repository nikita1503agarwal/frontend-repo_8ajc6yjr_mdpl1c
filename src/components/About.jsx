import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="relative py-16 sm:py-24">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white">About</h2>
          <p className="text-blue-200/80 mt-3 leading-relaxed">
            I craft interfaces that feel inevitable — clear information hierarchy, thoughtful motion, and delightful detail. My background spans consumer apps, tools for creators, and complex B2B platforms. I love prototyping interactions and shipping systems that scale.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[ 'Design Systems', 'Interaction Design', 'Prototyping', 'User Research' ].map((s) => (
              <div key={s} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-200/90">{s}</div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6"
        >
          <h3 className="text-white font-semibold">Approach</h3>
          <p className="text-blue-200/80 text-sm mt-2">
            PSP-era visual language informs my motion and layout: pill navigation, glass surfaces, and smooth spring transitions. I combine that nostalgia with modern accessibility and performance.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-blue-200/80">
            <li>• Motion that aids comprehension</li>
            <li>• Systems thinking over one-off screens</li>
            <li>• Prototyping early, testing often</li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
