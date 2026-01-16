"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/images/logo-green.png"
                alt="RE Lighting Co."
                width={250}  // adjust size as needed
                height={162}
                className="object-contain"
              />
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              SMART LIGHTING SOLUTIONS
              <br />
              SYSTEM V2.0
            </p>
          </div>

          {/* Directory */}
          <div>
            <h4 className="text-xs font-mono text-muted-foreground mb-4">DIRECTORY</h4>
            <ul className="space-y-2">
              {[{ name: "Home", href: "/" },
                { name: "About_Us", href: "/about" },
                { name: "Products", href: "/products" },
                { name: "Blogs", href: "/blogs" },
                { name: "Projects", href: "/projects" }].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-emerald-700 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-mono text-muted-foreground mb-4">OTHER</h4>
            <ul className="space-y-2">
              {["Careers", "Privacy Policy", "FAQs"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-emerald-700 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-mono text-muted-foreground mb-4">PARTNER LOGIN</h4>
            <div className="bg-secondary/50 rounded-xl p-6 border border-border">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">PROJECT DASHBOARD</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Track quotes, view history, and manage solutions in one place.
                  </p>
                </div>
                <div className="flex gap-2 text-xs font-mono text-muted-foreground mb-4">
                  <span>QUOTES</span>
                  <span>ORDERS</span>
                  <span>LOGS</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold uppercase hover:bg-emerald-800 transition-colors"
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">©2025 ECOSHIFT CORP.</p>
          <p className="text-xs text-muted-foreground">DESIGNED FOR EXCELLENCE, BUILT FOR THE FUTURE.</p>
        </div>
      </div>
    </footer>
  )
}
