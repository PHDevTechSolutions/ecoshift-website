"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, limit } from "firebase/firestore"
import { Loader2, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import { motion } from "framer-motion"

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const q = query(collection(db, "blogs"), where("slug", "==", slug), limit(1))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          setBlog({
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [slug])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={40} />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="h-screen flex items-center justify-center font-bold uppercase tracking-widest">
        Blog post not found
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24">
        {/* Navigation */}
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Blogs
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="max-w-5xl mx-auto px-6 py-16">
          {/* Header */}
          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">{blog.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{blog.category || "Lighting"}</span>
              <span>•</span>
              <span>{blog.createdAt?.toDate?.().toLocaleDateString() || new Date().toLocaleDateString()}</span>
            </div>
          </motion.header>

          {/* Content Sections */}
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {blog.sections?.map((section: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-4"
              >
                {section.title && <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>}

                {section.imageUrl && (
                  <div className="w-full bg-secondary/50 rounded-lg overflow-hidden">
                    <img
                      src={section.imageUrl || "/placeholder.svg"}
                      alt={section.title || "Blog section"}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {section.description && (
                  <div className="prose prose-emerald max-w-none text-muted-foreground leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: section.description.replace(/\n/g, "<br/>") }} />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </article>
      </div>
      <Footer />
      <BackToTop />
    </main>
  )
}
