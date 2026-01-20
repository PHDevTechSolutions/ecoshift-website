'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import BackToTop from '@/components/back-to-top'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Phone, Mail, Clock, MapPin } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const branches = [
  {
    id: 'mandaluyong',
    name: 'Mandaluyong',
    address: 'Suite 405, J&L Building, 251 Epifanio de los Santos Ave, Mandaluyong, Metro Manila',
    phone: '(02) 7123-4567',
    email: 'manila@lightingcorp.com',
    hours: 'Monday to Saturday - 8:00AM to 5:00PM',
    latitude: 14.5847,
    longitude: 121.0176,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.0234567890!2d121.0176!3d14.5847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7c5c5c5c5c5%3A0xc5c5c5c5c5c5c5c5!2sEcoshift%20Corporation!5e0!3m2!1sen!2sph!4v1234567890123',
  },
  {
    id: 'davao',
    name: 'Davao',
    address: 'Saavedra Bldg., No.3 Pag-Asa Village, Davao City, Matina Aplaya',
    phone: '(082) 321-0987',
    email: 'davao@lightingcorp.com',
    hours: 'Monday to Saturday - 8:00AM to 5:00PM',
    latitude: 7.0731,
    longitude: 125.6121,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.0234567890!2d125.6121!3d7.0731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c5c5c5c5c5c5%3A0xc5c5c5c5c5c5c5c5!2sDavao!5e0!3m2!1sen!2sph!4v1234567890124',
  },
  {
    id: 'cagayan',
    name: 'Cagayan De Oro',
    address: 'Warehouse # 29, Alwana business park, Cugman, Cagayan de Oro, 9000 Misamis Oriental',
    phone: '(088) 856-1234',
    email: 'cdo@lightingcorp.com',
    hours: 'Monday to Saturday - 8:00AM to 5:00PM',
    latitude: 8.4917,
    longitude: 124.6289,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3863.0234567890!2d124.6289!3d8.4917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d5c5c5c5c5c5%3A0xc5c5c5c5c5c5c5c5!2sCagayan!5e0!3m2!1sen!2sph!4v1234567890125',
  },
  {
    id: 'cebu',
    name: 'Cebu',
    address: 'Unit 7A, Zuellig Avenue Street, Mandaue Reclamation Area, Mandaue City',
    phone: '(032) 505-2200',
    email: 'cebu@lightingcorp.com',
    hours: 'Monday to Saturday - 8:00AM to 5:00PM',
    latitude: 10.3157,
    longitude: 123.9854,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3864.0234567890!2d123.9854!3d10.3157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397e5c5c5c5c5c5%3A0xc5c5c5c5c5c5c5c5!2sCebu!5e0!3m2!1sen!2sph!4v1234567890126',
  },
]

export default function BranchesPage() {
  const [selectedBranch, setSelectedBranch] = useState('manila')
  const currentBranch = branches.find((b) => b.id === selectedBranch) || branches[0]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32">
        {/* Hero */}
        <section className="py-12 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ LOCATIONS</span>
              <h1 className="font-serif text-5xl md:text-6xl mt-4 mb-6 leading-tight">Our Branches</h1>
              <p className="text-muted-foreground text-lg">
                Visit us at any of our locations across the Philippines for professional lighting solutions and expert consultation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Branches Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Tabs */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <Tabs value={selectedBranch} onValueChange={setSelectedBranch} className="w-full">
                  <TabsList className="flex flex-col w-full h-auto gap-2 bg-transparent p-0">
                    {branches.map((branch) => (
                      <TabsTrigger
                        key={branch.id}
                        value={branch.id}
                        className="w-full text-left px-4 py-3 rounded-lg border border-border data-[state=active]:border-emerald-700 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 hover:border-emerald-700/50 transition-all duration-200 font-medium"
                      >
                        {branch.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </motion.div>

              {/* Map and Details */}
              <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                {/* Map */}
                <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-96">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={currentBranch.mapEmbed}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>

                {/* Details Card */}
                <motion.div
                  key={currentBranch.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-6 bg-card border border-border rounded-2xl p-8"
                >
                  {/* Address */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</p>
                        <p className="text-sm font-medium mt-1">{currentBranch.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</p>
                        <a href={`mailto:${currentBranch.email}`} className="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors mt-1">
                          {currentBranch.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</p>
                        <a href={`tel:${currentBranch.phone}`} className="text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors mt-1">
                          {currentBranch.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Hours</p>
                        <p className="text-sm font-medium mt-1">{currentBranch.hours}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
      <BackToTop />
    </main>
  )
}
