'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function EVKitsPage() {

  return (
    <Container className="pt-10 pb-16">
      <>
      <StickyHeadingBar title="EV Kits" />
      <p className="mt-3 mb-1 text-lg leading-8 text-gray-600 text-center">
        Complete EV conversion kits for your vehicle transformation needs.
      </p>
      <div className="mt-6">
        <ProductGrid category="ev-kits" />
      </div>
      </>
    </Container>
  )
}
