'use client'

import { Container } from '@/components/Container'
import ProductGrid from '@/components/ProductGrid'
import StickyHeadingBar from '@/components/StickyHeadingBar'

export default function EVKitsPage() {

  return (
    <Container className="pb-16 mt-0 pt-0">
      <>
      {/* EV Kits page title ہٹا دیا گیا */}
      <main className="min-h-screen mt-0 pt-0">
        <ProductGrid category="ev-kits" />
      </main>
      </>
    </Container>
  )
}
