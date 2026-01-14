"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = ["/images/clark-taxiway.jpg", "/images/hino-motors.jpg", "/images/imall-antipolo.jpg"]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden pt-32">
      {/* Main hero area */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1"
            >
              <span>Innovative Lighting Solutions</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-balance"
            >
              Ecoshift
              <br />
              Corporation
            </motion.h1>

            <motion.p variants={itemVariants} className="text-muted-foreground text-lg max-w-md">
              Together, let's choose the brighter choice for every Filipino, one community at a time.
            </motion.p>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-emerald-800 transition-colors">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>

          {/* Right visual with image slideshow */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Interface mockup container */}
            <div className="relative bg-secondary/50 rounded-3xl p-8 border border-border/50 overflow-hidden">
              {/* Top labels */}
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-4 relative z-10">
                <span>NO.01 — DATA:LIGHTING_SHOWCASE</span>
                <span>PRODUCT_DISPLAY ACTIVE</span>
              </div>

              {/* Image slideshow */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6">
                {slides.map((slide, idx) => (
                  <motion.img
                    key={idx}
                    src={slide}
                    alt={`Lighting product ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentSlide === idx ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
