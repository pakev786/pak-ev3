import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const MOTOR_KITS = {
  "70": [
      { name: "500w Front Wheel (Speed 40km/h)", power: "500w", price: 35000 },
      { name: "1000w (Speed 55km/h)", power: "1000w", price: 49000 },
      { name: "1500w (Speed 70km/h)", power: "1500w", price: 61000 },
      { name: "2000w (Speed 80km/h)", power: "2000w", price: 72000 },
      { name: "2000w Alloy rim (Speed 90km/h)", power: "2000w Alloy rim", price: 110000 }
  ],
  "100": [
      { name: "1500w (Speed 70km/h)", power: "1500w", price: 61000 },
      { name: "2000w (Speed 80km/h)", power: "2000w", price: 72000 },
      { name: "2000w Alloy rim (Speed 90km/h)", power: "2000w Alloy rim", price: 110000 },
      { name: "3000w Alloy rim (Speed 120km/h)", power: "3000w Alloy rim", price: 130000 }
  ],
  "110": [
      { name: "2000w (Speed 80km/h)", power: "2000w", price: 72000 },
      { name: "2000w Alloy rim (Speed 90km/h)", power: "2000w Alloy rim", price: 110000 },
      { name: "3000w Alloy rim (Speed 120km/h)", power: "3000w Alloy rim", price: 130000 }
  ],
  "125": [
      { name: "2000w (Speed 80km/h)", power: "2000w", price: 72000 },
      { name: "2000w Alloy rim (Speed 90km/h)", power: "2000w Alloy rim", price: 110000 },
      { name: "3000w Alloy rim (Speed 120km/h)", power: "3000w Alloy rim", price: 130000 }
  ],
  "150": [
      { name: "2000w Alloy rim (Speed 90km/h)", power: "2000w Alloy rim", price: 110000 },
      { name: "3000w Alloy rim (Speed 120km/h)", power: "3000w Alloy rim", price: 130000 },
      { name: "4000w Alloy rim (Speed 150km/h)", power: "4000w Alloy rim", price: 155000 }
  ],
  "200": [
      { name: "3000w Alloy rim (Speed 120km/h)", power: "3000w Alloy rim", price: 135000 },
      { name: "4000w Alloy rim (Speed 150km/h)", power: "4000w Alloy rim", price: 160000 }
  ]
};

