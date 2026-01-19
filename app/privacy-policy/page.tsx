"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Lock, Globe, FileText, UserCheck } from "lucide-react";

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
            <span className="text-xs font-mono text-emerald-700 tracking-[0.3em] uppercase mb-4 block">
              ◆ Legal
            </span>
            <h1 className="font-serif text-5xl md:text-6xl mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              Last Updated: January 19, 2026
            </p>
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
            <p className="text-xl text-muted-foreground leading-relaxed mb-16 italic">
              Ecoshift Corporation (“we,” “our,” or “us”) values your privacy. This policy explains what information we collect, how we use it, and the choices you have. By using our website www.ecoshiftcorp.com, you agree to the practices described here.
            </p>

            <div className="space-y-16">
              {sections.map((section, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl font-bold m-0">{section.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <hr className="my-16 border-border" />

            <div className="bg-secondary/20 p-8 rounded-3xl border border-border">
              <h3 className="text-xl font-bold mb-4 m-0">Contact & Inquiries</h3>
              <p className="text-muted-foreground mb-6">
                If you have any questions or concerns regarding this Privacy Policy, or if you wish to exercise your data rights, please reach out to us:
              </p>
              <div className="flex flex-col gap-3 font-mono text-sm">
                <a href="mailto:sales@ecoshiftcorp.com" className="text-emerald-700 hover:underline">
                  sales@ecoshiftcorp.com
                </a>
                <span className="text-muted-foreground">
                  Official Hotlines: Contact our main office
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-12 text-center">
              This Privacy Policy may be updated from time to time. Any changes will be posted on this page with the date of revision.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}