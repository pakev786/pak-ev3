'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from './Container'
import HeroSlider from './HeroSlider'

type HeroProps = {
  title?: string
  subtitle?: string
}

const Hero: React.FC<HeroProps> = ({
  title = 'Pak EV - Electric Vehicle Solutions',
  subtitle = 'Powering the future of transportation with innovative EV charging solutions.'
}) => {
  return (
    <section className="relative">
      {/* Hero Image Slider */}
      <HeroSlider />

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 bg-black/40">
        <Container className="h-full flex flex-col justify-center">
          <div>


          </div>
        </Container>
      </div>
    </section>
  )
}

export default Hero
