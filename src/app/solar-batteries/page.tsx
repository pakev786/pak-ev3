'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function SolarBatteriesPage() {
  return (
    <Container className="pb-16 mt-0 pt-0">
      <>
      <StickyHeadingBar title="Solar Batteries" />
      <p className="mt-3 mb-1 text-lg leading-8 text-gray-600 text-center">
        Phone controllable - Long Lasting - Environmental Friendly - high capacity solar batteries.
      </p>
      <div>
        <ProductGrid category="solar-batteries" />
      </div>
      </>
    </Container>
  )
}
