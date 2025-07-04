'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function SolarPartsPage() {
  return (
    <Container className="pt-10 pb-16">
      <>
      <StickyHeadingBar title="Solar Parts" />
      <p className="mt-3 mb-1 text-lg leading-8 text-gray-600 text-center">
        Find all the solar components you need.
      </p>
      <div className="mt-6">
        <ProductGrid category="solar-parts" />
      </div>
      </>
    </Container>
  )
}
