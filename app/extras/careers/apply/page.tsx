"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore"
import { ArrowLeft, Send, User, Mail, CheckCircle2, UploadCloud, Phone, MapPin, Clock, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Loading from "./loading"

function ApplyFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const jobId = searchParams.get("jobId")

  const [jobData, setJobData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loadingJob, setLoadingJob] = useState(true)

  // --- FETCH JOB DETAILS ---
  useEffect(() => {
    async function fetchJob() {
      if (!jobId) return
      try {
        const docRef = doc(db, "careers", jobId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setJobData(docSnap.data())
        }
      } catch (error) {
        console.error("Error fetching job details:", error)
      } finally {
        setLoadingJob(false)
      }
    }
    fetchJob()
  }, [jobId])

  // --- FILE CHANGE ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
      setFile(e.target.files[0])
    }
  }

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return alert("Please upload your resume.")

    setIsSubmitting(true)
    const form = e.currentTarget
    const formData = new FormData(form)

    // Generate reference ID
    const referenceId = `APP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    try {
      // Prepare application data
      const applicationData = {
        referenceId: referenceId,
        jobId: jobId,
        jobTitle: jobData?.title || searchParams.get("jobTitle") || "Unknown Position",
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        fileName: fileName,
        type: "job",
        status: "unread",
        internalStatus: "pending",
        source: "ecoshiftcorp",
        appliedAt: serverTimestamp(),
      }

      // Save to Firebase
      await addDoc(collection(db, "inquiries"), applicationData)

      alert("Application submitted successfully!")
      router.push("/careers")
    } catch (error: any) {
      console.error("Submission Error:", error)
      alert(error.message || "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-emerald-700/10">
      <Header />

      <nav className="max-w-7xl mx-auto p-6 md:p-10 mt-16">
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-emerald-700 transition-all group"
        >
          <div className="p-2 rounded-full bg-secondary shadow-sm group-hover:bg-emerald-700/10 transition-all">
            <ArrowLeft size={14} />
          </div>
          Back to Job Openings
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT SIDE: JOB DESCRIPTION & SUMMARY */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-emerald-700 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block italic">
                {loadingJob ? "Loading Position..." : `Applying for ${jobData?.category || "Position"}`}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight mb-6">
                {jobData?.title || searchParams.get("jobTitle")}
              </h1>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-4 py-2 rounded-full border border-border">
                  <MapPin size={12} className="text-emerald-700" /> {jobData?.location || "Remote / Office"}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-4 py-2 rounded-full border border-border">
                  <Clock size={12} className="text-emerald-700" /> {jobData?.jobType || "Full-time"}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card p-8 md:p-10 rounded-2xl border border-border shadow-sm space-y-8">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 mb-4">Job Overview</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">{jobData?.description || "Join our team and help us build the future of smart lighting solutions."}</p>
              </div>

              {jobData?.qualifications && jobData.qualifications.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 mb-4">Key Qualifications</h3>
                  <ul className="space-y-3">
                    {jobData.qualifications.map((q: string, i: number) => (
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="flex items-start gap-3 text-[13px] font-medium text-foreground"
                      >
                        <CheckCircle2 size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                        <span>{q}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Reference ID: {jobId?.substring(0, 8).toUpperCase()}</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: THE FORM */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-7 bg-card p-8 md:p-14 rounded-2xl shadow-lg shadow-emerald-700/5 border border-border">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="pb-4 border-b border-border">
                <h2 className="font-serif text-2xl text-foreground mb-1">Tell us about yourself</h2>
                <p className="text-sm text-muted-foreground font-medium">Complete the form below to submit your application.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      required
                      name="fullName"
                      type="text"
                      placeholder="John Smith"
                      className="w-full pl-14 pr-6 py-4 bg-secondary border-2 border-transparent rounded-xl focus:bg-card focus:border-emerald-700 transition-all outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="john@email.com"
                      className="w-full pl-14 pr-6 py-4 bg-secondary border-2 border-transparent rounded-xl focus:bg-card focus:border-emerald-700 transition-all outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-14 pr-6 py-4 bg-secondary border-2 border-transparent rounded-xl focus:bg-card focus:border-emerald-700 transition-all outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Resume / CV (PDF Only)</label>
                <div className="relative">
                  <input type="file" id="resume" accept=".pdf" className="hidden" onChange={handleFileChange} required />
                  <label htmlFor="resume" className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-border rounded-2xl bg-secondary hover:bg-emerald-700/5 hover:border-emerald-700 transition-all cursor-pointer group text-center">
                    <div className="w-14 h-14 bg-card rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      {isSubmitting ? (
                        <Loader2 className="animate-spin text-emerald-700" size={28} />
                      ) : fileName ? (
                        <CheckCircle2 className="text-emerald-700" size={28} />
                      ) : (
                        <UploadCloud className="text-emerald-700" size={28} />
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{fileName ? fileName : "Click to upload your resume"}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mt-1">PDF only • Max 5MB</p>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-foreground text-card py-4 rounded-xl font-black uppercase text-[12px] tracking-[0.3em] shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Submit Application"} <Send size={18} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ApplyFormContent />
    </Suspense>
  )
}