const BATTERY_OPTIONS = {
  "500w": [
      { specs: "48v 15Ah", range: "30km/Charge", price: 34000 },
      { specs: "48v 20Ah", range: "40km/Charge", price: 43000 },
      { specs: "48v 25Ah", range: "50km/Charge", price: 54000 },
      { specs: "48v 30Ah", range: "65km/Charge", price: 62000 },
      { specs: "48v 40Ah", range: "90km/Charge", price: 79000 },
      { specs: "63v 20Ah", range: "50km/Charge", price: 52000 },
      { specs: "63v 25Ah", range: "75km/Charge", price: 66000 },
      { specs: "63v 30Ah", range: "95km/Charge", price: 77000 },
      ],
  "1000w": [
      { specs: "63v 20Ah", range: "55km/Charge", price: 52000 },
      { specs: "63v 25Ah", range: "70km/Charge", price: 66000 },
      { specs: "63v 30Ah", range: "90km/Charge", price: 77000 },
      { specs: "63v 40Ah", range: "110km/Charge", price: 100000 },
      { specs: "63v 50Ah", range: "130km/Charge", price: 126000 },
      { specs: "63v 60Ah", range: "150km/Charge", price: 151000 },
      { specs: "63v 70Ah", range: "180km/Charge", price: 176000 },
      { specs: "63v 80Ah", range: "210km/Charge", price: 201000 },
      { specs: "63v 90Ah", range: "230km/Charge", price: 226000 },
      { specs: "63v 100Ah", range: "250km/Charge", price: 252000 }
  ],
  "1500w": [
      { specs: "63v 25Ah", range: "60km/Charge", price: 66000 },
      { specs: "63v 30Ah", range: "70km/Charge", price: 77000 },
      { specs: "63v 40Ah", range: "100km/Charge", price: 100000 },
      { specs: "63v 50Ah", range: "125km/Charge", price: 126000 },
      { specs: "63v 60Ah", range: "150km/Charge", price: 151000 },
      { specs: "63v 70Ah", range: "170km/Charge", price: 176000 },
      { specs: "63v 80Ah", range: "200km/Charge", price: 201000 },
      { specs: "63v 90Ah", range: "220km/Charge", price: 226000 },
      { specs: "63v 100Ah", range: "240km/Charge", price: 252000 },
      { specs: "63v 110Ah", range: "260km/Charge", price: 277000 },
      { specs: "72v 30Ah", range: "90km/Charge", price: 89000 },
      { specs: "72v 40Ah", range: "125km/Charge", price: 115000 },
      { specs: "72v 50Ah", range: "150km/Charge", price: 144000 },
      { specs: "72v 60Ah", range: "180km/Charge", price: 173000 },
      { specs: "72v 70Ah", range: "210km/Charge", price: 202000 },
      { specs: "72v 80Ah", range: "240km/Charge", price: 230000 },
      { specs: "72v 90Ah", range: "270km/Charge", price: 259000 },
      { specs: "72v 100Ah", range: "300km/Charge", price: 288000 },
  ],
  "2000w": [
      { specs: "72v 30Ah", range: "90km/Charge", price: 89000 },
      { specs: "72v 40Ah", range: "125km/Charge", price: 115000 },
      { specs: "72v 50Ah", range: "150km/Charge", price: 144000 },
      { specs: "72v 60Ah", range: "180km/Charge", price: 173000 },
      { specs: "72v 70Ah", range: "210km/Charge", price: 202000 },
      { specs: "72v 80Ah", range: "240km/Charge", price: 230000 },
      { specs: "72v 90Ah", range: "270km/Charge", price: 259000 },
      { specs: "72v 100Ah", range: "300km/Charge", price: 288000 },
      { specs: "72v 110Ah", range: "330km/Charge", price: 316000 },
      { specs: "72v 120Ah", range: "360km/Charge", price: 345000 }
  ],
  "2000w Alloy rim": [
      { specs: "72v 40Ah", range: "125km/Charge", price: 115000 },
      { specs: "72v 50Ah", range: "150km/Charge", price: 144000 },
      { specs: "72v 60Ah", range: "180km/Charge", price: 173000 },
      { specs: "72v 70Ah", range: "210km/Charge", price: 202000 },
      { specs: "72v 80Ah", range: "240km/Charge", price: 230000 },
      { specs: "72v 90Ah", range: "270km/Charge", price: 259000 },
      { specs: "72v 100Ah", range: "300km/Charge", price: 288000 },
      { specs: "72v 110Ah", range: "330km/Charge", price: 316000 },
      { specs: "72v 120Ah", range: "360km/Charge", price: 345000 }
  ],
  "3000w Alloy rim": [
  { specs: "72v 50Ah", range: "100km/Charge", price: 162000 },
  { specs: "72v 60Ah", range: "120km/Charge", price: 190000 },
  { specs: "72v 70Ah", range: "140km/Charge", price: 217000 },
  { specs: "72v 80Ah", range: "160km/Charge", price: 244000 },
  { specs: "72v 90Ah", range: "180km/Charge", price: 272000 },
  { specs: "72v 100Ah", range: "200km/Charge", price: 295000 },
  { specs: "72v 110Ah", range: "220km/Charge", price: 324000 },
  { specs: "72v 120Ah", range: "240km/Charge", price: 354000 },
  { specs: "72v 130Ah", range: "270km/Charge", price: 383000 },
  { specs: "72v 140Ah", range: "300km/Charge", price: 413000 }
  ],
  "4000w Alloy rim": [
  { specs: "72v 80Ah", range: "160km/Charge", price: 244000 },
  { specs: "72v 90Ah", range: "180km/Charge", price: 272000 },
  { specs: "72v 100Ah", range: "200km/Charge", price: 295000 },
  { specs: "72v 110Ah", range: "220km/Charge", price: 324000 },
  { specs: "72v 120Ah", range: "240km/Charge", price: 354000 },
  { specs: "72v 130Ah", range: "270km/Charge", price: 383000 },
  { specs: "72v 140Ah", range: "300km/Charge", price: 413000 }
  ]
};

