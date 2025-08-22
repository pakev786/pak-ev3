'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function EVBatteriesPage() {
  return (
    <Container className="pt-10 pb-16">
      <>

      {/* EV Batteries page title ہٹا دیا گیا */}
      <div className="mt-6">
        <ProductGrid category="ev-batteries" />
      </div>
      </>
    </Container>
  )
}
