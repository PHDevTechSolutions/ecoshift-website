"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 5)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Projects", href: "/projects" },
    { name: "Blogs", href: "/blogs" },
  ]

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-400 mx-auto mt-4 px-6 pointer-events-auto"
      >
        {/* FLOATING NAV */}
        <motion.div
          initial={false}
          animate={{
            backgroundColor: hasScrolled ? "rgb(45, 74, 62, 0.75)" : "transparent",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`
            h-16 w-full flex items-center justify-between
            px-6 rounded-2xl transition-all duration-300
            ${hasScrolled ? "shadow-2xl border border-white/10 backdrop-blur-2xl" : "shadow-none border-transparent"}
          `}
        >
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <motion.img
              src={hasScrolled ? "/images/logo-white.png" : "/images/logo-green.png"}
              alt="Lighting Co. Logo"
              className="h-10 w-auto transition-opacity duration-300"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.05 }}>
                <Link
                  href={item.href}
                  className={`text-sm uppercase tracking-wide transition-colors duration-300 ${
                    hasScrolled ? "text-white hover:text-gray-100" : "text-emerald-700 hover:text-emerald-600"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/quote">
                <button
                  className={`px-6 py-2 rounded-full uppercase transition text-sm font-medium ${
                    hasScrolled
                      ? "bg-white text-emerald-700 hover:bg-gray-100"
                      : "bg-emerald-700 text-white hover:bg-emerald-800"
                  }`}
                >
                  Free Quote
                </button>
              </Link>
            </motion.div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden flex items-center">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 transition-colors duration-300 ${hasScrolled ? "text-white" : "text-emerald-700"}`}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </motion.div>

        {/* MOBILE MENU */}
        <motion.div
  initial={{ opacity: 0, y: -12, scale: 0.98 }}
  animate={isMenuOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -12, scale: 0.98 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
  className={`
    lg:hidden mt-3 rounded-2xl
    bg-emerald-700/75 backdrop-blur-2xl shadow-2xl border border-white/10
    px-6 py-5
    ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"}
  `}
>

          <div className="flex flex-col space-y-5">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg uppercase tracking-wide text-white hover:text-gray-100 transition-colors block"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: navItems.length * 0.05 }}
            >
              <Link href="/quote" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full mt-2 px-6 py-3 text-emerald-700 bg-white rounded-full uppercase transition text-sm font-medium hover:bg-gray-100">
                  Free Quote
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </header>
  )
}
