"use client"

import { ArrowRight, Lightbulb, Zap, Sun, Star, Lamp } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function CTASection() {
  const floatAnimation = {
    animate: {
      y: [0, -6, 0], // float up and down
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative bg-card border border-border rounded-3xl p-12 md:p-16 overflow-hidden"
        >
          {/* Decorative corner icons with floating animation */}
          <motion.div
            {...floatAnimation}
            className="absolute top-8 left-8 w-10 h-10 border border-border rounded-lg flex items-center justify-center"
          >
            <Lightbulb className="w-4 h-4 text-emerald-400" />
          </motion.div>

          <motion.div
            {...floatAnimation}
            className="absolute top-8 right-8 w-10 h-10 border border-border rounded-lg flex items-center justify-center"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
          </motion.div>

          <motion.div
            {...floatAnimation}
            className="absolute bottom-8 left-8 w-10 h-10 border border-border rounded-lg flex items-center justify-center"
          >
            <Sun className="w-4 h-4 text-emerald-400" />
          </motion.div>

          <motion.div
            {...floatAnimation}
            className="absolute bottom-8 right-8 w-10 h-10 border border-border rounded-lg flex items-center justify-center"
          >
            <Star className="w-4 h-4 text-emerald-400" />
          </motion.div>

          <motion.div
            {...floatAnimation}
            className="absolute top-1/2 right-16 -translate-y-1/2 w-10 h-10 border border-border rounded-lg flex items-center justify-center"
          >
            <Lamp className="w-4 h-4 text-emerald-400" />
          </motion.div>

          <motion.div
            {...floatAnimation}
            className="absolute bottom-1/3 left-16 w-10 h-10 border border-border rounded-lg flex items-center justify-center"
          >
            <span className="text-emerald-400 text-lg">+</span>
          </motion.div>

          {/* Main content */}
          <div className="text-center max-w-2xl mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-serif text-4xl md:text-5xl mb-4 leading-tight"
            >
              Illuminate your space
              <br />
              perfectly.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-muted-foreground mb-8"
            >
              Join thousands of satisfied customers enjoying energy-efficient, professionally designed lighting
              solutions.
            </motion.p>

            <Link href="/quote">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-emerald-800 transition-colors"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
