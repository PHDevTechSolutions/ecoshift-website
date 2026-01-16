"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, limit , where} from "firebase/firestore"
import Link from "next/link"
import { Loader2 } from "lucide-react"

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"), where("website", "==", "Ecoshift Corporation"), limit(6))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBlogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        slug: doc.data().slug || doc.id,
        ...doc.data(),
      }))
      setBlogs(fetchedBlogs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={40} />
      </div>
    )
  }

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
              <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ INSIGHTS</span>
              <h1 className="font-serif text-5xl md:text-6xl mt-4 mb-6 leading-tight">Lighting knowledge hub</h1>
              <p className="text-muted-foreground text-lg">
                Expert insights, industry trends, and project case studies from our lighting specialists.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blogs Grid */}
      {/* Blogs Grid */}
<section className="py-24">
  <div className="max-w-7xl mx-auto px-6">
    {blogs.length === 0 ? (
      <div className="text-center py-32">
        <p className="text-xl text-muted-foreground mb-4">
          No blogs available at the moment.
        </p>
        <p className="text-sm text-muted-foreground">
          Check back later for insights and updates from our lighting specialists.
        </p>
      </div>
    ) : (
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {blogs.map((blog) => (
          <Link href={`/blogs/${blog.slug}`} key={blog.id}>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
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
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-emerald-700">{blog.category || "BLOG"}</span>
                  <span className="text-xs text-muted-foreground">
                    {blog.createdAt?.toDate?.().toLocaleDateString() || new Date().toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mt-3 mb-2 leading-snug">{blog.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {(
                    blog.sections?.[0]?.description ||
                    blog.excerpt ||
                    "Read more about this topic."
                  ).slice(0, 100) + ((blog.sections?.[0]?.description?.length || blog.excerpt?.length) > 100 ? "…" : "")}
                </p>
                <motion.span
                  className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  Read More
                  <span className="ml-1">→</span>
                </motion.span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    )}
  </div>
</section>

      </div>
      <Footer />
      <BackToTop />
    </main>
  )
}
