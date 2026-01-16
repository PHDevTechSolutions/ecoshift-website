"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { collection, query, orderBy, getDocs, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"), where("website", "==", "Ecoshift Corporation"))
        const querySnapshot = await getDocs(q)
        const fetchedBlogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        // Only keep top 3 blogs
        setBlogs(fetchedBlogs.slice(0, 3))
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <span className="text-accent animate-spin">Loading...</span>
      </div>
    )
  }

  // Hide section if no blogs
  if (blogs.length === 0) return null

  return (
    <section id="blogs" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex items-start justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ INSIGHTS & STORIES</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 max-w-md leading-tight">Lighting knowledge hub</h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
            Expert insights, industry trends, and project case studies.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <div className="w-full h-48 bg-secondary/50 overflow-hidden">
                <motion.img
                  src={blog.coverImage || "/placeholder.svg"}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-mono text-emerald-700">{blog.id}</span>
                <h3 className="font-semibold text-lg mt-3 mb-2 leading-snug">{blog.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {(blog.excerpt || blog.sections?.[0]?.description || "").slice(0, 120) +
                    ((blog.excerpt?.length || blog.sections?.[0]?.description?.length) > 120 ? "…" : "")}
                </p>
                <motion.a
                  href={`/blogs/${blog.slug || blog.id}`}
                  className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  Read More
                  <span className="ml-1">→</span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
