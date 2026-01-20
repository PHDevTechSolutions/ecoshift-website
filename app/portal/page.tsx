'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut, updatePassword } from 'firebase/auth'
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { LayoutDashboard, FileText, Settings, LogOut, ChevronRight, Clock, ExternalLink, Lock, Eye, EyeOff, Menu, X, Package, Calendar, User, Home } from 'lucide-react'

export default function PortalPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null)

  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inquiries, setInquiries] = useState<any[]>([])
  const [inquiriesLoading, setInquiriesLoading] = useState(false)
  const [email, setEmail] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState({ loading: false, message: '', error: false })

  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

  const fetchInquiriesByEmail = async (targetEmail: string) => {
    setInquiriesLoading(true)
    try {
      const q = query(
        collection(db, 'inquiries'),
        where('customerDetails.email', '==', targetEmail),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      setInquiries(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err: any) {
      console.error('Fetch Error:', err.message)
    } finally {
      setInquiriesLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email || '')
        const docSnap = await getDoc(doc(db, 'users', user.uid))
        setUserData(docSnap.exists() ? docSnap.data() : { fullName: user.displayName || 'User' })
        if (user.email) fetchInquiriesByEmail(user.email)
        setLoading(false)
      } else {
        router.push('/portal/auth')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setUpdatingStatus({ loading: false, message: 'Password must be at least 6 characters.', error: true })
      return
    }
    setUpdatingStatus({ loading: true, message: '', error: false })
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword)
        setUpdatingStatus({ loading: false, message: 'Password updated successfully!', error: false })
        setNewPassword('')
      }
    } catch (err: any) {
      setUpdatingStatus({ loading: false, message: 'Security measure: Please re-login.', error: true })
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('lighting_user_session')
      router.push('/')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full" />
        </motion.div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Syncing System...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans overflow-hidden relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-50 h-screen transition-all duration-300 border-r border-border bg-card flex flex-col
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 w-64'}
        lg:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between border-b border-border">
          <h2 className="font-serif text-xl font-black italic tracking-tighter text-foreground">
            Lighting <span className="text-emerald-700">Portal</span>
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-muted-foreground hover:bg-secondary hover:text-foreground mb-4 border border-border group"
          >
            <Home size={18} className="group-hover:text-emerald-700 transition-colors" />
            <span className="text-xs font-semibold uppercase tracking-wider">Back to Main</span>
          </button>

          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => {setActiveTab('overview'); setSidebarOpen(false);}} />
          <NavItem icon={FileText} label="Inquiries" active={activeTab === 'inquiries'} onClick={() => {setActiveTab('inquiries'); setSidebarOpen(false);}} />
          <NavItem icon={Settings} label="Security" active={activeTab === 'settings'} onClick={() => {setActiveTab('settings'); setSidebarOpen(false);}} />
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 text-muted-foreground hover:text-emerald-700 w-full p-3 transition-colors">
            <LogOut size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 active:scale-95 transition-all"
            >
              <Menu size={20}/>
            </button>
            
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="hidden sm:inline">Portal</span> 
              <ChevronRight size={12} className="hidden sm:inline" /> 
              <span className="text-foreground">{activeTab}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">System Time</p>
              <p className="text-xs font-mono text-emerald-700 font-semibold">{formattedTime}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <User size={16} className="text-emerald-700" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <h1 className="text-4xl font-serif font-black italic tracking-tight">
                  Welcome, <span className="text-emerald-700">{userData?.fullName?.split(' ')[0]}</span>
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard label="Account Email" value={email} trend="Verified" />
                  <StatCard label="My Requests" value={inquiries.length} trend="Total Records" />
                  <StatCard label="Access Level" value="Authorized" trend="Standard Client" />
                </div>
              </motion.div>
            )}

            {activeTab === 'inquiries' && (
              <motion.div key="qt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h2 className="text-2xl font-serif font-black italic tracking-tight text-emerald-700">Inquiry History</h2>
                {inquiriesLoading ? (
                  <div className="py-20 text-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-700 rounded-full mx-auto" /></div>
                ) : inquiries.length === 0 ? (
                  <div className="py-20 text-center bg-secondary/30 rounded-2xl border border-dashed border-border text-muted-foreground uppercase text-xs font-semibold">No Records Found</div>
                ) : (
                  <div className="grid gap-4">
                    {inquiries.map((inq) => (
                      <motion.div 
                        key={inq.id} 
                        onClick={() => setSelectedInquiry(inq)}
                        whileHover={{ y: -2 }}
                        className="bg-card border border-border p-6 rounded-2xl group cursor-pointer hover:border-emerald-700/30 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="space-y-3">
                            <span className="text-xs font-bold bg-emerald-700 text-white px-3 py-1 rounded-full uppercase inline-block">{inq.status || 'Pending'}</span>
                            <h4 className="text-lg font-black uppercase">#{inq.id.slice(-6).toUpperCase()}</h4>
                          </div>
                          <div className="sm:text-right flex flex-row sm:flex-col justify-between items-end">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">{inq.createdAt?.toDate?.().toLocaleDateString?.()}</p>
                            <button className="text-xs font-bold uppercase text-emerald-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                              Open Details <ExternalLink size={12}/>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="st" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-xl space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-black italic tracking-tight text-emerald-700">Security Settings</h2>
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mt-2">Manage your account access</p>
                </div>
                <form onSubmit={handleUpdatePassword} className="bg-card border border-border p-8 rounded-2xl space-y-6">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Lock size={12}/> New Security Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="MINIMUM 6 CHARACTERS"
                        className="w-full bg-secondary/50 border border-border rounded-lg py-3 px-4 text-sm font-medium outline-none focus:border-emerald-700 transition-all"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={updatingStatus.loading}
                    className="w-full bg-emerald-700 text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-all disabled:opacity-50"
                  >
                    {updatingStatus.loading ? 'Updating...' : 'Save New Password'}
                  </button>
                  {updatingStatus.message && (
                    <p className={`text-xs font-bold uppercase text-center p-3 rounded-lg ${updatingStatus.error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {updatingStatus.message}
                    </p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                <div>
                  <span className="text-xs font-bold bg-emerald-700 text-white px-3 py-1 rounded-full uppercase mb-2 inline-block">
                    {selectedInquiry.status || 'Processing'}
                  </span>
                  <h3 className="text-2xl font-serif font-black italic tracking-tight">Inquiry Details</h3>
                </div>
                <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Requested Items</p>
                  <div className="grid gap-3">
                    {selectedInquiry.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-secondary/30 p-4 rounded-lg border border-border">
                        <div className="w-16 h-16 rounded-lg bg-secondary shrink-0" />
                        <div className="flex-1">
                          <h5 className="text-xs font-bold uppercase">{item.name || 'Product'}</h5>
                          <p className="text-xs text-muted-foreground font-medium uppercase mt-1">Qty: {item.quantity || 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2"><Calendar size={12}/> <span className="text-xs font-bold uppercase">Date Filed</span></div>
                    <p className="text-xs font-semibold">{selectedInquiry.createdAt?.toDate?.().toLocaleDateString?.()}</p>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2"><Package size={12}/> <span className="text-xs font-bold uppercase">Ref ID</span></div>
                    <p className="text-xs font-semibold">#{selectedInquiry.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group ${
        active ? 'bg-emerald-700 text-white' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
    >
      <Icon size={18} className="shrink-0" />
      <span className="text-xs font-bold uppercase tracking-wider text-left">{label}</span>
      {active && (
        <motion.div layoutId="navIndicator" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
      )}
    </button>
  )
}

function StatCard({ label, value, trend }: any) {
  return (
    <div className="bg-card border border-border p-6 rounded-2xl group relative overflow-hidden">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{label}</p>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-2 text-xs font-semibold text-emerald-700 uppercase flex items-center gap-2">
        <Clock size={12} /> {trend}
      </div>
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />
    </div>
  )
}
