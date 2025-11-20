import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" className="relative py-16 sm:py-24">
      <div className="container mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center gap-6 justify-between"
          >
            <div>
              <h3 className="text-white text-2xl font-bold">Let’s collaborate</h3>
              <p className="text-blue-200/80 mt-2">Open to freelance, contracts, and full-time roles.</p>
            </div>
            <div className="flex gap-3">
              <a href="mailto:hello@portfolio.dev" className="px-5 py-2.5 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-400 transition-colors">Email me</a>
              <a href="#" className="px-5 py-2.5 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">LinkedIn</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
