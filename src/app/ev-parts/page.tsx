'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function EVPartsPage() {
  return (
    <Container className="pt-10 pb-16">
      <>
      <StickyHeadingBar title="EV Parts" />
      <p className="mt-3 mb-1 text-lg leading-8 text-gray-600 text-center">
        Browse our selection of high-quality EV parts and components.
      </p>
      <div className="mt-6">
        <ProductGrid category="ev-parts" />
      </div>
      </>
    </Container>
  )
}
