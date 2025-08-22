'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function SolarPartsPage() {
  return (
    <Container className="pb-16 mt-0 pt-0">
      <>
      {/* Solar Parts page title ہٹا دیا گیا */}
      <div>
        <ProductGrid category="solar-parts" />
      </div>
      </>
    </Container>
  )
}
