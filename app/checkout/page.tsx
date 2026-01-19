"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ArrowLeft, Send, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("lighting_quote_cart");
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem("lighting_quote_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert("Your quote list is empty.");
    setIsSubmitting(true);

    try {
      const inquiryData = {
        clientInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
        },
        products: items.map(item => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          category: item.category || "N/A"
        })),
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "inquiries"), inquiryData);
      localStorage.removeItem("lighting_quote_cart");
      window.dispatchEvent(new Event("cartUpdated"));
      setItems([]);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md">
          <CheckCircle2 className="w-20 h-20 text-emerald-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl mb-4">Request Received</h1>
          <p className="text-muted-foreground mb-8">Thank you for your interest. Our lighting specialists will review your quote request and contact you via email shortly.</p>
          <Link href="/products" className="inline-block bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors">
            Return to Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <Link href="/products" className="flex items-center gap-2 text-sm font-mono text-muted-foreground mb-8 hover:text-emerald-700 transition-colors">
          <ArrowLeft size={16} /> CONTINUE BROWSING
        </Link>

        <h1 className="font-serif text-5xl mb-12 leading-tight">Request a Quote</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Summary Section (Now on the Left) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-xl font-bold uppercase tracking-tight">Inquiry Summary</h3>
                <span className="text-sm font-mono text-muted-foreground">{items.length} items</span>
              </div>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-3xl">
                    <p className="text-muted-foreground">Your list is empty.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div layout key={item.id} className="flex gap-4 p-4 bg-white border border-border rounded-2xl items-center shadow-sm">
                      <div className="w-16 h-16 bg-secondary/30 rounded-lg p-1">
                        <img src={item.mainImage || item.image || "/placeholder.svg"} className="w-full h-full object-contain" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                        <p className="text-xs font-mono text-muted-foreground">{item.sku}</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-600 p-2 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Form Section (Now on the Right) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-6 bg-secondary/20 p-8 rounded-3xl border border-border">
              <h3 className="text-xl font-bold px-1 mb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-muted-foreground">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-white border border-border rounded-lg p-3 outline-none focus:border-emerald-700 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-muted-foreground">Last Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-white border border-border rounded-lg p-3 outline-none focus:border-emerald-700 transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border border-border rounded-lg p-3 outline-none focus:border-emerald-700 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">Project Details / Message</label>
                <textarea 
                  rows={6} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white border border-border rounded-lg p-3 outline-none focus:border-emerald-700 transition-all" 
                  placeholder="Tell us about your project requirements (e.g., quantity needed, delivery location, etc.)"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                {isSubmitting ? "SENDING INQUIRY..." : "SUBMIT QUOTE REQUEST"}
              </button>
            </form>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}