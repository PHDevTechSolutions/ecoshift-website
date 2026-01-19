"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Plus, Trash2, X, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import ProductFilter from "@/components/products/ProductFilter";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

interface FilterState {
  [key: string]: string;
  application: string;
  mountingType: string;
  colour: string;
  lightDistribution: string;
  lampType: string;
  lampColour: string;
  power: string;
  connection: string;
  fluxFrom: string;
  fluxTo: string;
}

interface Product {
  id: string;
  category?: string;
  name: string;
  description?: string;
  image?: string;
  sku: string;
  type?: string;
  mainImage?: string;
  website?: string;
  technicalSpecs?: any[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quoteCart, setQuoteCart] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<FilterState>({
    application: "*",
    mountingType: "*",
    colour: "*",
    lightDistribution: "*",
    lampType: "*",
    lampColour: "*",
    power: "*",
    connection: "*",
    fluxFrom: "",
    fluxTo: "",
  });

  const syncCart = useCallback(() => {
    const savedCart = localStorage.getItem("lighting_quote_cart");
    if (savedCart) {
      try {
        setQuoteCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart", error);
      }
    } else {
      setQuoteCart([]);
    }
  }, []);

  useEffect(() => {
    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("cartUpdated", syncCart);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("cartUpdated", syncCart);
    };
  }, [syncCart]);

  useEffect(() => {
    try {
      const q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        where("website", "==", "Ecoshift Corporation")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setProducts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[]
        );
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const activeEntries = Object.entries(filters).filter(
        ([key, value]) =>
          value !== "*" &&
          value !== "" &&
          key !== "fluxFrom" &&
          key !== "fluxTo"
      );

      for (const [key, filterValue] of activeEntries) {
        let productValue = product[key as keyof Product];

        if (!productValue && product.technicalSpecs) {
          product.technicalSpecs.forEach((spec: any) => {
            const foundRow = spec.rows?.find(
              (r: any) =>
                r.name.toLowerCase() === key.toLowerCase() ||
                (key === "power" && r.name.toLowerCase() === "wattage") ||
                (key === "lampType" && r.name.toLowerCase() === "lamp type")
            );
            if (foundRow) productValue = foundRow.value;
          });
        }

        if (Array.isArray(productValue)) {
          if (!productValue.includes(filterValue)) return false;
        } else {
          if (productValue !== filterValue) return false;
        }
      }

      if (filters.fluxFrom || filters.fluxTo) {
        let productFlux = 0;
        product.technicalSpecs?.forEach((spec: any) => {
          const row = spec.rows?.find(
            (r: any) =>
              r.name.toLowerCase() === "lumens" ||
              r.name.toLowerCase() === "luminous flux"
          );
          if (row)
            productFlux =
              Number.parseInt(row.value.replace(/[^0-9]/g, "")) || 0;
        });
        const from = Number.parseInt(filters.fluxFrom) || 0;
        const to = Number.parseInt(filters.fluxTo) || Number.POSITIVE_INFINITY;
        if (productFlux < from || productFlux > to) return false;
      }

      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(queryLower);
        const descMatch = product.description
          ?.toLowerCase()
          .includes(queryLower);
        const skuMatch = product.sku.toLowerCase().includes(queryLower);
        if (!nameMatch && !descMatch && !skuMatch) return false;
      }

      return true;
    });
  }, [products, filters, searchQuery]);

  const addToQuote = (product: Product) => {
    const currentCart = JSON.parse(
      localStorage.getItem("lighting_quote_cart") || "[]"
    );
    if (!currentCart.find((item: Product) => item.id === product.id)) {
      const updatedCart = [...currentCart, product];
      localStorage.setItem("lighting_quote_cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const removeFromQuote = (id: string) => {
    const currentCart = JSON.parse(
      localStorage.getItem("lighting_quote_cart") || "[]"
    );
    const updatedCart = currentCart.filter((item: Product) => item.id !== id);
    localStorage.setItem("lighting_quote_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32">
        {/* Hero */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-xs font-mono text-muted-foreground tracking-wider">
                ◆ PRODUCTS
              </span>
              <h1 className="font-serif text-5xl md:text-6xl mt-4 mb-6 leading-tight">
                Our lighting solutions
              </h1>
              <p className="text-muted-foreground text-lg">
                Explore our comprehensive range of innovative and
                energy-efficient lighting products.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products & Sidebar */}
        <section className="py-8 border-b border-border md:py-16 px-4 md:px-6 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
            {/* Products Grid */}
            <div className="lg:col-span-9">
              {/* Search Bar */}
              <div className="mb-6 flex justify-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-10xl border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-emerald-700 transition-all"
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
                </div>
              ) : (
                <>
                  {filteredProducts.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                      <h3 className="text-sm md:text-xl font-semibold text-gray-300">
                        No products found
                      </h3>
                    </div>
                  ) : (
                    <motion.div
                      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                          <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-shadow"
                          >
                            {/* Wrap image in Link */}
                            <Link href={`/products/${product.id}`} className="block w-full h-64 bg-secondary/50 overflow-hidden">
                              <motion.img
                                src={
                                  product.mainImage ||
                                  product.image ||
                                  "/placeholder.svg"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300"
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                            </Link>

                            <div className="p-6 flex flex-col flex-1">
                              {/* Wrap info in Link */}
                              <Link href={`/products/${product.id}`} className="group/info">
                                <div className="mb-4">
                                  <span className="text-xs font-mono text-emerald-700 tracking-widest uppercase">
                                    {product.category || "Product"}
                                  </span>
                                  <h3 className="font-semibold text-lg mt-2 mb-2 group-hover/info:text-emerald-700 transition-colors">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                    {product.description ||
                                      "Premium lighting solution"}
                                  </p>
                                  <p className="text-xs text-muted-foreground font-mono">
                                    SKU: {product.sku}
                                  </p>
                                </div>
                              </Link>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addToQuote(product)}
                                className={`mt-auto w-full py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                  quoteCart.find(
                                    (item) => item.id === product.id
                                  )
                                    ? "bg-emerald-50 text-emerald-700 cursor-default"
                                    : "bg-emerald-700 text-white hover:bg-emerald-800"
                                }`}
                              >
                                {quoteCart.find(
                                  (item) => item.id === product.id
                                ) ? (
                                  "In Quote"
                                ) : (
                                  <>
                                    <Plus size={16} />
                                    Add to Quote
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar Filter */}
            <aside className="lg:col-span-3">
              <ProductFilter
                products={products}
                productCount={filteredProducts.length}
                filters={filters}
                setFilters={setFilters}
              />
            </aside>
          </div>
        </section>
      </div>

      <Footer />

      {/* Floating Cart Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[1001] bg-emerald-700 text-white p-4 md:p-6 rounded-full shadow-2xl"
      >
        <ShoppingBag size={24} />
        {quoteCart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-emerald-700 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-emerald-700">
            {quoteCart.length}
          </span>
        )}
      </motion.button>

      {/* Quote Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[2001] shadow-2xl flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-border flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold">Quote List</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-secondary rounded-full"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
                {quoteCart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No products added to quote yet.
                  </p>
                ) : (
                  quoteCart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3 p-4 bg-secondary/30 rounded-xl items-start border border-border"
                    >
                      <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <img
                          src={
                            item.mainImage || item.image || "/placeholder.svg"
                          }
                          className="max-w-full max-h-full object-contain"
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground font-mono">
                          {item.sku}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromQuote(item.id)}
                        className="text-muted-foreground hover:text-red-600 flex-shrink-0 p-2"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </div>
              <div className="p-6 md:p-8 border-t border-border bg-white">
                <Link
                  href="/checkout"
                  className={`block w-full py-3 text-center rounded-lg font-semibold transition-all ${
                    quoteCart.length > 0
                      ? "bg-emerald-700 text-white hover:bg-emerald-800"
                      : "bg-secondary text-muted-foreground pointer-events-none"
                  }`}
                >
                  Proceed to Quote
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}