'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function SolarBatteriesPage() {
  return (
    <Container className="pt-10 pb-16">
      <>
      <StickyHeadingBar title="Solar Batteries" />
      <p className="mt-3 mb-1 text-lg leading-8 text-gray-600 text-center">
        Phone controllable - Long Lasting - Environmental Friendly - high capacity solar batteries.
      </p>
      <div className="mt-6">
        <ProductGrid category="solar-batteries" />
      </div>
      </>
    </Container>
  )
}
