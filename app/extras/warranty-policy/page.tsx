"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Wrench, RefreshCw, AlertCircle, FileText, MapPin } from "lucide-react";

const warrantyDetails = [
  {
    title: "Coverage and Application",
    icon: <ShieldCheck size={20} className="text-emerald-700" />,
    content: "This Warranty applies only to Optilux/Elune Series products manufactured by or on behalf of Ecoshift and bearing an official Ecoshift trademark or product label. Products are warranted to be of acceptable quality and free from latent defects."
  },
  {
    title: "Warranty Period",
    icon: <Calendar size={20} className="text-emerald-700" />,
    content: "The Warranty is valid for one (1) year from the date of purchase as reflected on the official Ecoshift Invoice or Receipt."
  },
  {
    title: "Valid Claims",
    icon: <Wrench size={20} className="text-emerald-700" />,
    content: "Covered defects include: Burnt out LED chips causing significant loss of light output, malfunctioning or unresponsive LED drivers, and loose wiring or detached soldering pins."
  },
  {
    title: "Claim Process",
    icon: <RefreshCw size={20} className="text-emerald-700" />,
    content: "If the claim is valid, Ecoshift will repair the product, replace it with the same or equivalent model, or issue a refund. Repairs may involve the use of genuine or equivalent refurbished parts. Claims without proof of purchase will not be honored."
  },
  {
    title: "Exclusions",
    icon: <AlertCircle size={20} className="text-emerald-700" />,
    content: "Does not cover: Promo/Sale items, damage from accidents/natural disasters, incorrect installation, unauthorized repairs, or cosmetic issues that do not affect performance."
  }
];

export default function WarrantyPolicy() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs font-mono text-emerald-700 tracking-[0.3em] uppercase mb-4 block">
              ◆ Quality Assurance
            </span>
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Warranty Policy</h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-mono uppercase tracking-wider">
              <MapPin size={14} /> Ecoshift Corporation, Mandaluyong
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Disclaimer Card */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-50 border border-amber-200 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center md:items-start"
          >
            <AlertCircle className="text-amber-600 flex-shrink-0" size={32} />
            <div>
              <h3 className="text-amber-900 font-bold mb-2 uppercase text-sm tracking-widest">Important Note</h3>
              <p className="text-amber-800 leading-relaxed text-sm m-0">
                Products purchased under <strong>promotions, discounts, or special sale events</strong> are not eligible for Warranty coverage. This Warranty applies exclusively to Optilux/Elune Series Products purchased at regular price.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12">
            {warrantyDetails.map((detail, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-300">
                    {detail.icon}
                  </div>
                  <h2 className="text-xl font-bold m-0 uppercase tracking-tight">{detail.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg pl-2 border-l-2 border-transparent group-hover:border-emerald-700 transition-colors">
                  {detail.content}
                </p>
              </motion.div>
            ))}
          </div>

          <hr className="my-16 border-border" />

          {/* Contact for Claims */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-[#004e26] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="font-serif text-3xl mb-4">File a Claim</h3>
              <p className="text-emerald-100 mb-8 max-w-md">
                Claims must be submitted within the Warranty Period with valid proof of purchase.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="mailto:sales@ecoshiftcorp.com" className="flex items-center gap-3 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-colors border border-white/10">
                  <FileText size={18} />
                  <span className="text-sm font-semibold tracking-tight">Email Submission</span>
                </a>
                <a href="/contact" className="flex items-center gap-3 bg-white text-[#004e26] p-4 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg">
                  <RefreshCw size={18} />
                  <span className="text-sm font-semibold tracking-tight">Contact Representative</span>
                </a>
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-[-50%] right-[-10%] w-80 h-80 bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>
          </motion.div>
          
          <p className="text-center text-xs text-muted-foreground mt-12 italic">
            Any modification, servicing, or repair by unauthorized personnel will void this Warranty.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}