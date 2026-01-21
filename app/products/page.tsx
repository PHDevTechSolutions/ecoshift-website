"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo, useCallback, useEffect } from "react"
import Link from "next/link"
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  X, 
  Loader2, 
  Minus, 
  Search, 
  SlidersHorizontal 
} from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import ProductFilter from "@/components/products/ProductFilter"
import Highlights from "@/components/products/Highlights"
import Application from "@/components/products/Application"

// ... (Keeping your existing interfaces) ...
interface FilterState {
  [key: string]: string
  application: string
  mountingType: string
  colour: string
  lightDistribution: string
  lampType: string
  lampColour: string
  power: string
  connection: string
  fluxFrom: string
  fluxTo: string
}

interface DynamicSpec {
  title?: string
  value?: string
}

interface Product {
  id: string
  category?: string
  name: string
  description?: string
  image?: string
  sku: string
  type?: string
  mainImage?: string
  website?: string
  technicalSpecs?: any[]
  dynamicSpecs?: DynamicSpec[]
  quantity?: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [dbCategories, setDbCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false) // New Filter State
  const [searchQuery, setSearchQuery] = useState("") // New Search State
  
  const [quoteCart, setQuoteCart] = useState<Product[]>([])
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState("CATEGORIES")

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
  })

  // ... (Your existing useEffects for Cart Sync, Categories, and Products remain unchanged) ...

  const syncCart = useCallback(() => {
    const savedCart = localStorage.getItem("lighting_quote_cart")
    if (savedCart) {
      try {
        setQuoteCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart", error)
      }
    } else {
      setQuoteCart([])
    }
  }, [])

  useEffect(() => {
    syncCart()
    window.addEventListener("storage", syncCart)
    window.addEventListener("cartUpdated", syncCart)
    return () => {
      window.removeEventListener("storage", syncCart)
      window.removeEventListener("cartUpdated", syncCart)
    }
  }, [syncCart])

  useEffect(() => {
    try {
      const catQuery = query(collection(db, "categoriesmaintenance"), orderBy("createdAt", "desc"))
      const catUnsubscribe = onSnapshot(catQuery, (snapshot) => {
        const cats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setDbCategories(cats)
      })
      return () => catUnsubscribe()
    } catch (error) { console.error(error) }
  }, [])

  useEffect(() => {
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[])
        setLoading(false)
      })
      return () => unsubscribe()
    } catch (error) { 
      console.error(error) 
      setLoading(false)
    }
  }, [])

  // --------------------------------------------------------------------------
  // UPDATED FILTERING LOGIC (Includes Search)
  // --------------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    const activeCategoryNames = dbCategories.map((cat: any) => cat.title?.trim().toUpperCase())

    return products.filter((product) => {
      // 1. Search Query Check
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = product.name?.toLowerCase().includes(query)
        const matchesSku = product.sku?.toLowerCase().includes(query)
        const matchesDesc = product.description?.toLowerCase().includes(query)
        
        if (!matchesName && !matchesSku && !matchesDesc) return false
      }

      // 2. Category Check
      const hasActiveCategory = product.dynamicSpecs?.some((spec: any) =>
        activeCategoryNames.includes(spec.value?.trim().toUpperCase()),
      )
      if (!hasActiveCategory) return false

      // 3. Dynamic Spec Filters
      const activeEntries = Object.entries(filters).filter(([key, value]) => {
        return value !== "*" && value !== "" && key !== "fluxFrom" && key !== "fluxTo"
      })

      for (const [key, filterValue] of activeEntries) {
        let hasMatch = product.dynamicSpecs?.some(
          (spec: any) =>
            spec.title?.toLowerCase() === key.toLowerCase() &&
            spec.value?.toLowerCase() === filterValue.toString().toLowerCase(),
        )

        // Fallback to Technical Specs if no Dynamic Match
        if (!hasMatch && product.technicalSpecs) {
          product.technicalSpecs.forEach((spec: any) => {
            const foundRow = spec.rows?.find(
              (r: any) =>
                r.name.toLowerCase() === key.toLowerCase() ||
                (key === "power" && r.name.toLowerCase() === "wattage") ||
                (key === "lampType" && r.name.toLowerCase() === "lamp type") ||
                (key === "mountingType" && r.name.toLowerCase() === "mounting type"),
            )
            if (foundRow && foundRow.value.toLowerCase().includes(filterValue.toString().toLowerCase())) {
              hasMatch = true
            }
          })
        }
        if (!hasMatch) return false
      }

      // 4. Flux Range Filter
      if (filters.fluxFrom || filters.fluxTo) {
        let productFlux = 0
        product.technicalSpecs?.forEach((spec: any) => {
          const row = spec.rows?.find(
            (r: any) => r.name.toLowerCase().includes("lumen") || r.name.toLowerCase().includes("flux"),
          )
          if (row) productFlux = Number.parseInt(row.value.replace(/[^0-9]/g, "")) || 0
        })
        const from = Number.parseInt(filters.fluxFrom) || 0
        const to = Number.parseInt(filters.fluxTo) || Number.POSITIVE_INFINITY
        if (productFlux < from || productFlux > to) return false
      }
      return true
    })
  }, [products, filters, dbCategories, searchQuery]) // Added searchQuery dependency

  // ... (AddToCart Logic Remains) ...
  const addToQuote = (product: Product) => {
    const currentCart = JSON.parse(localStorage.getItem("lighting_quote_cart") || "[]")
    if (!currentCart.find((item: Product) => item.id === product.id)) {
      const updatedCart = [...currentCart, { ...product, quantity: 1 }]
      localStorage.setItem("lighting_quote_cart", JSON.stringify(updatedCart))
      window.dispatchEvent(new Event("cartUpdated"))
      setIsCartOpen(true)
    }
  }

  const removeFromQuote = (id: string) => {
    const currentCart = JSON.parse(localStorage.getItem("lighting_quote_cart") || "[]")
    const updatedCart = currentCart.filter((item: Product) => item.id !== id)
    localStorage.setItem("lighting_quote_cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  // Count active filters for badge
  const activeFilterCount = Object.values(filters).filter(val => val !== "*" && val !== "").length;

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
              <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ PRODUCTS</span>
              <h1 className="font-serif text-5xl md:text-6xl mt-4 mb-6 leading-tight font-semibold">Our lighting solutions</h1>
              <p className="text-muted-foreground text-lg font-sans font-medium leading-relaxed">
                Explore our comprehensive range of innovative and energy-efficient lighting products.
              </p>
            </motion.div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* CONTROLS BAR: Sort Tabs, Search, Filter Button */}
        {/* --------------------------------------------------------- */}
        <section className="sticky top-[80px] z-30 bg-background/80 backdrop-blur-md border-b border-border py-4 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* View Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
               {["CATEGORIES", "APPLICATIONS", "HIGHLIGHTS"].map((tab) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveView(tab)}
                    className={`px-4 py-2.5 text-xs font-semibold tracking-wider transition-all rounded-lg whitespace-nowrap ${
                      activeView === tab
                        ? "bg-emerald-700 text-white"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {tab}
                  </motion.button>
                ))}
            </div>

            {/* Right Side: Search + Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              
              {/* Search Bar */}
              <div className="relative flex-1 md:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-emerald-700 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/50 border border-transparent focus:border-emerald-700 focus:bg-background rounded-lg py-2.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/70"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${activeFilterCount > 0 ? 'bg-secondary border-emerald-700/50 text-emerald-700' : 'bg-background border-border hover:bg-secondary'}`}
              >
                <SlidersHorizontal size={16} />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="bg-emerald-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                    {activeFilterCount}
                  </span>
                )}
              </motion.button>
            </div>

          </div>
        </section>

        {/* Main Content: Full Width Grid */}
        <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
            </div>
          ) : (
            <>
              {activeView === "HIGHLIGHTS" && (
                <Highlights products={filteredProducts} addToQuote={addToQuote} quoteCart={quoteCart} />
              )}

              {activeView === "APPLICATIONS" && (
                <Application filteredProducts={filteredProducts} addToQuote={addToQuote} quoteCart={quoteCart} />
              )}

              {activeView === "CATEGORIES" && (
                <div className="space-y-6">
                  {dbCategories.map((category) => {
                    const categoryProducts = filteredProducts.filter((p) =>
                      p.dynamicSpecs?.some(
                        (spec: any) =>
                          spec.value?.trim().toUpperCase() === category.title?.trim().toUpperCase(),
                      ),
                    )

                    if (categoryProducts.length === 0) return null
                    const isOpen = openCategoryId === category.id

                    return (
                      <motion.div
                        key={category.id}
                        layout="position"
                        className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
                      >
                         {/* Category Header Button */}
                        <motion.button
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                          onClick={() => setOpenCategoryId(isOpen ? null : category.id)}
                          className="w-full flex items-center justify-between p-6 md:p-8 transition-all"
                        >
                          <div className="flex gap-6 items-center text-left">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-border shadow-sm">
                              {category.imageUrl ? (
                                <img src={category.imageUrl} alt={category.title} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-mono text-muted-foreground">No img</span>
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <h3 className={`font-serif text-lg md:text-xl transition-colors ${isOpen ? "text-emerald-700" : "text-foreground"}`}>
                                {category.title}
                              </h3>
                              <p className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">
                                {categoryProducts.length} Premium Products
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-secondary rounded-full border border-border">
                              {isOpen ? <Minus size={16} className="text-emerald-700" /> : <Plus size={16} className="text-muted-foreground" />}
                            </div>
                          </div>
                        </motion.button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-border bg-secondary/20"
                            >
                              <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                {categoryProducts.map((product) => (
                                  <Link key={product.id} href={`/products/${product.id}`} className="h-full">
                                    <motion.div
                                      whileHover={{ y: -4 }}
                                      className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group h-full"
                                    >
                                      <div className="h-48 bg-white overflow-hidden flex items-center justify-center p-4">
                                        <img
                                          src={product.mainImage || product.image || "/placeholder.svg"}
                                          alt={product.name}
                                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                      </div>
                                      <div className="p-4 flex flex-col flex-1 border-t border-border/50">
                                        <h4 className="text-sm font-semibold line-clamp-2 mb-1 group-hover:text-emerald-700 transition-colors">
                                          {product.name}
                                        </h4>
                                        <p className="text-[10px] font-mono text-muted-foreground mb-4">SKU: {product.sku}</p>
                                        <div className="mt-auto">
                                            <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                addToQuote(product)
                                            }}
                                            className={`w-full py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                                                quoteCart.find((item) => item.id === product.id)
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-emerald-700 text-white hover:bg-emerald-800"
                                            }`}
                                            >
                                            {quoteCart.find((item) => item.id === product.id) ? "ADDED" : "ADD TO QUOTE"}
                                            </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                  {dbCategories.length === 0 && (
                    <div className="text-center py-20"><p className="text-muted-foreground">No categories available.</p></div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Footer />

      {/* --------------------------------------------------------- */}
      {/* FILTER DRAWER (Mobile & Desktop) */}
      {/* --------------------------------------------------------- */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full sm:w-[400px] bg-background z-[2001] shadow-2xl flex flex-col border-r border-border"
            >
              <div className="p-5 border-b border-border flex items-center justify-between bg-background">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-emerald-700"/>
                    <h2 className="text-lg font-bold">Filters</h2>
                </div>
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                 {/* Re-using your existing ProductFilter component */}
                 {/* We pass a custom className to remove default padding if needed */}
                 <div className="p-5">
                    <ProductFilter
                        products={products}
                        productCount={filteredProducts.length}
                        filters={filters}
                        setFilters={setFilters}
                    />
                 </div>
              </div>

              <div className="p-5 border-t border-border bg-background">
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-emerald-700 text-white py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
                >
                    Show {filteredProducts.length} Products
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* --------------------------------------------------------- */}
      {/* SHOPPING CART DRAWER (Existing) */}
      {/* --------------------------------------------------------- */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[1001] bg-emerald-700 text-white p-4 md:p-5 rounded-full shadow-2xl shadow-emerald-900/20"
      >
        <ShoppingBag size={24} />
        {quoteCart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-emerald-700 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-emerald-700">
            {quoteCart.length}
          </span>
        )}
      </motion.button>

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
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-background z-[2001] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold font-serif">Quote List</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {quoteCart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No products added to quote yet.</p>
                ) : (
                  quoteCart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 p-3 bg-secondary/30 rounded-xl items-start border border-border"
                    >
                      <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center flex-shrink-0 shadow-sm border border-border/50">
                        <img
                          src={item.mainImage || item.image || "/placeholder.svg"}
                          className="max-w-full max-h-full object-contain"
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold line-clamp-2 mb-1">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-mono">{item.sku}</p>
                      </div>
                      <button
                        onClick={() => removeFromQuote(item.id)}
                        className="text-muted-foreground hover:text-red-600 flex-shrink-0 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
              <div className="p-6 border-t border-border bg-background">
                <Link
                  href="/checkout"
                  className={`block w-full py-3 text-center rounded-xl font-semibold transition-all ${
                    quoteCart.length > 0
                      ? "bg-emerald-700 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-900/20"
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
  )
}