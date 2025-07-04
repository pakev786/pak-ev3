'use client'

import React, { useState, useEffect } from 'react'

type ApplianceType = {
  id: string
  name: string
  wattage: number
}

const APPLIANCE_WATTAGES: { [key: string]: number } = {
  select: 0,
  // Fan types
  dc: 20,
  ac: 80,
  ceiling: 100,
  pedestal: 120,
  // Light types
  led5: 5,
  led7: 7,
  led9: 9,
  led12: 12,
  led15: 15,
  // TV types
  lcd32: 100,
  lcd40: 120,
  lcd50: 150,
  led32: 80,
  led40: 100,
  led50: 120,
  // Fridge types
  mini: 200,
  medium: 300,
  large: 400,
  // Washing Machine types
  automatic: 500,
  semiautomatic: 400,
  // Water Pump types
  pump0_5: 375,
  pump1: 750,
  // Computer types
  desktop: 200,
  gaming: 400,
  // Iron types
  regular: 1000,
  steam: 1200,
  // Split AC types
  ac1ton: 1200,
  ac1_5ton: 1800,
  ac2ton: 2400,
  // Inverter AC types
  inverter1ton: 1000,
  inverter1_5ton: 1500,
  inverter2ton: 2000,
  // Laptop types
  laptop13: 65,
  laptop15: 90,
  laptop17: 120,
  // Microwave types
  microwave20: 800,
  microwave25: 1000,
  microwave30: 1200,
  // Other types
  other: 0
}

const TIME_OPTIONS = [
  { value: 0.016666667, label: '1 Min' },
  { value: 0.033333333, label: '2 Min' },
  { value: 0.083333333, label: '5 Min' },
  { value: 0.166666667, label: '10 Min' },
  { value: 0.25, label: '15 Min' },
  { value: 0.5, label: '30 Min' },
  { value: 1, label: '1 Hr' },
  { value: 2, label: '2 Hrs' },
  { value: 3, label: '3 Hrs' },
  { value: 4, label: '4 Hrs' },
  { value: 5, label: '5 Hrs' },
  { value: 6, label: '6 Hrs' },
  { value: 7, label: '7 Hrs' },
  { value: 8, label: '8 Hrs' },
  { value: 9, label: '9 Hrs' },
  { value: 10, label: '10 Hrs' },
  { value: 12, label: '12 Hrs' },
  { value: 14, label: '14 Hrs' },
  { value: 16, label: '16 Hrs' },
  { value: 18, label: '18 Hrs' },
  { value: 20, label: '20 Hrs' },
  { value: 24, label: '24 Hrs' }
]

const BATTERY_VOLTAGES = [
  { value: 12, label: '12V Battery' },
  { value: 24, label: '24V Battery' },
  { value: 48, label: '48V Battery' },
  { value: 72, label: '72V Battery' }
]

