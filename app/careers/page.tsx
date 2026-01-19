"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { ArrowRight, ChevronUp, Globe, ChevronDown, CheckCircle2, Star, Lightbulb, Target, Zap, Users } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"

export default function CareersPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")

  // FETCH JOBS FROM FIREBASE
  useEffect(() => {
    const q = query(collection(db, "careers"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const jobsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setJobs(jobsData.filter((job: any) => job.status === "Open"))
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsubscribe()
  }, [])

  // NAVBAR SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = ["All", ...Array.from(new Set(jobs.map((job) => job.category)))]

  const benefits = [
    { icon: <Zap className="text-emerald-700" />, title: "Fast-Growing and Innovative", desc: "Be at the forefront of the smart lighting revolution." },
    { icon: <Target className="text-emerald-700" />, title: "Learn and Grow", desc: "Mentorship and hands-on training to become an industry expert." },
    { icon: <Users className="text-emerald-700" />, title: "Collaborative Team Culture", desc: "Work in a dynamic, fun, and supportive environment." },
    { icon: <Lightbulb className="text-emerald-700" />, title: "Driven by Innovation", desc: "Contribute to projects that shape the future of lighting." },
    { icon: <Star className="text-emerald-700" />, title: "Competitive Compensation", desc: "We value top talent and offer excellent benefits." },
  ]

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-emerald-700/10 selection:text-emerald-700 overflow-x-hidden">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-700 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block italic">
            Career Opportunities
          </motion.span>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground leading-tight mb-6">
            Join Our <br className="hidden md:block" /> <span className="text-emerald-700">Team</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-12">Build the future of intelligent lighting solutions with passionate innovators and industry leaders.</p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* --- CATEGORY FILTER --- */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat ? "bg-emerald-700 text-white shadow-lg" : "bg-secondary text-muted-foreground hover:bg-border"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {loading ? (
              [1, 2, 3, 4].map((i) => <div key={i} className="h-64 w-full bg-secondary animate-pulse rounded-2xl" />)
            ) : (
              jobs
                .filter((job) => activeCategory === "All" || job.category === activeCategory)
                .map((job) => (
                  <motion.div
                    layout
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative rounded-2xl border transition-shadow duration-500 h-fit ${
                      expandedJob === job.id ? "bg-secondary border-emerald-700 shadow-2xl z-10" : "bg-card border-border hover:border-emerald-700/30 hover:shadow-lg z-0"
                    }`}
                  >
                    <div className="p-8 md:p-10 cursor-pointer flex flex-col gap-6" onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-foreground text-card text-[9px] font-black uppercase rounded-md tracking-widest">{job.category}</span>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest italic">{job.jobType}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedJob === job.id ? 180 : 0 }}
                          className={`w-10 h-10 flex items-center justify-center rounded-full ${expandedJob === job.id ? "bg-emerald-700 text-white" : "bg-secondary text-muted-foreground"}`}
                        >
                          <ChevronDown size={20} />
                        </motion.div>
                      </div>

                      <div>
                        <h3 className="font-serif text-xl md:text-2xl text-foreground leading-tight mb-2">
                          {job.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex items-center gap-1.5 font-medium">
                          <Globe size={14} className="text-emerald-700" /> {job.location}
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedJob === job.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-6 md:px-10 pb-10 pt-6 border-t border-border">
                            <h4 className="text-[10px] font-black uppercase text-emerald-700 tracking-[0.3em] mb-4">Qualifications</h4>
                            <ul className="space-y-3 mb-8">
                              {job.qualifications?.map((q: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm text-foreground font-medium leading-relaxed">
                                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" /> {q}
                                </li>
                              ))}
                            </ul>

                            <Link
                              href={{
                                pathname: "/careers/apply",
                                query: {
                                  jobId: job.id,
                                  jobTitle: job.title,
                                },
                              }}
                            >
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full md:w-auto bg-foreground text-card px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-3"
                              >
                                Apply for this position <ArrowRight size={16} />
                              </motion.button>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
            )}
          </motion.div>
        </div>
      </section>

      {/* --- WHY WORK WITH US SECTION --- */}
      <section className="py-20 md:py-32 bg-secondary px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-sm border border-border mb-4">
              <Star className="text-emerald-700 fill-emerald-700" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Why Work With Us</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
              Our Culture & <span className="text-emerald-700">Benefits</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {benefits.map((b, i) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={i}
                className="bg-card p-8 md:p-10 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center md:items-start md:text-left gap-4"
              >
                <div className="p-4 bg-emerald-700/10 rounded-2xl">{React.cloneElement(b.icon as React.ReactElement<any>, { size: 28 })}</div>
                <div>
                  <h3 className="text-base md:text-lg font-serif text-foreground mb-2 leading-tight">{b.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  )
}
