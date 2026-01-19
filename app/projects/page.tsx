"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import { motion } from "framer-motion"
import { ArrowRight, Lightbulb, Zap, Sun, Star, Lamp, Loader2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

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

const floatAnimation = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
}

interface Project {
  id: string
  title: string
  logo?: string
  mainImage: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 6

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"))
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[]
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = useMemo(
    () => projects.filter((p) => p.title?.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, projects]
  )

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  )

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="py-12 text-center">
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Completed Projects</h1>
          <p className="text-muted-foreground text-lg">
            Explore our portfolio of successful lighting installations across diverse industries.
          </p>
        </section>

        {/* Search */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full max-w-md border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Projects Grid */}
        <section className="pb-24 min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : displayedProjects.length > 0 ? (
            <motion.div
              className="grid md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {displayedProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <motion.div
                    className="relative bg-card border border-border rounded-2xl overflow-hidden group h-64 cursor-pointer"
                    variants={itemVariants}
                  >
                    <motion.img
                      src={project.mainImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.logo && (
                        <img
                          src={project.logo || "/placeholder.svg"}
                          alt={`${project.title} logo`}
                          className="w-16 h-16 mb-4 object-contain transform translate-y-6 group-hover:translate-y-0 transition-all duration-300"
                        />
                      )}
                      <h3 className="text-white font-semibold text-lg uppercase transform translate-y-6 group-hover:translate-y-0 transition-all duration-300">
                        {project.title}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No projects found matching your search.
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded hover:bg-emerald-500 hover:text-white disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-emerald-500 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded hover:bg-emerald-500 hover:text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative bg-card border border-border rounded-3xl p-12 md:p-16 overflow-hidden"
            >
              {/* Floating light icons */}
              <motion.div {...floatAnimation} className="absolute top-8 left-8 w-10 h-10 border border-border rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <motion.div {...floatAnimation} className="absolute top-8 right-8 w-10 h-10 border border-border rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <motion.div {...floatAnimation} className="absolute bottom-8 left-8 w-10 h-10 border border-border rounded-lg flex items-center justify-center">
                <Sun className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <motion.div {...floatAnimation} className="absolute bottom-8 right-8 w-10 h-10 border border-border rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <motion.div {...floatAnimation} className="absolute top-1/2 right-16 -translate-y-1/2 w-10 h-10 border border-border rounded-lg flex items-center justify-center">
                <Lamp className="w-4 h-4 text-emerald-400" />
              </motion.div>
              <motion.div {...floatAnimation} className="absolute bottom-1/3 left-16 w-10 h-10 border border-border rounded-lg flex items-center justify-center">
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
                  Ready to Light Up Your Next Project?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  className="text-muted-foreground mb-8"
                >
                  Get in touch with our experts to design and implement the perfect lighting solution for your space.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-emerald-800 transition-colors"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
      <BackToTop />
    </main>
  )
}