const CHARGER_OPTIONS = {
  "48v 10Ah": [
      { specs: "3A", time: "3 Hours", price: 4500 }
  ],
  "48v 15Ah": [
      { specs: "3A", time: "5 Hours", price: 4500 }
  ],
  "48v 20Ah": [
      { specs: "5A", time: "4 Hours", price: 6500 }
  ],
  "48v 25Ah": [
      { specs: "5A", time: "5 Hours", price: 6500 }
  ],
  "48v 30Ah": [
      { specs: "5A", time: "6 Hours", price: 6500 }
  ],
  "48v 35Ah": [
      { specs: "5A", time: "7 Hours", price: 6500 },
      { specs: "10A", time: "3.5 Hours", price: 11500 }
  ],
  "48v 40Ah": [
      { specs: "5A", time: "4 Hours", price: 6500 },
      { specs: "10A", time: "4 Hours", price: 11500 }
  ],
  "48v 50Ah": [
      { specs: "10A", time: "5 Hours", price: 11500 },
      { specs: "20A", time: "2.5 Hours", price: 23000 }
  ],
  "48v 60Ah": [
      { specs: "10A", time: "5 Hours", price: 11500 },
      { specs: "20A", time: "2.5 Hours", price: 23000 }
  ],
  "48v 70Ah": [
      { specs: "10A", time: "5 Hours", price: 11500 },
      { specs: "20A", time: "2.5 Hours", price: 23000 }
  ],
  "48v 80Ah": [
      { specs: "10A", time: "5 Hours", price: 11500 },
      { specs: "20A", time: "2.5 Hours", price: 23000 }
  ],
  "48v 90Ah": [
      { specs: "10A", time: "5 Hours", price: 11500 },
      { specs: "20A", time: "2.5 Hours", price: 23000 }
  ],
  "48v 100Ah": [
      { specs: "10A", time: "5 Hours", price: 11500 },
      { specs: "20A", time: "2.5 Hours", price: 23000 }
  ],
  
  "63v 20Ah": [
      { specs: "5A", time: "5 Hours", price: 6500 },                
  ],
  "63v 25Ah": [
      { specs: "5A", time: "5 Hours", price: 6500 },
  ],
  "63v 30Ah": [
      { specs: "5A", time: "6 Hours", price: 6500 },
      { specs: "10A", time: "3 Hours", price: 11500 }
  ],
  "63v 35Ah": [
      { specs: "5A", time: "7 Hours", price: 6500 },
      { specs: "10A", time: "3.5 Hours", price: 11500 }
  ],
  "63v 40Ah": [
      { specs: "5A", time: "8 Hours", price: 6500 },
      { specs: "10A", time: "4 Hours", price: 11500 },
      { specs: "20A", time: "2 Hours", price: 23000 }
  ],
  "63V 45Ah": [
      { specs: "10A", time: "4.5 Hours", price: 11500 },
      { specs: "20A", time: "2.5 Hours", price: 23000 }
  ],
  "63v 50Ah": [
      { specs: "10A", time: "5 Hours", price: 11500 },
      { specs: "20A", time: "2.5 Hours", price: 23000 }
  ],
  "63v 60Ah": [
      { specs: "10A", time: "6 Hours", price: 11500 },
      { specs: "20A", time: "3 Hours", price: 23000 }
  ],
  "63v 70Ah": [
      { specs: "10A", time: "7 Hours", price: 11500 },
      { specs: "20A", time: "3.5 Hours", price: 23000 }
  ],
  "63v 80Ah": [
      { specs: "10A", time: "8 Hours", price: 11500 },
      { specs: "20A", time: "4 Hours", price: 23000 }
  ],
  "63v 90Ah": [
      { specs: "10A", time: "9 Hours", price: 11500 },
      { specs: "20A", time: "4.5 Hours", price: 23000 }
  ],
  "63v 100Ah": [
      { specs: "20A", time: "5 Hours", price: 23000 },
      { specs: "25A", time: "4 Hours", price: 28000 }
  ],
  "63v 110Ah": [
      { specs: "20A", time: "5.5 Hours", price: 23000 },
      { specs: "25A", time: "4 Hours", price: 28000 }
  ],
  "63v 120Ah": [
      { specs: "20A", time: "6 Hours", price: 23000 },
      { specs: "25A", time: "4.5 Hours", price: 28000 }
  ],
  "72v 30Ah": [
      { specs: "5A", time: "6 Hours", price: 6500 },
  ],
  "72v 35Ah": [
      { specs: "5A", time: "7 Hours", price: 6500 },
      { specs: "10A", time: "3.5 Hours", price: 11500 }
  ],
  "72v 40Ah": [
      { specs: "5A", time: "8 Hours", price: 6500 },
      { specs: "10A", time: "4 Hours", price: 11500 },
  ],
  "72v 50Ah": [
      { specs: "10A", time: "5 Hours", price: 11500 },
  ],
  "72v 60Ah": [
      { specs: "10A", time: "6 Hours", price: 11500 },
      { specs: "20A", time: "3 Hours", price: 25000 } 
  ],
  "72v 70Ah": [
      { specs: "10A", time: "7 Hours", price: 11500 },
      { specs: "20A", time: "3.5 Hours", price: 25000 }
  ],
  "72v 80Ah": [
      { specs: "10A", time: "8 Hours", price: 11500 },
      { specs: "20A", time: "4 Hours", price: 25000 }
  ],
  "72v 90Ah": [
      { specs: "10A", time: "9 Hours", price: 11500 },
      { specs: "20A", time: "4.5 Hours", price: 25000 }
  ],
  "72v 100Ah": [
      { specs: "10A", time: "10 Hours", price: 11500 },
      { specs: "20A", time: "5 Hours", price: 25000 }
  ],
  "72v 110Ah": [
      { specs: "20A", time: "5.5 Hours", price: 25000 },
      { specs: "25A", time: "4.5 Hours", price: 29000 }
  ],
  "72v 120Ah": [
      { specs: "20A", time: "6 Hours", price: 25000 },
      { specs: "25A", time: "5 Hours", price: 29000 }
  ],
  "72v 130Ah": [
      { specs: "20A", time: "6.5 Hours", price: 25000 },
      { specs: "25A", time: "5 Hours", price: 29000 }
  ],
  "72v 140Ah": [
      { specs: "25A", time: "5.5 Hours", price: 29000 },
      { specs: "30A", time: "4.5 Hours", price: 35000 }
  ]
};

