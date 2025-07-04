'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function EVBatteriesPage() {
  return (
    <Container className="pt-10 pb-16">
      <>

      <StickyHeadingBar title="EV Batteries" />
      <p className="mt-3 mb-1 text-lg leading-8 text-gray-600 whitespace-nowrap text-center">
        Elevate your drive with a sustainable EV battery — where performance meets a greener tomorrow.
      </p>
      <div className="mt-6">
        <ProductGrid category="ev-batteries" />
      </div>
      </>
    </Container>
  )
}
