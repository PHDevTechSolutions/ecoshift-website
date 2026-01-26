"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  
  // 1. ADDED MOUNTED STATE TO FIX HYDRATION
  const [mounted, setMounted] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  // 2. SET MOUNTED TO TRUE ON LOAD
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setHasScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserSession(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAvatarDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Projects", href: "/projects" },
    { name: "Blogs", href: "/blogs" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        // 3. INCREASED WIDTH (max-w-[1600px] instead of 7xl)
        className="max-w-[1600px] mx-auto mt-4 px-4 md:px-8 pointer-events-auto"
      >
        <motion.div
          initial={false}
          animate={{
            backgroundColor: hasScrolled
              ? "rgb(45, 74, 62, 0.75)"
              : "transparent",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`
            h-16 w-full flex items-center justify-between
            px-6 rounded-2xl transition-all duration-300
            ${hasScrolled ? "shadow-2xl border border-white/10 backdrop-blur-2xl" : "shadow-none border-transparent"}
          `}
        >
          <Link href="/" className="flex items-center">
            <motion.img
              src={hasScrolled ? "/images/logo-white.png" : "/images/logo-green.png"}
              alt="Lighting Co. Logo"
              className="h-10 w-auto transition-opacity duration-300"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            />
          </Link>

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

          <div className="hidden lg:flex items-center gap-4">
            {/* 4. GUARDED USER SESSION RENDERING */}
            {mounted && userSession && (
              <div className="relative">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                    hasScrolled ? "border-emerald-700 bg-emerald-50" : "border-emerald-700/40 bg-emerald-700/10"
                  }`}
                >
                  {userSession.photoURL ? (
                    <img src={userSession.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-emerald-700">
                      {(userSession.displayName || userSession.email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isAvatarDropdownOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-emerald-200 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-emerald-100">
                          <p className="text-sm font-medium text-foreground truncate">{userSession.displayName || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{userSession.email}</p>
                        </div>
                        <div className="py-2">
                          <Link href="/portal" onClick={() => setIsAvatarDropdownOpen(false)}>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-emerald-50 transition flex items-center gap-2 text-foreground">
                              <User size={16} className="text-emerald-700" /> Portal
                            </button>
                          </Link>
                        </div>
                        <div className="border-t border-emerald-100 py-2">
                          <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 transition flex items-center gap-2 text-red-600">
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                      <div className="fixed inset-0 z-40" onClick={() => setIsAvatarDropdownOpen(false)} />
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/quote">
                <button className={`px-6 py-2 rounded-full uppercase transition text-sm font-medium ${
                  hasScrolled ? "bg-white text-emerald-700 hover:bg-gray-100" : "bg-emerald-700 text-white hover:bg-emerald-800"
                }`}>
                  Free Quote
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            {/* MOBILE SESSION GUARD */}
            {mounted && userSession && (
              <button onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)} className="w-9 h-9 rounded-full border-2 border-emerald-700/40 overflow-hidden">
                <img src={userSession.photoURL || "/placeholder.svg"} className="w-full h-full object-cover" alt="User" />
              </button>
            )}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${hasScrolled ? "text-white" : "text-emerald-700"}`}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </motion.div>

        {/* MOBILE MENU */}
        <motion.div
          initial={false}
          animate={isMenuOpen ? { opacity: 1, y: 0, scale: 1, pointerEvents: "auto" } : { opacity: 0, y: -12, scale: 0.98, pointerEvents: "none" }}
          className="lg:hidden mt-3 rounded-2xl bg-emerald-700/95 backdrop-blur-2xl shadow-2xl border border-white/10 px-6 py-5"
        >
          <div className="flex flex-col space-y-5">
            {navItems.map((item, i) => (
              <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-lg uppercase tracking-wide text-white block">
                {item.name}
              </Link>
            ))}
            <Link href="/quote" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full mt-2 px-6 py-3 text-emerald-700 bg-white rounded-full uppercase text-sm font-medium">
                Free Quote
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}