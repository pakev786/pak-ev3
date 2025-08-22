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
  // سیکشن مکمل طور پر خالی کر دیا گیا ہے (ہوم پیج سے فیچرز اور ٹیکسٹ ہٹا دیے گئے)
  return null;
};

export default Features;
