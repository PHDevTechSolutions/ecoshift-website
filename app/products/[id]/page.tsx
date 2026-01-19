"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Plus, Check, Loader2, Info, 
  ShieldCheck, Truck, ShoppingBag, X, Trash2 
} from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quoteCart, setQuoteCart] = useState<any[]>([]);

  const syncCart = useCallback(() => {
    const savedCart = localStorage.getItem("lighting_quote_cart");
    setQuoteCart(savedCart ? JSON.parse(savedCart) : []);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          router.push("/products");
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    }
    fetchProduct();
    syncCart();
    window.addEventListener("cartUpdated", syncCart);
    return () => window.removeEventListener("cartUpdated", syncCart);
  }, [id, router, syncCart]);

  const addToQuote = () => {
    if (!product) return;
    const currentCart = JSON.parse(localStorage.getItem("lighting_quote_cart") || "[]");
    if (!currentCart.find((item: any) => item.id === product.id)) {
      const updatedCart = [...currentCart, product];
      localStorage.setItem("lighting_quote_cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const removeFromQuote = (productId: string) => {
    const updatedCart = quoteCart.filter((item) => item.id !== productId);
    localStorage.setItem("lighting_quote_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-700" /></div>;
  if (!product) return null;

  const isInCart = quoteCart.some((item) => item.id === product.id);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <Link href="/products" className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-emerald-700 mb-12 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO COLLECTION
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-square bg-secondary/30 rounded-3xl overflow-hidden border border-border">
            <img src={product.mainImage || product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-mono text-emerald-700 tracking-widest uppercase mb-4">◆ {product.category || "Professional Lighting"}</span>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">{product.name}</h1>
            <p className="text-muted-foreground text-lg mb-8">{product.description}</p>
            
            <motion.button
              whileHover={!isInCart ? { scale: 1.02 } : {}}
              whileTap={!isInCart ? { scale: 0.98 } : {}}
              onClick={addToQuote}
              className={`w-full md:w-max px-12 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
                isInCart ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-emerald-700 text-white hover:bg-emerald-800"
              }`}
            >
              {isInCart ? <><Check size={20} /> IN QUOTE LIST</> : <><Plus size={20} /> ADD TO QUOTE</>}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating Cart & Sidebar (Matches Products Page) */}
      <motion.button onClick={() => setIsCartOpen(true)} className="fixed bottom-8 right-8 z-[1001] bg-emerald-700 text-white p-6 rounded-full shadow-2xl">
        <ShoppingBag size={24} />
        {quoteCart.length > 0 && <span className="absolute -top-2 -right-2 bg-white text-emerald-700 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-emerald-700">{quoteCart.length}</span>}
      </motion.button>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[2001] shadow-2xl flex flex-col">
              <div className="p-8 border-b flex items-center justify-between">
                <h2 className="text-2xl font-bold">Quote List</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-secondary rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {quoteCart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-4 bg-secondary/30 rounded-xl items-start border border-border">
                    <img src={item.mainImage || item.image} className="w-12 h-12 rounded-lg object-contain bg-white" alt={item.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                    </div>
                    <button onClick={() => removeFromQuote(item.id)} className="text-muted-foreground hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <div className="p-8 border-t bg-white">
                <Link href="/checkout" className="block w-full py-3 text-center rounded-lg font-semibold bg-emerald-700 text-white hover:bg-emerald-800">Proceed to Quote</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Footer />
    </main>
  );
}