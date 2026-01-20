'use client'

import React from "react"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Lock, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function PortalAuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        localStorage.setItem(
          'lighting_user_session',
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            lastLogin: new Date().toISOString(),
          })
        )
        router.push('/portal')
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await updateProfile(user, { displayName: fullName })
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          fullName: fullName,
          email: email,
          role: 'customer',
          createdAt: new Date().toISOString(),
        })
        localStorage.setItem(
          'lighting_user_session',
          JSON.stringify({
            uid: user.uid,
            email: email,
            displayName: fullName,
            createdAt: new Date().toISOString(),
          })
        )
        router.push('/portal')
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-email') {
        setError('Invalid email address. Please check for spaces.')
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid credentials. Please try again.')
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please login or try another email.')
      } else {
        setError(err.message || 'An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Link
        href="/"
        className="absolute top-10 left-10 flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-black uppercase tracking-tighter mb-3">
            Portal <span className="text-emerald-700">Access</span>
          </h1>
          <p className="text-muted-foreground text-sm">{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        <motion.div
          className="bg-card border border-border rounded-2xl p-8 shadow-sm"
          whileInView={{ y: 0, opacity: 1 }}
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-border px-4 py-3 pl-12 text-sm font-medium placeholder:text-muted-foreground outline-none focus:border-emerald-700 transition-colors"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                    className="w-full bg-transparent border-b border-border px-4 py-3 pl-12 text-sm font-medium placeholder:text-muted-foreground outline-none focus:border-emerald-700 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-muted-foreground" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-border px-4 py-3 pl-12 text-sm font-medium placeholder:text-muted-foreground outline-none focus:border-emerald-700 transition-colors"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-emerald-700 text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-800 disabled:opacity-50 transition-colors mt-8"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setEmail('')
                setPassword('')
                setFullName('')
              }}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
