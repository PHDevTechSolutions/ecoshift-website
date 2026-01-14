"use client"

import { useState, useEffect } from "react"
import Header from "@/components/homepage/header"
import Footer from "@/components/homepage/footer"
import BackToTop from "@/components/homepage/back-to-top"
import { motion } from "framer-motion"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

interface Product {
  id: string
  mainImage?: string
  name?: string
  shortDescription?: string
  sku?: string
  categories?: string[]
  [key: string]: any
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Fetch Ecoshift products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, "products"), where("website", "==", "Ecoshift"))
        const snapshot = await getDocs(q)
        const data: Product[] = []
        const categoriesSet = new Set<string>()

        snapshot.forEach((doc) => {
          const product = { id: doc.id, ...doc.data() } as Product
          data.push(product)
          product.categories?.forEach((c) => categoriesSet.add(c))
        })

        setProducts(data)
        setAvailableCategories(Array.from(categoriesSet))
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filtered products based on search and active category
  const displayedProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase() ?? "")
    const matchesCategory = activeCategory ? p.categories?.includes(activeCategory) : true
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="pt-32">
        <section className="py-10 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ PRODUCTS</span>
              <h1 className="font-serif text-5xl md:text-6xl mt-4 mb-6 leading-tight">Our lighting solutions</h1>
              <p className="text-muted-foreground text-lg">
                Explore our comprehensive range of innovative and energy-efficient lighting products.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search + Filter */}
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-8 flex flex-col sm:flex-row justify-center items-center gap-4 relative">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            className="w-full sm:w-1/2 px-4 py-2 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-full hover:bg-emerald-800 transition-colors"
            >
              {activeCategory ? `Category: ${activeCategory}` : "Filter"}
            </button>

            {/* Dropdown */}
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-border p-3 z-50"
              >
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Categories</h4>
                <div className="flex flex-col gap-2">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      className={`text-sm text-left px-2 py-1 rounded ${
                        activeCategory === cat
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-700 hover:text-emerald-700"
                      }`}
                      onClick={() => {
                        setActiveCategory(activeCategory === cat ? null : cat)
                        setFilterOpen(false)
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-6">
            {loading ? (
              <div className="flex justify-center py-20">Loading...</div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No products found.</div>
            ) : (
              <motion.div
                className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {displayedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    whileHover={{ y: -3 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-56 bg-secondary/50 overflow-hidden group">
                      {product.mainImage && (
                        <motion.img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Category Badge */}
                      {product.categories && product.categories.length > 0 && (
                        <span className="absolute top-2 left-2 bg-white text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                          {product.categories[0]}
                        </span>
                      )}

                      {/* View Product Button */}
                      <motion.button
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"
                        whileHover={{ scale: 1.05 }}
                      >
                        View Product
                      </motion.button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-muted-foreground text-sm flex-1">{product.shortDescription}</p>
                      {product.sku && (
                        <span className="text-[10px] text-muted-foreground mt-1">SKU: {product.sku}</span>
                      )}

                      {/* Add to Quote Button */}
                      <button className="mt-3 py-1.5 px-3 bg-emerald-700 text-white font-medium text-sm rounded-full hover:bg-emerald-800 transition-colors">
                        Add to Quote
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <Footer />
      <BackToTop />
    </main>
  )
}
