'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function TriRidePage() {

  return (
    <Container className="pt-10 pb-16">
      <>
      <StickyHeadingBar title="TriRide" />
      <p className="mt-3 mb-1 text-lg leading-8 text-gray-600 text-center">
        Explore our innovative TriRide solutions for enhanced mobility.
      </p>
      <div className="mt-6">
        <ProductGrid category="triride" />
      </div>
      </>
    </Container>
  )
}
