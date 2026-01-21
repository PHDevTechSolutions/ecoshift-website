"use client";

import type React from "react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  Upload,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

// --- FIREBASE ---
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuotePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    company: "",
    contactNumber: "",
    email: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setStatus("idle");

  try {
    let finalFileUrl = "";
    if (file) {
      // Upload file to Cloudinary
      const formDataCloud = new FormData();
      const uploadPreset = "taskflow_preset";
      const cloudName = "dvmpn8mjh";

      formDataCloud.append("file", file);
      formDataCloud.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formDataCloud }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Cloudinary Upload Failed");
      }

      const data = await response.json();
      finalFileUrl = data.secure_url;
    }

    // Add document to Firestore with source identifier
    await addDoc(collection(db, "inquiries"), {
      ...formData,
      attachmentUrl: finalFileUrl,
      status: "unread",        // for sidebar badge
      type: "quotation",       // quotation category
      processStatus: "pending",
      website: "Ecoshift Corporation",  // <-- identifier added
      createdAt: serverTimestamp(),
    });

    setStatus("success");
    setFormData({
      firstName: "",
      lastName: "",
      streetAddress: "",
      company: "",
      contactNumber: "",
      email: "",
      message: "",
    });
    setFile(null);
  } catch (error) {
    console.error("Submission Error:", error);
    setStatus("error");
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-52 pb-40 bg-secondary/30 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-8"
          >
            Get Your <br />
            <span className="text-emerald-700 italic">Free Quote</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Request a free lighting consultation and quote tailored to your project. Our experts will review your requirements and provide a customized solution.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative z-20 -mt-24 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Info & Contact Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-card p-10 rounded-3xl shadow-xl border border-border">
                <h3 className="text-2xl font-black uppercase mb-8">
                  Quick <span className="text-emerald-700">Contacts</span>
                </h3>
                <div className="space-y-6 mb-10">
                  <div className="flex gap-4 group cursor-pointer">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Us</p>
                      <p className="font-bold text-foreground">info@lightingco.com</p>
                    </div>
                  </div>
                  <div className="flex gap-4 group cursor-pointer">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Call Us</p>
                      <p className="font-bold text-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex gap-4 group cursor-pointer">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Headquarters</p>
                      <p className="font-bold text-foreground leading-tight">
                        123 Lighting Avenue, <br /> Tech City, CA 90210
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-8 bg-card p-8 md:p-16 rounded-3xl shadow-xl border border-border">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
                {status === "success" ? (
                  <div className="p-10 text-center space-y-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={40} />
                    </motion.div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Request Sent!</h2>
                    <p className="text-gray-500 font-medium">Thank you. Our team will contact you shortly.</p>
                    <button onClick={() => setStatus("idle")} className="text-emerald-700 text-[10px] font-black uppercase tracking-widest pt-4 hover:underline">Send Another Quote</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Names */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">First Name *</label>
                        <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="John" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Last Name *</label>
                        <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="Doe" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all font-bold" />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Street Address *</label>
                      <input type="text" name="streetAddress" required value={formData.streetAddress} onChange={handleChange} placeholder="123 Tech Avenue, Business District" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all font-bold" />
                    </div>

                    {/* Company & Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Company</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Contact Number *</label>
                        <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} placeholder="0912 345 6789" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all font-bold" />
                      </div>
                    </div>

                    {/* Email & Message */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@email.com" className="w-full bg-secondary/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Message</label>
                      <textarea name="message" maxLength={180} value={formData.message} onChange={handleChange} placeholder="Briefly describe your requirements..." className="w-full h-32 bg-secondary/50 border border-border rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-emerald-700/20 transition-all font-bold resize-none" />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Project Plans / Brief (Upload File)</label>
                      <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-4xl p-10 flex flex-col items-center cursor-pointer transition-all ${file ? "border-emerald-700 bg-emerald-50" : "border-gray-200 hover:border-emerald-700 hover:bg-emerald-50"}`}>
                        <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                          {loading ? <Loader2 className="animate-spin text-emerald-700" /> : <Upload className={file ? "text-emerald-700" : "text-gray-400"} />}
                        </div>
                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{file ? file.name : "Click to browse project files"}</p>
                        <p className="text-xs text-gray-400 mt-2">Max: 10MB (PDF, PNG, JPG)</p>
                      </div>
                    </div>

                    <motion.button disabled={loading} type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-lg flex items-center justify-center gap-4 bg-emerald-700 text-white transition-all disabled:opacity-50">
                      {loading ? <>Processing <Loader2 className="animate-spin" size={18} /></> : <>Send Quote Request <ArrowRight size={18} /></>}
                    </motion.button>

                    {status === "error" && <p className="text-red-500 text-[10px] font-black uppercase text-center mt-2">Error. Please try again.</p>}
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