export default function LoadCalculator() {
  const [totalWatts, setTotalWatts] = useState(0)
  const [totalKwh, setTotalKwh] = useState(0)
  const [batteryVoltage, setBatteryVoltage] = useState<number | null>(null)
  const [batteryResult, setBatteryResult] = useState('Please select battery voltage')

  const calculateTotal = (
    type: string,
    count: number,
    hours: number,
    wattage: number
  ) => {
    const total = wattage * count
    const dailyKwh = (total * hours) / 1000
    return { watts: total, kwh: dailyKwh }
  }

  const updateBatterySuggestion = () => {
    if (!batteryVoltage) {
      setBatteryResult('Please select battery voltage')
      return
    }

    // Convert kWh to Wh (multiply by 1000)
    const whPerDay = totalKwh * 1000
    // Calculate Amp-hours by dividing Wh by voltage
    const amphours = (whPerDay / batteryVoltage) * 1.2 // Adding 20% safety margin

    setBatteryResult(`Recommended Battery: ${Math.ceil(amphours)}Ah ${batteryVoltage}V`)
  }

  useEffect(() => {
    updateBatterySuggestion()
  }, [totalKwh, batteryVoltage])

  const ApplianceSection = ({ 
    title, 
    options 
  }: { 
    title: string
    options: { value: string; label: string; wattage: number }[]
  }) => {
    const [selectedType, setSelectedType] = useState('select')
    const [count, setCount] = useState(0)
    const [time, setTime] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
      const result = calculateTotal(
        selectedType,
        count,
        time,
        APPLIANCE_WATTAGES[selectedType]
      )
      setTotal(result.watts)
      
      // Update parent totals
      const allSections = document.querySelectorAll<HTMLElement>('.appliance-section')
      let totalWatts = 0
      let totalDailyKwh = 0
      
      allSections.forEach((section) => {
        const typeSelect = section.querySelector<HTMLSelectElement>('select')
        const countInput = section.querySelector<HTMLInputElement>('input')
        const timeSelect = section.querySelector<HTMLSelectElement>('.time-select')
        
        const type = typeSelect?.value || 'select'
        const count = parseInt(countInput?.value || '0')
        const time = parseFloat(timeSelect?.value || '1')
        const result = calculateTotal(type, count, time, APPLIANCE_WATTAGES[type])
        totalWatts += result.watts
        totalDailyKwh += result.kwh
      })
      
      setTotalWatts(totalWatts)
      setTotalKwh(totalDailyKwh)
    }, [selectedType, count, time])

    return (
      <div className="appliance-section mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {title}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border rounded-md"
              aria-label={`Select ${title} type`}
              title={`Select ${title} type`}
            >
              <option value="select">--Select {title}--</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full p-2 border rounded-md"
              aria-label={`${title} quantity`}
              title={`Enter ${title} quantity`}
              placeholder="Qty"
            />
          </div>
          
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usage Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(parseFloat(e.target.value))}
              className="w-full p-2 border rounded-md time-select"
              aria-label={`${title} usage time`}
              title={`Select ${title} usage time`}
            >
              {TIME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-32 text-right">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total
            </label>
            <div className="p-2 bg-gray-100 rounded-md">
              {total} Watts
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid gap-6">
        <ApplianceSection
          title="Fan"
          options={[
            { value: 'dc', label: 'DC Fan', wattage: APPLIANCE_WATTAGES.dc },
            { value: 'ac', label: 'AC Fan', wattage: APPLIANCE_WATTAGES.ac },
            { value: 'ceiling', label: 'Ceiling Fan', wattage: APPLIANCE_WATTAGES.ceiling },
            { value: 'pedestal', label: 'Pedestal Fan', wattage: APPLIANCE_WATTAGES.pedestal }
          ]}
        />

        <ApplianceSection
          title="Light"
          options={[
            { value: 'led5', label: '5W LED', wattage: APPLIANCE_WATTAGES.led5 },
            { value: 'led7', label: '7W LED', wattage: APPLIANCE_WATTAGES.led7 },
            { value: 'led9', label: '9W LED', wattage: APPLIANCE_WATTAGES.led9 },
            { value: 'led12', label: '12W LED', wattage: APPLIANCE_WATTAGES.led12 },
            { value: 'led15', label: '15W LED', wattage: APPLIANCE_WATTAGES.led15 }
          ]}
        />

        <ApplianceSection
          title="TV"
          options={[
            { value: 'lcd32', label: '32" LCD TV', wattage: APPLIANCE_WATTAGES.lcd32 },
            { value: 'lcd40', label: '40" LCD TV', wattage: APPLIANCE_WATTAGES.lcd40 },
            { value: 'lcd50', label: '50" LCD TV', wattage: APPLIANCE_WATTAGES.lcd50 },
            { value: 'led32', label: '32" LED TV', wattage: APPLIANCE_WATTAGES.led32 },
            { value: 'led40', label: '40" LED TV', wattage: APPLIANCE_WATTAGES.led40 },
            { value: 'led50', label: '50" LED TV', wattage: APPLIANCE_WATTAGES.led50 }
          ]}
        />

        <ApplianceSection
          title="Refrigerator"
          options={[
            { value: 'mini', label: 'Mini Fridge', wattage: APPLIANCE_WATTAGES.mini },
            { value: 'medium', label: 'Medium Fridge', wattage: APPLIANCE_WATTAGES.medium },
            { value: 'large', label: 'Large Fridge', wattage: APPLIANCE_WATTAGES.large }
          ]}
        />

        <ApplianceSection
          title="Washing Machine"
          options={[
            { value: 'automatic', label: 'Automatic', wattage: APPLIANCE_WATTAGES.automatic },
            { value: 'semiautomatic', label: 'Semi-Automatic', wattage: APPLIANCE_WATTAGES.semiautomatic }
          ]}
        />

        <ApplianceSection
          title="Water Pump"
          options={[
            { value: 'pump0_5', label: '0.5 HP Pump', wattage: APPLIANCE_WATTAGES.pump0_5 },
            { value: 'pump1', label: '1.0 HP Pump', wattage: APPLIANCE_WATTAGES.pump1 }
          ]}
        />

        <ApplianceSection
          title="Computer"
          options={[
            { value: 'desktop', label: 'Desktop PC', wattage: APPLIANCE_WATTAGES.desktop },
            { value: 'gaming', label: 'Gaming PC', wattage: APPLIANCE_WATTAGES.gaming }
          ]}
        />

        <ApplianceSection
          title="Iron"
          options={[
            { value: 'regular', label: 'Regular Iron', wattage: APPLIANCE_WATTAGES.regular },
            { value: 'steam', label: 'Steam Iron', wattage: APPLIANCE_WATTAGES.steam }
          ]}
        />

        <ApplianceSection
          title="Split AC"
          options={[
            { value: 'ac1ton', label: '1.0 Ton AC', wattage: APPLIANCE_WATTAGES.ac1ton },
            { value: 'ac1_5ton', label: '1.5 Ton AC', wattage: APPLIANCE_WATTAGES.ac1_5ton },
            { value: 'ac2ton', label: '2.0 Ton AC', wattage: APPLIANCE_WATTAGES.ac2ton }
          ]}
        />

        <ApplianceSection
          title="Inverter AC"
          options={[
            { value: 'inverter1ton', label: '1.0 Ton Inverter AC', wattage: APPLIANCE_WATTAGES.inverter1ton },
            { value: 'inverter1_5ton', label: '1.5 Ton Inverter AC', wattage: APPLIANCE_WATTAGES.inverter1_5ton },
            { value: 'inverter2ton', label: '2.0 Ton Inverter AC', wattage: APPLIANCE_WATTAGES.inverter2ton }
          ]}
        />

        <ApplianceSection
          title="Laptop"
          options={[
            { value: 'laptop13', label: '13" Laptop', wattage: APPLIANCE_WATTAGES.laptop13 },
            { value: 'laptop15', label: '15" Laptop', wattage: APPLIANCE_WATTAGES.laptop15 },
            { value: 'laptop17', label: '17" Laptop', wattage: APPLIANCE_WATTAGES.laptop17 }
          ]}
        />

        <ApplianceSection
          title="Microwave"
          options={[
            { value: 'microwave20', label: '20L Microwave', wattage: APPLIANCE_WATTAGES.microwave20 },
            { value: 'microwave25', label: '25L Microwave', wattage: APPLIANCE_WATTAGES.microwave25 },
            { value: 'microwave30', label: '30L Microwave', wattage: APPLIANCE_WATTAGES.microwave30 }
          ]}
        />

        <div className="mt-8 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Total Load</h3>
              <div className="text-2xl font-bold">{totalWatts} Watts</div>
              <div className="text-lg mt-2">{totalKwh.toFixed(2)} kWh/day</div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Battery Recommendation</h3>
              <select
                value={batteryVoltage || ''}
                onChange={(e) => setBatteryVoltage(parseInt(e.target.value))}
                className="w-full p-2 mb-4 text-gray-900 rounded-md"
                aria-label="Battery voltage"
                title="Select battery voltage"
              >
                <option value="">--Select Battery Voltage--</option>
                {BATTERY_VOLTAGES.map((voltage) => (
                  <option key={voltage.value} value={voltage.value}>
                    {voltage.label}
                  </option>
                ))}
              </select>
              <div className="text-lg">{batteryResult}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
