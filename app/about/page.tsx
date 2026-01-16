"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import { motion } from "framer-motion"

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

export default function AboutPage() {
  const topValues = [
    {
      title: "Dialux Services",
      label: "COMPANY_IDENTITY",
      description:
        "Our Dialux simulation helps us create and identify lighting designs and specifications, allowing you to see precisely your desired lighting scheme!",
      image: "/about-who-we-are.jpg",
    },
    {
      title: "Project Management",
      label: "MISSION_STATEMENT",
      description:
        "Ecoshift Corporation's Electrical Engineers conduct site visits before and after project implementation to provide accurate recommendations for the project and proper execution/installation of products.",
      image: "/about-mission.jpg",
    },
    {
      title: "Installation & Support",
      label: "TECHNICAL_EXCELLENCE",
      description:
        "Ecoshift Corporation has a team of in-house technical professionals for installation services.",
      image: "/about-expertise.jpg",
    },
  ]

  const bottomValues = [
    {
      title: "Why Choose Us",
      description:
        "Precision, reliability, and future-ready lighting systems. We stand behind every installation with comprehensive support and warranty.",
      image: "/about-why-choose.jpg",
    },
    {
      title: "Our Commitment",
      description:
        "Dedicated to customer satisfaction through transparent communication, timely delivery, and ongoing technical support for all projects.",
      image: "/about-commitment.jpg",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32">
        {/* Hero */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ ABOUT_US</span>
              <h1 className="font-serif text-5xl md:text-6xl mt-4 mb-6 leading-tight">
                Lighting innovation meets expertise
              </h1>
              <p className="text-muted-foreground text-lg">
                We're committed to transforming spaces through smart, sustainable, and beautiful lighting solutions.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pt-1 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="grid md:grid-cols-3 gap-6 mb-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {topValues.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-xs font-mono text-muted-foreground">FIELD</span>
                    <span className="text-xs font-mono text-muted-foreground">{value.label}</span>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4 mb-6 overflow-hidden">
                    <motion.img
                      src={value.image}
                      alt={value.title}
                      className="w-full h-40 object-cover rounded"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {bottomValues.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex gap-6">
                    {index === 0 ? (
                      <>
                        <div className="bg-secondary/50 rounded-xl p-4 flex-shrink-0 overflow-hidden">
                          <motion.img
                            src={value.image}
                            alt={value.title}
                            className="w-20 h-20 object-cover rounded"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-2xl mb-2">{value.title}</h3>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <h3 className="font-semibold text-2xl mb-2">{value.title}</h3>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
                        </div>
                        <div className="bg-secondary/50 rounded-xl p-4 flex-shrink-0 overflow-hidden">
                          <motion.img
                            src={value.image}
                            alt={value.title}
                            className="w-20 h-20 object-cover rounded"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
      <BackToTop />
    </main>
  )
}
