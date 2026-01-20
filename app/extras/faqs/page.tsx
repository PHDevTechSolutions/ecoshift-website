"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MapPin, ShoppingCart, Lightbulb } from "lucide-react";

const faqData = [
  {
    category: "Branches & Locations",
    icon: <MapPin className="text-emerald-700" size={20} />,
    questions: [
      {
        q: "Do you have other branches? Where is your main office located?",
        a: (
          <div className="space-y-4">
            <p>
              Yes! Our main office is located at <strong>Unit 405, J & L Building 251 EDSA Greenhills, Mandaluyong, Philippines</strong>. 
              We also have other branches nationwide to serve you better:
            </p>
            <ul className="space-y-3 border-l-2 border-emerald-100 pl-4">
              <li>
                <span className="font-bold block text-emerald-800">Cagayan de Oro Branch</span>
                <span className="text-sm">Warehouse #29, Alwana Business Park, Cugman, Cagayan de Oro, 9000 Misamis Oriental</span>
              </li>
              <li>
                <span className="font-bold block text-emerald-800">Cebu Branch</span>
                <span className="text-sm">Unit #1 RGY Bldg. J De Veyra St., NRA, Carreta, Cebu City</span>
              </li>
              <li>
                <span className="font-bold block text-emerald-800">Davao Branch</span>
                <span className="text-sm">Saavedra Bldg., No.3 Pag-Asa Village, Davao City, Matina Aplaya</span>
              </li>
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    category: "Ordering & Promos",
    icon: <ShoppingCart className="text-emerald-700" size={20} />,
    questions: [
      {
        q: "How can we order your products?",
        a: (
          <p>
            For <strong>wholesale purchases</strong>, you can contact us at +0917 888 1495, +0927 562 4371, +0917 888 0722, or <a href="mailto:sales@ecoshiftcorp.com.ph" className="text-emerald-700 underline">sales@ecoshiftcorp.com.ph</a>. 
            For <strong>retail orders</strong>, you can shop on our official online store.
          </p>
        ),
      },
      {
        q: "Is there a required minimum order to avail of your promos?",
        a: "None. You can avail of our promos whether it’s a retail or wholesale purchase.",
      },
      {
        q: "Can I get a warranty on your promos?",
        a: "Products on promo, clearance, or sale are eligible for a 7-day replacement or return. If the item is out of stock, we will provide a replacement with a product of equivalent specifications.",
      },
      {
        q: "Until when can I avail of your promos?",
        a: "Our promos are valid until supplies last.",
      },
    ],
  },
  {
    category: "Projects & Services",
    icon: <Lightbulb className="text-emerald-700" size={20} />,
    questions: [
      {
        q: "How can we contact you if we want to work with you on a lighting project?",
        a: "You may reach us through our hotlines or email, and our project team will be glad to assist you with a customized solution.",
      },
      {
        q: "Do you have after-sales service?",
        a: "Yes, we offer full after-sales support, including maintenance assistance and warranty claims to ensure your lighting systems perform optimally.",
      },
    ],
  },
];

export default function FAQPage() {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

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
            ◆ Support
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl mb-6 leading-tight"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Find answers to common questions about our nationwide branches, 
            ordering process, and professional lighting services.
          </motion.p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="space-y-16">
          {faqData.map((section, sectionIdx) => (
            <motion.div 
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIdx * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
                {section.icon}
                <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                  {section.category}
                </h2>
              </div>

              <div className="space-y-4">
                {section.questions.map((item, qIdx) => {
                  const id = `${sectionIdx}-${qIdx}`;
                  const isOpen = activeQuestion === id;

                  return (
                    <div 
                      key={id} 
                      className={`rounded-2xl border transition-all duration-300 ${
                        isOpen ? "bg-card border-emerald-700/30 shadow-sm" : "bg-transparent border-border hover:border-emerald-700/20"
                      }`}
                    >
                      <button
                        onClick={() => setActiveQuestion(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="font-semibold text-lg md:text-xl pr-8">
                          {item.q}
                        </span>
                        <div className={`p-1 rounded-full transition-colors ${isOpen ? "bg-emerald-700 text-white" : "bg-secondary"}`}>
                          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-8 text-muted-foreground leading-relaxed">
                              <div className="pt-2 border-t border-border/50">
                                {item.a}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still Have Questions? */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto bg-emerald-700 rounded-[2rem] p-12 text-center text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="font-serif text-3xl mb-4">Still have questions?</h3>
            <p className="text-emerald-100 mb-8 max-w-md mx-auto">
              Can't find what you're looking for? Reach out to our team directly.
            </p>
            <Link 
              href="/contact" 
              className="inline-block bg-white text-emerald-700 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-600 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Utility for Next.js internal links
import Link from "next/link";