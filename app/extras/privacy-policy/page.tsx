"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Eye, FileText, Globe, Lock, UserCheck, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    icon: <Eye size={20} className="text-emerald-700" />,
    content: "We collect personal information that you provide to us, such as your name, contact details, and payment information, when you place an order or register with us. If you transact with us as a company, we may also collect certain business details such as your business name, size, or project requirements. In addition, we collect non-personal information automatically when you browse our site, including your browser type, device details, and usage data, which may be gathered through cookies."
  },
  {
    title: "How We Use Your Information",
    icon: <FileText size={20} className="text-emerald-700" />,
    content: "The information we collect is used to process and deliver your orders, respond to inquiries, and provide customer support. It also helps us improve our website and services, share updates and promotions that may interest you, and ensure compliance with legal and safety requirements. You may opt out of receiving promotional messages at any time."
  },
  {
    title: "Data Sharing & Disclosure",
    icon: <Globe size={20} className="text-emerald-700" />,
    content: "We do not sell your personal data. However, we may share your information with trusted service providers, such as payment processors or logistics partners, when it is necessary to deliver our services. We may also disclose information if required by law, or when it is reasonably necessary to protect the rights, safety, and security of Ecoshift, our users, or the public."
  },
  {
    title: "Cookies & Tracking",
    icon: <ShieldCheck size={20} className="text-emerald-700" />,
    content: "Our website uses cookies to enhance your browsing experience, remember your preferences, and improve security. You may disable cookies through your browser settings, but some features of the site may not function properly if cookies are turned off."
  },
  {
    title: "Security Measures",
    icon: <Lock size={20} className="text-emerald-700" />,
    content: "We take security seriously and use industry-standard safeguards, including encryption and restricted access, to protect your data. While we make every effort to maintain a secure system, no method of transmission or storage over the Internet can be guaranteed to be completely secure."
  },
  {
    title: "Your Rights & Choices",
    icon: <UserCheck size={20} className="text-emerald-700" />,
    content: "As a user, you have the right to access and update your personal information, request corrections, and ask for the deletion of your data. You may also choose to stop receiving marketing communications from us. To exercise these rights, you may contact us at sales@ecoshiftcorp.com."
  }
];

export default function PrivacyPolicy() {
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
              ◆ Your Privacy Matters
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl mb-6 leading-tight"
            >
              Privacy Policy
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Ecoshift Corporation is committed to protecting your personal information and ensuring transparency.
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
              Ecoshift Corporation ("we," "our," or "us") values your privacy. This policy explains what information we collect, how we use it, and the choices you have. By using our website www.ecoshiftcorp.com, you agree to the practices described here.
            </p>

            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-12 pb-12 border-l border-emerald-100 last:border-0"
                >
                  <div className="absolute left-[-17px] top-0 bg-white p-2 border border-emerald-100 rounded-full shadow-sm group-hover:bg-emerald-700 transition-colors">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold mb-3 m-0 text-foreground uppercase tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed m-0">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 p-8 bg-[#004e26] text-white rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-serif text-2xl mb-4">Contact & Data Requests</h3>
                    <p className="text-emerald-100 text-sm leading-relaxed mb-0">
                        For any privacy concerns or to exercise your data rights, please contact us at <strong>sales@ecoshiftcorp.com</strong>. We will respond to all requests within 30 days. This Privacy Policy may be updated from time to time, and changes will be posted on this page.
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
