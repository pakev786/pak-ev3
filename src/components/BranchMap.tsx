'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface Location {
  lat: number
  lng: number
}

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  location: Location
}

interface BranchMapProps {
  branches: Branch[]
}

export default function BranchMap({ branches }: BranchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([])

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
    })

    loader.load().then(() => {
      if (mapRef.current && branches.length > 0) {
        // Clear existing markers and info windows
        markersRef.current.forEach(marker => marker.setMap(null))
        infoWindowsRef.current.forEach(window => window.close())
        markersRef.current = []
        infoWindowsRef.current = []

        // Create map centered on the first branch
        const map = new google.maps.Map(mapRef.current, {
          center: branches[0].location,
          zoom: 6,
        })

        // Create bounds to fit all markers
        const bounds = new google.maps.LatLngBounds()

        // Add markers for each branch
        branches.forEach((branch) => {
          const marker = new google.maps.Marker({
            position: branch.location,
            map: map,
            title: branch.name,
          })

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold">${branch.name}</h3>
                <p class="text-sm text-gray-600">${branch.address}</p>
                <p class="text-sm text-gray-600">${branch.phone}</p>
              </div>
            `,
          })

          marker.addListener('click', () => {
            infoWindowsRef.current.forEach(window => window.close())
            infoWindow.open(map, marker)
          })

          markersRef.current.push(marker)
          infoWindowsRef.current.push(infoWindow)
          bounds.extend(branch.location)
        })

        // Fit map to show all markers
        if (branches.length > 1) {
          map.fitBounds(bounds)
        }
      } else if (mapRef.current) {
        // If no branches, show default map centered on Pakistan
        new google.maps.Map(mapRef.current, {
          center: { lat: 30.3753, lng: 69.3451 },
          zoom: 6,
        })
      }
    })
  }, [branches])

  return <div ref={mapRef} className="w-full h-full" />
}
