import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const MOTOR_KITS = {
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
    { power: '3000w Alloy rim', price: 135000 }
  ],
  'CB 300': [
    { power: '2000w Alloy rim', price: 75000 },
    { power: '3000w Alloy rim', price: 135000 },
    { power: '4000w Alloy rim', price: 95000 }
  ]
};

const BATTERIES = [
  // 48V Batteries
  { specs: '48v 10Ah', price: 30000 },
  { specs: '48v 15Ah', price: 35000 },
  { specs: '48v 20Ah', price: 43000 },
  { specs: '48v 25Ah', price: 54000 },
  { specs: '48v 30Ah', price: 62000 },
  { specs: '48v 40Ah', price: 79000 },
  { specs: '48v 50Ah', price: 98000 },
  { specs: '48v 60Ah', price: 117000 },
  { specs: '48v 70Ah', price: 134000 },
  { specs: '48v 80Ah', price: 154000 },
  { specs: '48v 90Ah', price: 173000 },
  { specs: '48v 100Ah', price: 192000 },
  // 63V Batteries
  { specs: '63v 20Ah', price: 52000 },
  { specs: '63v 25Ah', price: 66000 },
  { specs: '63v 30Ah', price: 77000 },
  { specs: '63v 40Ah', price: 100000 },
  { specs: '63v 50Ah', price: 126000 },
  { specs: '63v 60Ah', price: 151000 },
  { specs: '63v 70Ah', price: 176000 },
  { specs: '63v 80Ah', price: 201000 },
  { specs: '63v 90Ah', price: 226000 },
  { specs: '63v 100Ah', price: 252000 },
  { specs: '63v 110Ah', price: 277000 },
  { specs: '63v 120Ah', price: 302000 },
  { specs: '63v 130Ah', price: 327000 },
  { specs: '63v 140Ah', price: 352000 },
  // 72V Batteries
  { specs: '72v 50Ah', price: 162000 },
  { specs: '72v 60Ah', price: 190000 },
  { specs: '72v 70Ah', price: 217000 },
  { specs: '72v 80Ah', price: 244000 },
  { specs: '72v 90Ah', price: 272000 },
  { specs: '72v 100Ah', price: 295000 },
  { specs: '72v 110Ah', price: 324000 },
  { specs: '72v 120Ah', price: 354000 },
  { specs: '72v 130Ah', price: 383000 },
  { specs: '72v 140Ah', price: 412000 }
];

const CHARGERS = [
  { specs: '3A', price: 3000 },
  { specs: '5A', price: 4000 },
  { specs: '10A', price: 6000 },
  { specs: '15A', price: 8000 },
  { specs: '20A', price: 10000 }
];