export default function EVCalculator() {
  const [selectedBike, setSelectedBike] = useState('');
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [batteryBox, setBatteryBox] = useState('-');
  const [fittingCharges, setFittingCharges] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Available Batteries for current motor
  const [availableBatteries, setAvailableBatteries] = useState([]);
  
  // Available Chargers for current battery
  const [availableChargers, setAvailableChargers] = useState([]);

  useEffect(() => {
    // Reset selections when bike changes
    setSelectedMotor(null);
    setSelectedBattery(null);
    setSelectedCharger(null);
    setAvailableBatteries([]);
    setAvailableChargers([]);
    setBatteryBox('-');
    setFittingCharges(0);
    setTotalPrice(0);
  }, [selectedBike]);

  useEffect(() => {
    // Update available batteries when motor changes
    if (selectedMotor) {
      const batteries = BATTERY_OPTIONS[selectedMotor.power] || [];
      setAvailableBatteries(batteries);
      setSelectedBattery(null);
      setSelectedCharger(null);
      setAvailableChargers([]);
      setBatteryBox('-');
      
      // Calculate fitting charges based on motor power
      let fitting = 9000; // Default for 500w
      if (selectedMotor.power === '500w') {
        fitting = 9000;
      } else if (['1000w', '1500w', '2000w'].includes(selectedMotor.power)) {
        fitting = 10000;
      } else if (['2000w Alloy rim'].includes(selectedMotor.power)) {
        fitting = 12000;
      } else if (['3000w Alloy rim', '4000w Alloy rim'].includes(selectedMotor.power)) {
        fitting = 15000;
      }
      setFittingCharges(fitting);
      
    } else {
      setAvailableBatteries([]);
      setFittingCharges(0);
    }
  }, [selectedMotor]);

  useEffect(() => {
    // Update available chargers when battery changes
    if (selectedBattery) {
      const chargers = CHARGER_OPTIONS[selectedBattery.specs] || [];
      setAvailableChargers(chargers);
      setSelectedCharger(null);
      
      // Calculate battery box price based on battery specs
      const batteryBoxValue = calculateBatteryBox(selectedBattery.specs);
      setBatteryBox(batteryBoxValue);
    } else {
      setAvailableChargers([]);
      setBatteryBox('-');
    }
  }, [selectedBattery]);

  useEffect(() => {
    // Calculate total price
    if (selectedMotor && selectedBattery && selectedCharger) {
      const batteryBoxPrice = batteryBox !== '-' ? parseInt(batteryBox.replace(/[^\d]/g, '')) : 0;
      setTotalPrice(selectedMotor.price + selectedBattery.price + selectedCharger.price + fittingCharges + batteryBoxPrice);
    } else {
      setTotalPrice(0);
    }
  }, [selectedMotor, selectedBattery, selectedCharger, fittingCharges, batteryBox]);

  const calculateBatteryBox = (batterySpecs) => {
    const [voltage, capacity] = batterySpecs.split(' ');
    const ah = parseInt(capacity.replace('Ah', ''));

    let price = 0;

    if (voltage === '48v') {
      if (ah >= 10 && ah <= 40) price = 5000; // Note: Logic slightly adjusted from HTML for ranges, check HTML logic carefully.
      // Re-implementing HTML logic exactly:
      if (ah >= 15 && ah <= 20) price = 5500;
      else if (ah >= 25 && ah <= 30) price = 6000;
      else if (ah >= 35 && ah <= 40) price = 6500;
      else if (ah >= 45 && ah <= 50) price = 7000;
      // HTML logic had a gap for <15 and specific ranges. Using the most specific blocks from HTML script.
    } else if (voltage === '63v') {
      if (ah >= 20 && ah <= 40) price = 6500;
      else if (ah >= 45 && ah <= 50) price = 7500;
      else if (ah === 60) price = 8000;
      else if (ah === 70) price = 9000;
      else if (ah === 80) price = 10000;
      else if (ah === 90) price = 11000;
      else if (ah === 100) price = 12000;
      else if (ah >= 110 && ah <= 120) price = 14000;
      else if (ah >= 130 && ah <= 140) price = 13000; // Note: HTML logic said 13000 for 130-140
    } else if (voltage === '72v') {
       if (ah >= 30 && ah <= 35) price = 6500;
       else if (ah === 40) price = 7000;
       else if (ah === 50) price = 8000;
       else if (ah === 60) price = 8000;
       else if (ah === 70) price = 9000;
       else if (ah === 80) price = 10000;
       else if (ah === 90) price = 11000;
       else if (ah === 100) price = 12000;
       else if (ah === 110) price = 13000;
       else if (ah === 120) price = 14000;
       else if (ah === 130) price = 15000;
       else if (ah === 140) price = 16000;
       else if (ah === 150) price = 18000;
    }
    
    return price > 0 ? `Rs. ${price.toLocaleString()}/-` : '-';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">EV Conversion Calculator</h1>
            <p className="text-gray-600">Calculate the total cost of converting your bike to electric</p>
        </div>

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
                onChange={(e) => setSelectedBike(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition bg-white"
                aria-label="Select your bike model"
              >
                <option value="">Select Bike</option>
                {Object.keys(MOTOR_KITS).map((bike) => (
                  <option key={bike} value={bike}>
                    {bike}cc
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
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                disabled={!selectedBike}
                aria-label="Select motor kit"
              >
                <option value="">Select Motor Kit</option>
                {selectedBike &&
                  MOTOR_KITS[selectedBike].map((motor, index) => (
                    <option key={index} value={JSON.stringify(motor)}>
                      {motor.name} - Rs. {motor.price.toLocaleString()}/-
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
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                disabled={!selectedMotor}
                aria-label="Select battery"
              >
                <option value="">Select Battery</option>
                {availableBatteries.map((battery, index) => (
                  <option key={index} value={JSON.stringify(battery)}>
                    {battery.specs} ({battery.range}) - Rs. {battery.price.toLocaleString()}/-
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
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                disabled={!selectedBattery}
                aria-label="Select charger"
              >
                <option value="">Select Charger</option>
                {availableChargers.map((charger, index) => (
                  <option key={index} value={JSON.stringify(charger)}>
                    {charger.specs} ({charger.time}) - Rs. {charger.price.toLocaleString()}/-
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
            <div className="bg-black text-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Price (Including Fitting)</span>
                <span className="text-2xl font-bold text-orange-500">
                  {totalPrice ? `Rs. ${totalPrice.toLocaleString()}/-` : 'Select options above'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}