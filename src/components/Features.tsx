'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BoltIcon, UserGroupIcon, UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

type Feature = {
  title: string
  description: string
  icon: React.ElementType
}

const features: Feature[] = [
  {
    title: 'High Efficiency',
    description: 'Experience maximum energy output with our advanced lithium battery – delivering consistent performance and faster charging every time.',
    icon: BoltIcon,
  },
  {
    title: 'Best Services',
    description: 'We provide unmatched customer support and tailored energy solutions to meet your needs with excellence and efficiency.',
    icon: UserGroupIcon,
  },
  {
    title: 'Expert Team',
    description: 'Our team of skilled professionals is dedicated to delivering top-notch solutions and reliable support every step of the way.',
    icon: UsersIcon,
  },
  {
    title: 'Safety First',
    description: 'Built-in protection features ensure safe operation, preventing overcharging, overheating, and short circuits for total peace of mind.',
    icon: ShieldCheckIcon,
  },
]

const Features: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.h2
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            Why Choose Us
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            Experience the future of electric vehicle charging with our advanced technology
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.15 * index, ease: 'easeOut' }}
            >
              <div className="transform transition-transform duration-300 hover:scale-105">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