export default function EVCalculator() {
  const [selectedBike, setSelectedBike] = useState('');
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [batteryBox, setBatteryBox] = useState('-');
  const [fittingCharges, setFittingCharges] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateFittingCharges = (motorPower) => {
    if (motorPower === '500w') return 7000;
    if (['1000w', '1500w', '2000w'].includes(motorPower)) return 10000;
    if (['2000w Alloy rim', '3000w Alloy rim'].includes(motorPower)) return 12000;
    if (motorPower === '4000w Alloy rim') return 15000;
    return 0;
  };

  const calculateBatteryBox = (batterySpecs) => {
    const [voltage, capacity] = batterySpecs.split(' ');
    const ah = parseInt(capacity.replace('Ah', ''));

    if (voltage === '48v') {
      if (ah >= 10 && ah <= 40) return 'Rs. 5,000/-';
      if (ah >= 45 && ah <= 50) return 'Rs. 6,000/-';
      if (ah >= 55 && ah <= 60) return 'Rs. 7,000/-';
      if (ah === 70) return 'Rs. 8,000/-';
      if (ah === 80) return 'Rs. 9,000/-';
      if (ah >= 90 && ah <= 100) return 'Rs. 10,000/-';
    } else if (voltage === '63v') {
      if (ah >= 20 && ah <= 25) return 'Rs. 6,000/-';
      if (ah >= 30 && ah <= 40) return 'Rs. 7,000/-';
      if (ah >= 45 && ah <= 60) return 'Rs. 8,000/-';
      if (ah === 70) return 'Rs. 9,000/-';
      if (ah === 80) return 'Rs. 10,000/-';
      if (ah >= 90 && ah <= 100) return 'Rs. 11,000/-';
      if (ah >= 110 && ah <= 120) return 'Rs. 12,000/-';
      if (ah >= 130 && ah <= 140) return 'Rs. 13,000/-';
    } else if (voltage === '72v') {
      if (ah >= 50 && ah <= 60) return 'Rs. 8,000/-';
      if (ah === 70) return 'Rs. 9,000/-';
      if (ah === 80) return 'Rs. 10,000/-';
      if (ah >= 90 && ah <= 100) return 'Rs. 11,000/-';
      if (ah >= 110 && ah <= 120) return 'Rs. 12,000/-';
      if (ah >= 130 && ah <= 140) return 'Rs. 13,000/-';
    }
    return '-';
  };

  useEffect(() => {
    if (selectedMotor && selectedBattery && selectedCharger) {
      const fitting = calculateFittingCharges(selectedMotor.power);
      setFittingCharges(fitting);
      
      const batteryBoxValue = calculateBatteryBox(selectedBattery.specs);
      setBatteryBox(batteryBoxValue);
      
      const batteryBoxPrice = batteryBoxValue !== '-' ? parseInt(batteryBoxValue.replace(/[^\d]/g, '')) : 0;
      setTotalPrice(selectedMotor.price + selectedBattery.price + selectedCharger.price + fitting + batteryBoxPrice);
    } else {
      setFittingCharges(0);
      setBatteryBox('-');
      setTotalPrice(0);
    }
  }, [selectedMotor, selectedBattery, selectedCharger]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">EV Conversion Calculator</h1>
          <p className="text-gray-600">
            Calculate the total cost of converting your bike to electric
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Bike Selection */}
          <div>
            <label htmlFor="bikeSelect" className="block text-sm font-semibold text-gray-900 mb-2">
              Select Your Bike
            </label>
            <select
              id="bikeSelect"
              value={selectedBike}
              onChange={(e) => {
                setSelectedBike(e.target.value);
                setSelectedMotor(null);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              aria-label="Select your bike model"
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
            <label htmlFor="motorSelect" className="block text-sm font-semibold text-gray-900 mb-2">
              Motor Kit
            </label>
            <select
              id="motorSelect"
              value={selectedMotor ? JSON.stringify(selectedMotor) : ''}
              onChange={(e) => setSelectedMotor(e.target.value ? JSON.parse(e.target.value) : null)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!selectedBike}
              aria-label="Select motor kit"
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
            <label htmlFor="batterySelect" className="block text-sm font-semibold text-gray-900 mb-2">
              Battery
            </label>
            <select
              id="batterySelect"
              value={selectedBattery ? JSON.stringify(selectedBattery) : ''}
              onChange={(e) => setSelectedBattery(e.target.value ? JSON.parse(e.target.value) : null)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              aria-label="Select battery"
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
            <label htmlFor="chargerSelect" className="block text-sm font-semibold text-gray-900 mb-2">
              Charger
            </label>
            <select
              id="chargerSelect"
              value={selectedCharger ? JSON.stringify(selectedCharger) : ''}
              onChange={(e) => setSelectedCharger(e.target.value ? JSON.parse(e.target.value) : null)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              aria-label="Select charger"
            >
              <option value="">Select Charger</option>
              {CHARGERS.map((charger) => (
                <option key={charger.specs} value={JSON.stringify(charger)}>
                  {charger.specs} - Rs. {charger.price.toLocaleString()}/-
                </option>
              ))}
            </select>
          </div>

          {/* Breakdown Section */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
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
      </main>
    </div>
  );
}

