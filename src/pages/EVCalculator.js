import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function EVCalculator() {
  const [bikes, setBikes] = useState([]);
  const [ranges, setRanges] = useState([]); 
  
  const [selectedBike, setSelectedBike] = useState(null);
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [selectedCharger, setSelectedCharger] = useState(null);

  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [bRes, rRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/ev/bikes`),
                axios.get(`${BASE_URL}/api/ev/ranges`)
            ]);
            setBikes(bRes.data);
            setRanges(rRes.data);
        } catch (error) {
            console.error("Failed to load calculator data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // Helper to safely get ID
  const getId = (item) => item?.id || item?._id;

  const handleBikeChange = (e) => {
      const bikeId = e.target.value;
      const bike = bikes.find(b => getId(b) === bikeId);
      setSelectedBike(bike);
      setSelectedKit(null);
      setSelectedBattery(null);
      setSelectedCharger(null);
  };

  const handleKitChange = (e) => {
      const kitId = e.target.value;
      const kit = selectedBike?.kits?.find(k => getId(k) === kitId);
      setSelectedKit(kit);
      setSelectedBattery(null);
      setSelectedCharger(null);
  };

  const handleBatteryChange = (e) => {
      const batId = e.target.value;
      const bat = selectedKit?.batteries?.find(b => getId(b) === batId);
      setSelectedBattery(bat);
      setSelectedCharger(null);
  };

  const handleChargerChange = (e) => {
      const chgId = e.target.value;
      const chg = selectedBattery?.chargers?.find(c => getId(c) === chgId);
      setSelectedCharger(chg);
  };

  // Helper to get range safely
  const getRange = (kitId, batId) => {
      if (!kitId || !batId) return null;
      return ranges.find(r => {
          const rKitId = getId(r.kit) || r.kit;
          const rBatId = getId(r.battery) || r.battery;
          return rKitId === kitId && rBatId === batId;
      })?.range;
  };

  // Calculations
  const kitPrice = selectedKit?.price || 0;
  const fittingPrice = selectedKit?.fittingCost || 0;
  const batteryPrice = selectedBattery?.price || 0;
  const boxPrice = selectedBattery?.boxPrice || 0;
  const chargerPrice = selectedCharger?.price || 0;
  
  const totalPrice = kitPrice + fittingPrice + batteryPrice + boxPrice + chargerPrice;
  const currentRange = getRange(getId(selectedKit), getId(selectedBattery));

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Calculator...</div>;

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
            
            {/* 1. Bike */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bike</label>
              <select className="w-full p-3 border rounded-lg bg-white" onChange={handleBikeChange} value={getId(selectedBike) || ''}>
                <option value="">Select Bike</option>
                {bikes.map((bike, index) => (
                    <option key={`${getId(bike)}-${index}`} value={getId(bike)}>{bike.name}</option>
                ))}
              </select>
            </div>

            {/* 2. Kit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motor Kit</label>
              <select className="w-full p-3 border rounded-lg bg-white" onChange={handleKitChange} value={getId(selectedKit) || ''} disabled={!selectedBike}>
                <option value="">Select Kit</option>
                {selectedBike?.kits?.map((kit, index) => (
                    <option key={`${getId(kit)}-${index}`} value={getId(kit)}>
                        {kit?.name} (Speed: {kit?.topSpeed} km/h) - Rs. {kit?.price?.toLocaleString()}
                    </option>
                ))}
              </select>
            </div>

            {/* 3. Battery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Battery</label>
              <select className="w-full p-3 border rounded-lg bg-white" onChange={handleBatteryChange} value={getId(selectedBattery) || ''} disabled={!selectedKit}>
                <option value="">Select Battery</option>
                {selectedKit?.batteries?.map((bat, index) => {
                    const rangeVal = getRange(getId(selectedKit), getId(bat));
                    return (
                        <option key={`${getId(bat)}-${index}`} value={getId(bat)}>
                           {bat?.name} {rangeVal ? ` (${rangeVal}km/charge)` : ''} - Rs. {bat?.price?.toLocaleString()}
                        </option>
                    );
                })}
              </select>
            </div>

            {/* 4. Charger */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Charger</label>
              <select className="w-full p-3 border rounded-lg bg-white" onChange={handleChargerChange} value={getId(selectedCharger) || ''} disabled={!selectedBattery}>
                <option value="">Select Charger</option>
                {selectedBattery?.chargers?.map((chg, index) => {
                    if (!chg) return null;
                    const time = (selectedBattery?.amperes && chg.amperes) ? (selectedBattery.amperes / chg.amperes).toFixed(1) : '0';
                    return (
                        <option key={`${getId(chg)}-${index}`} value={getId(chg)}>
                            {chg.name} ({time} Hours) - Rs. {chg.price.toLocaleString()}
                        </option>
                    );
                })}
              </select>
            </div>

            {/* Breakdown */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Battery Box</span>
                  <span className="text-sm font-semibold text-gray-900">{boxPrice ? `Rs. ${boxPrice.toLocaleString()}` : '-'}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Fitting Charges</span>
                  <span className="text-sm font-semibold text-gray-900">{fittingPrice ? `Rs. ${fittingPrice.toLocaleString()}` : '-'}</span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-black text-white p-6 rounded-lg shadow-lg flex justify-between items-center">
                <span className="text-lg font-medium">Total Price (Including Fitting)</span>
                {/* UPDATED CONDITION: Only show price if selectedCharger is not null */}
                <span className="text-2xl font-bold text-orange-500">
                    {selectedCharger ? `Rs. ${totalPrice.toLocaleString()}/-` : 'Select options above'}
                </span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}