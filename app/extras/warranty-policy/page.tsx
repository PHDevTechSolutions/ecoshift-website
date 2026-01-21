"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Wrench, RefreshCw, AlertCircle, FileText } from "lucide-react";

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
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono text-emerald-700 tracking-[0.3em] uppercase mb-4 block"
            >
              ◆ Quality Assurance
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl mb-6 leading-tight"
            >
              Warranty Policy
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Learn about our comprehensive warranty coverage for Optilux and Elune Series products.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-emerald max-w-none"
          >
            <p className="text-lg text-muted-foreground leading-relaxed mb-16">
              Ecoshift Corporation stands behind the quality of our products. This Warranty Policy outlines the coverage, terms, and conditions of our warranty for all eligible products purchased from Ecoshift.
            </p>

            <div className="space-y-12">
              {warrantyDetails.map((detail, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-12 pb-12 border-l border-emerald-100 last:border-0"
                >
                  <div className="absolute left-[-17px] top-0 bg-white p-2 border border-emerald-100 rounded-full shadow-sm group-hover:bg-emerald-700 transition-colors">
                    {detail.icon}
                  </div>
                  <h2 className="text-xl font-bold mb-3 m-0 text-foreground uppercase tracking-tight">
                    {detail.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed m-0">
                    {detail.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 p-8 bg-[#004e26] text-white rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-serif text-2xl mb-4">File a Warranty Claim</h3>
                    <p className="text-emerald-100 text-sm leading-relaxed mb-0">
                        To file a warranty claim, submit valid proof of purchase and product details to <strong>sales@ecoshiftcorp.com</strong>. Claims must be submitted within the one-year warranty period. Any modification or unauthorized repair will void this warranty.
                    </p>
                </div>
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
