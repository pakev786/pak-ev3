'use client'

import React, { useState, useEffect } from 'react'

type MotorKit = {
  power: string
  price: number
}

type Battery = {
  specs: string
  price: number
}

type Charger = {
  specs: string
  price: number
}

const MOTOR_KITS: { [key: string]: MotorKit[] } = {
  'CD 70': [
    { power: '500w', price: 35000 },
    { power: '1000w', price: 45000 },
    { power: '1500w', price: 55000 }
  ],
  'CG 125': [
    { power: '1000w', price: 45000 },
    { power: '1500w', price: 55000 },
    { power: '2000w', price: 65000 }
  ],
  'YBR 125': [
    { power: '1000w', price: 45000 },
    { power: '1500w', price: 55000 },
    { power: '2000w', price: 65000 }
  ],
  'CB 150': [
    { power: '1500w', price: 55000 },
    { power: '2000w', price: 65000 },
    { power: '2000w Alloy rim', price: 75000 }
  ],
  'CB 250': [
    { power: '2000w', price: 65000 },
    { power: '2000w Alloy rim', price: 75000 },
    { power: '3000w Alloy rim', price: 85000 }
  ],
  'CB 300': [
    { power: '2000w Alloy rim', price: 75000 },
    { power: '3000w Alloy rim', price: 85000 },
    { power: '4000w Alloy rim', price: 95000 }
  ]
}

const BATTERIES: Battery[] = [
  // 48V Batteries
  { specs: '48v 10Ah', price: 30000 },
  { specs: '48v 15Ah', price: 35000 },
  { specs: '48v 20Ah', price: 40000 },
  { specs: '48v 25Ah', price: 45000 },
  { specs: '48v 30Ah', price: 50000 },
  { specs: '48v 35Ah', price: 55000 },
  { specs: '48v 40Ah', price: 60000 },
  { specs: '48v 45Ah', price: 65000 },
  { specs: '48v 50Ah', price: 70000 },
  // 60V Batteries
  { specs: '60v 25Ah', price: 50000 },
  { specs: '60v 30Ah', price: 55000 },
  { specs: '60v 35Ah', price: 60000 },
  { specs: '60v 40Ah', price: 65000 },
  { specs: '60v 45Ah', price: 70000 },
  { specs: '60v 50Ah', price: 75000 },
  { specs: '60v 60Ah', price: 85000 },
  { specs: '60v 70Ah', price: 95000 },
  { specs: '60v 80Ah', price: 105000 },
  // 72V Batteries
  { specs: '72v 30Ah', price: 60000 },
  { specs: '72v 35Ah', price: 65000 },
  { specs: '72v 40Ah', price: 70000 },
  { specs: '72v 50Ah', price: 80000 },
  { specs: '72v 60Ah', price: 90000 },
  { specs: '72v 70Ah', price: 100000 },
  { specs: '72v 80Ah', price: 110000 }
]

const CHARGERS = [
  { specs: '3A', price: 3000 },
  { specs: '5A', price: 4000 },
  { specs: '10A', price: 6000 },
  { specs: '15A', price: 8000 },
  { specs: '20A', price: 10000 }
]

