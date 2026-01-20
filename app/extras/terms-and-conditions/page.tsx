"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Scale, Cookie, Copyright, MessageSquare, Link2, AlertTriangle, Gavel } from "lucide-react";

const terms = [
  {
    title: "Definitions",
    icon: <Scale size={20} className="text-emerald-700" />,
    content: "“Client,” “You,” or “Your” refers to the person using this website and agreeing to these Terms. “Company,” “We,” “Our,” or “Us” refers to Ecoshift Corporation. These Terms, along with our Privacy Policy and Disclaimer, govern your use of the site in accordance with the laws of the Philippines."
  },
  {
    title: "Cookies",
    icon: <Cookie size={20} className="text-emerald-700" />,
    content: "Our website uses cookies to improve functionality and enhance your browsing experience. By continuing to use our site, you consent to the use of cookies in line with our Privacy Policy."
  },
  {
    title: "Intellectual Property Rights",
    icon: <Copyright size={20} className="text-emerald-700" />,
    content: "Unless otherwise stated, Ecoshift Corporation and/or its licensors own all intellectual property rights for material on this website. You may access and use content for personal purposes only. You may not republish, sell, or sub-license material, reproduce content for commercial purposes without permission, or redistribute our content without attribution."
  },
  {
    title: "User Content",
    icon: <MessageSquare size={20} className="text-emerald-700" />,
    content: "If you submit reviews or feedback, you grant Ecoshift Corporation a license to use and adapt that content. You agree not to post content that is unlawful, offensive, defamatory, or violates intellectual property rights. We reserve the right to remove any content we consider inappropriate."
  },
  {
    title: "Links to Our Website",
    icon: <Link2 size={20} className="text-emerald-700" />,
    content: "You may link to our website as long as the link is not misleading, does not imply sponsorship without consent, and fits within your site's context. Ecoshift Corporation reserves the right to request the removal of any link to our website at its discretion."
  },
  {
    title: "Liability Disclaimer",
    icon: <AlertTriangle size={20} className="text-emerald-700" />,
    content: "We make reasonable efforts to keep information accurate, but do not guarantee completeness or availability. Ecoshift Corporation is not liable for any loss arising from the use of our website, except for liabilities that cannot be excluded under Philippine law."
  },
  {
    title: "Governing Law",
    icon: <Gavel size={20} className="text-emerald-700" />,
    content: "These Terms are governed by and construed in accordance with the laws of the Philippines. Any changes to these terms will be posted on this page, and continued use of the site constitutes acceptance of those changes."
  }
];

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-emerald-700 tracking-[0.3em] uppercase mb-4 block"
          >
            ◆ Legal Framework
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl mb-6 leading-tight"
          >
            Terms & Conditions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Please read these rules and regulations carefully before using the Ecoshift Corporation website.
          </motion.p>
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
              These Terms and Conditions outline the rules and regulations for the use of Ecoshift Corporation’s website, located at <span className="text-emerald-700">https://www.ecoshiftcorp.com</span>. By accessing or using our website, you agree to be bound by these Terms. If you do not agree, please discontinue use of the site.
            </p>

            <div className="space-y-12">
              {terms.map((term, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-12 pb-12 border-l border-emerald-100 last:border-0"
                >
                  <div className="absolute left-[-17px] top-0 bg-white p-2 border border-emerald-100 rounded-full shadow-sm group-hover:bg-emerald-700 transition-colors">
                    {term.icon}
                  </div>
                  <h2 className="text-xl font-bold mb-3 m-0 text-foreground uppercase tracking-tight">
                    {term.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed m-0">
                    {term.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 p-8 bg-[#004e26] text-white rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-serif text-2xl mb-4">Agreement Notice</h3>
                    <p className="text-emerald-100 text-sm leading-relaxed mb-0">
                        Ecoshift Corporation reserves the right to amend these Terms from time to time. Your continued use of the website after any changes are posted signifies your acceptance of the revised Terms. For any clarification, contact us at <strong>sales@ecoshiftcorp.com.ph</strong>.
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