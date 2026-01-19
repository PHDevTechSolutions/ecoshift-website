"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Loader2, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import { motion } from "framer-motion"

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"))
        const projectDoc = querySnapshot.docs.find((doc) => doc.id === id)
        if (projectDoc) {
          setProject({
            id: projectDoc.id,
            ...projectDoc.data(),
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={40} />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center font-bold uppercase tracking-widest">
        Project not found
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
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Projects
            </Link>
          </div>
        </div>

        {/* Project Content */}
        <article className="max-w-5xl mx-auto px-6 py-16">
          {/* Header with Logo and Title */}
          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex items-center gap-6 mb-6">
              {project.logo && (
                <img src={project.logo || "/placeholder.svg"} alt={`${project.title} logo`} className="w-16 h-16 object-contain" />
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{project.title}</h1>
            </div>
          </motion.header>

          {/* Main Image */}
          {project.mainImage && (
            <motion.div
              className="mb-12 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={project.mainImage || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-auto object-cover rounded-lg"
              />
            </motion.div>
          )}

          {/* Details */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {project.details && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="prose prose-emerald max-w-none"
              >
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  {Array.isArray(project.details) ? (
                    project.details.map((detail: string, index: number) => (
                      <p key={index}>{detail}</p>
                    ))
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: project.details.replace(/\n/g, "<br/>") }} />
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </article>
      </div>
      <Footer />
      <BackToTop />
    </main>
  )
}