export default function EVCalculator() {
  const [selectedBike, setSelectedBike] = useState('')
  const [selectedMotor, setSelectedMotor] = useState<MotorKit | null>(null)
  const [selectedBattery, setSelectedBattery] = useState<Battery | null>(null)
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)
  const [batteryBox, setBatteryBox] = useState('-')
  const [fittingCharges, setFittingCharges] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const calculateFittingCharges = (motorPower: string) => {
    if (motorPower === '500w') return 7000
    if (['1000w', '1500w', '2000w'].includes(motorPower)) return 10000
    if (['2000w Alloy rim', '3000w Alloy rim'].includes(motorPower)) return 12000
    if (motorPower === '4000w Alloy rim') return 15000
    return 0
  }

  const calculateBatteryBox = (batterySpecs: string) => {
    const [voltage, capacity] = batterySpecs.split(' ')
    const ah = parseInt(capacity)

    if (voltage === '48v') {
      if (ah >= 10 && ah <= 40) return 'Rs. 5,000/-'
      if (ah >= 45 && ah <= 50) return 'Rs. 6,000/-'
    } else if (voltage === '60v') {
      if (ah >= 25 && ah <= 40) return 'Rs. 6,000/-'
      if (ah >= 45 && ah <= 60) return 'Rs. 7,000/-'
      if (ah === 70) return 'Rs. 8,000/-'
      if (ah === 80) return 'Rs. 9,000/-'
    } else if (voltage === '72v') {
      if (ah >= 30 && ah <= 35) return 'Rs. 6,000/-'
      if (ah >= 40 && ah <= 50) return 'Rs. 7,000/-'
      if (ah === 60) return 'Rs. 8,000/-'
      if (ah === 70) return 'Rs. 9,000/-'
      if (ah === 80) return 'Rs. 10,000/-'
    }
    return '-'
  }

  useEffect(() => {
    if (selectedMotor && selectedBattery && selectedCharger) {
      const fitting = calculateFittingCharges(selectedMotor.power)
      setFittingCharges(fitting)
      setBatteryBox(calculateBatteryBox(selectedBattery.specs))
      setTotalPrice(selectedMotor.price + selectedBattery.price + selectedCharger.price + fitting)
    } else {
      setFittingCharges(0)
      setBatteryBox('-')
      setTotalPrice(0)
    }
  }, [selectedMotor, selectedBattery, selectedCharger])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Bike Selection */}
        <div>
          <label htmlFor="bikeSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Bike
          </label>
          <select
            id="bikeSelect"
            value={selectedBike}
            onChange={(e) => {
              setSelectedBike(e.target.value)
              setSelectedMotor(null)
            }}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            aria-label="Select your bike model"
            title="Choose your bike model"
          >
            <option value="">Select Bike</option>
            {Object.keys(MOTOR_KITS).map((bike) => (
              <option key={bike} value={bike}>
                {bike}
              </option>
            ))}
          </select>
        </div>

        {/* Motor Kit Selection */}
        <div>
          <label htmlFor="motorSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Motor Kit
          </label>
          <select
            id="motorSelect"
            value={selectedMotor ? JSON.stringify(selectedMotor) : ''}
            onChange={(e) => setSelectedMotor(e.target.value ? JSON.parse(e.target.value) : null)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            disabled={!selectedBike}
            aria-label="Select motor kit"
            title="Choose motor kit power and type"
          >
            <option value="">Select Motor Kit</option>
            {selectedBike &&
              MOTOR_KITS[selectedBike].map((motor) => (
                <option key={motor.power} value={JSON.stringify(motor)}>
                  {motor.power} - Rs. {motor.price.toLocaleString()}/-
                </option>
              ))}
          </select>
        </div>

        {/* Battery Selection */}
        <div>
          <label htmlFor="batterySelect" className="block text-sm font-medium text-gray-700 mb-2">
            Battery
          </label>
          <select
            id="batterySelect"
            value={selectedBattery ? JSON.stringify(selectedBattery) : ''}
            onChange={(e) => setSelectedBattery(e.target.value ? JSON.parse(e.target.value) : null)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            aria-label="Select battery"
            title="Choose battery specifications"
          >
            <option value="">Select Battery</option>
            {BATTERIES.map((battery) => (
              <option key={battery.specs} value={JSON.stringify(battery)}>
                {battery.specs} - Rs. {battery.price.toLocaleString()}/-
              </option>
            ))}
          </select>
        </div>

        {/* Charger Selection */}
        <div>
          <label htmlFor="chargerSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Charger
          </label>
          <select
            id="chargerSelect"
            value={selectedCharger ? JSON.stringify(selectedCharger) : ''}
            onChange={(e) => setSelectedCharger(e.target.value ? JSON.parse(e.target.value) : null)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            aria-label="Select charger"
            title="Choose charger specifications"
          >
            <option value="">Select Charger</option>
            {CHARGERS.map((charger) => (
              <option key={charger.specs} value={JSON.stringify(charger)}>
                {charger.specs} - Rs. {charger.price.toLocaleString()}/-
              </option>
            ))}
          </select>
        </div>

        {/* Battery Box */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Battery Box</span>
            <span className="text-sm font-semibold text-gray-900">{batteryBox}</span>
          </div>
        </div>

        {/* Fitting Charges */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Fitting Charges</span>
            <span className="text-sm font-semibold text-gray-900">
              {fittingCharges ? `Rs. ${fittingCharges.toLocaleString()}/-` : '-'}
            </span>
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-primary text-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total Price (Including Fitting)</span>
            <span className="text-xl font-bold">
              {totalPrice ? `Rs. ${totalPrice.toLocaleString()}/-` : 'Select options above'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
