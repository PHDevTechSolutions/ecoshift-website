"use client"

import { motion } from "framer-motion"

export default function WorkflowSection() {
  const steps = [
    {
      number: "01",
      title: "Industry Experts Since 2011",
      description: "Over a decade of experience Trusted by industries nationwide",
      image: "/lighting-consultation.jpg",
    },
    {
      number: "02",
      title: "Commitment to Product Development",
      description: "Future-ready lighting solutions\nSmarter choices for every project",
      image: "/lighting-design.jpg",
    },
    {
      number: "03",
      title: "Excellent After-Sales Service",
      description: "After-Sales Service Center\nCustomer Care Call Center",
      image: "/lighting-products.jpg",
    },
    {
      number: "04",
      title: "Nationwide Presence",
      description: "5 branches across the country\nAccessible service nationwide",
      image: "/lighting-installation.jpg",
    },
  ]

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

  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex items-start justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ WORKFLOW_AUTOMATION</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 max-w-md leading-tight">
              From concept to illumination.
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
            Professional lighting solutions, delivered flawlessly.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div key={step.number} variants={itemVariants} whileHover={{ y: -5 }} className="relative">
              <div className="bg-card border border-border rounded-2xl p-6 h-full">
                <div className="aspect-square bg-secondary/50 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <motion.img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
                </div>
                <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-border" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
