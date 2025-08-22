'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function EVPartsPage() {
  return (
    <Container className="pb-16 mt-0 pt-0">
      <>
      {/* EV Parts page title ہٹا دیا گیا */}
      <div>
        <ProductGrid category="ev-parts" />
      </div>
      </>
    </Container>
  )
}
