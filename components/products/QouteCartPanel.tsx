'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(cart)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id)
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addDoc(collection(db, 'orders'), {
        customer: formData,
        items: cartItems,
        subtotal,
        tax,
        total,
        createdAt: new Date(),
      })

      localStorage.removeItem('cart')
      setSuccess(true)
      setTimeout(() => {
        router.push('/products')
      }, 3000)
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Header />
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6">
            <div className="w-20 h-20 bg-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-4xl">✓</span>
            </div>
          </motion.div>
          <h1 className="font-serif text-4xl mb-4">Order Placed Successfully</h1>
          <p className="text-muted-foreground mb-8">Thank you for your order. Redirecting to products...</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="font-serif text-4xl md:text-5xl mb-12">Checkout</h1>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Form Section */}
            <div className="md:col-span-2">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-semibold text-lg mb-4">Shipping Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border-b border-border focus:outline-none focus:border-emerald-700 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border-b border-border focus:outline-none focus:border-emerald-700 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border-b border-border focus:outline-none focus:border-emerald-700 transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border-b border-border focus:outline-none focus:border-emerald-700 transition-colors"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border-b border-border focus:outline-none focus:border-emerald-700 transition-colors"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border-b border-border focus:outline-none focus:border-emerald-700 transition-colors"
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-b border-border focus:outline-none focus:border-emerald-700 transition-colors"
                        placeholder="Any special requests?"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-700 text-white px-6 py-3 rounded-lg hover:bg-emerald-800 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </motion.form>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-1"
            >
              <div className="sticky top-24 bg-card border border-border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-6">Order Summary</h2>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Your cart is empty</p>
                    <Link href="/products" className="text-emerald-700 hover:text-emerald-800">
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-border">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">Qty: {item.quantity}</p>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-muted-foreground hover:text-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 py-6 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-3">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </main>
  )
}
