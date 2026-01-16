"use client"

import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { motion } from "framer-motion"

export default function LogoCloud() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const logos = [
    "2go.png",
    "acienda.png",
    "acp.png",
    "acsp.png",
    "agx.png",
    "amia.png",
    "amsteel.png",
    "ansaldo.png",
    "apex.png",
    "arquee.png",
    "ausher.png",
    "bev.png",
    "bgcmm.png",
    "bonappeatea.png",
    "bonchon.png",
    "bounty.png",
    "caltex.png",
    "cayacon.png",
    "cbhs.png",
    "cmc.png",
    "davaodoc.png",
    "dlsub.png",
    "dlsum.png",
    "dutyfree.jpg",
    "eaglecement.png",
  ]

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-background overflow-hidden py-16 md:py-24"
    >
      <div className="group relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center md:flex-row gap-8">
          <motion.div variants={itemVariants} className="md:max-w-44 md:border-r md:border-border md:pr-6">
            <p className="text-end text-sm text-primary font-medium">Trusted by leading lighting brands</p>
          </motion.div>
          <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
              {logos.map((logo, index) => (
                <div key={index} className="flex">
                  <img
                    className="mx-auto h-5 w-fit opacity-70 hover:opacity-100 transition-opacity"
                    src={`/logos/${logo}`}
                    alt={logo.replace(/\.(png|jpg)$/, "")}
                    height="20"
                    width="auto"
                  />
                </div>
              ))}
            </InfiniteSlider>

            <div className="bg-gradient-to-r from-background absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-gradient-to-l from-background absolute inset-y-0 right-0 w-20"></div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
