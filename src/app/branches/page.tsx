'use client'

import { useEffect, useState } from 'react'
import LoaderEV from '@/components/LoaderEV'
import StickyHeadingBar from '@/components/StickyHeadingBar'

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/branches')
        const result = await response.json()
        console.log('API Response:', result)
        if (result.success && Array.isArray(result.data)) {
          console.log('Setting branches:', result.data)
          setBranches(result.data)
        } else {
          console.error('Unexpected API response format:', result)
          setBranches([])
        }
      } catch (err) {
        console.error('Failed to fetch branches:', err)
        setError('Failed to load branches')
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderEV size={64} />
      </div>
    )
  }

  console.log('Rendering with branches:', branches)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <StickyHeadingBar title="Our Branches" />
          <p className="text-xl text-gray-600 mb-2 leading-relaxed mt-3">
            Wherever you are, our expert team is close to you with our best services.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 animate-fade-in">

          {branches.map((branch) => (
              <div
                key={branch.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-primary/20 hover:-translate-y-1"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                  {branch.name}
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start">
                    <svg
                      className="w-6 h-6 text-primary group-hover:scale-110 transition-transform mr-3 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {branch.address}
                  </p>
                  <p className="flex items-center group/phone hover:text-primary transition-colors">
                    <svg
                      className="w-6 h-6 text-primary group-hover:scale-110 transition-transform mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="hover:underline">{branch.phone}</span>
                  </p>
                  <p className="flex items-center group/email hover:text-primary transition-colors">
                    <svg
                      className="w-6 h-6 text-primary group-hover:scale-110 transition-transform mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="hover:underline">{branch.email}</span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
