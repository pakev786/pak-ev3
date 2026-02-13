import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function EVCalculator() {
  const [bikes, setBikes] = useState([]);
  const [ranges, setRanges] = useState([]); 
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  const [selectedBike, setSelectedBike] = useState(null);
  const [selectedKit, setSelectedKit] = useState(null);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [selectedCharger, setSelectedCharger] = useState(null);

  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null); 

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [bRes, rRes, fRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/ev/bikes`),
                axios.get(`${BASE_URL}/api/ev/ranges`),
                // Fetch recommended products
                axios.get(`${BASE_URL}/api/ev/featured-products`).catch(() => ({ data: [] }))
            ]);
            setBikes(bRes.data);
            setRanges(rRes.data);
            setFeaturedProducts(fRes.data);
        } catch (error) {
            console.error("Failed to load calculator data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

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

  const getRange = (kitId, batId) => {
      if (!kitId || !batId) return null;
      return ranges.find(r => {
          const rKitId = getId(r.kit) || r.kit;
          const rBatId = getId(r.battery) || r.battery;
          return rKitId === kitId && rBatId === batId;
      })?.range;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; 
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const ProductCard = ({ product }) => (
    <Link to={`/product/${getId(product)}`} className="flex-none w-64 md:w-72 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden cursor-pointer">
      <div className="h-48 relative bg-gray-50 rounded-t-xl overflow-hidden p-4 flex items-center justify-center">
        <img 
          src={product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`} 
          alt={product.title} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {product.optionalPrice > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">Sale</span>
            )}
            {/* FIX: Check codAvailable explicitly */}
            {product.codAvailable ? (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-green-200">COD</span>
            ) : (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-blue-200">No COD</span>
            )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-gray-400 font-bold uppercase mb-1">{product.category?.name || 'EV Part'}</div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base group-hover:text-orange-600 transition-colors" title={product.title}>{product.title}</h3>
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="block text-lg font-bold text-gray-900">₨ {product.price?.toLocaleString()}</span>
            {product.optionalPrice > 0 && (
               <span className="block text-xs text-gray-400 line-through">₨ {product.optionalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-orange-600 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
        </div>
      </div>
    </Link>
  );

  const kitPrice = selectedKit?.price || 0;
  const fittingPrice = selectedKit?.fittingCost || 0;
  const batteryPrice = selectedBattery?.price || 0;
  const boxPrice = selectedBattery?.boxPrice || 0;
  const chargerPrice = selectedCharger?.price || 0;
  
  const totalPrice = kitPrice + fittingPrice + batteryPrice + boxPrice + chargerPrice;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Calculator...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">EV Conversion Calculator</h1>
            <p className="text-gray-600">Calculate the total cost of converting your bike to electric</p>
        </div>

        {/* 1. CALCULATOR SECTION (Narrow Width) */}
        <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-6">
            
            {/* Bike */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bike</label>
              <select className="w-full p-3 border rounded-lg bg-gray-50" onChange={handleBikeChange} value={getId(selectedBike) || ''}>
                <option value="">Select Bike</option>
                {bikes.map((bike, index) => (
                    <option key={`${getId(bike)}-${index}`} value={getId(bike)}>{bike.name}</option>
                ))}
              </select>
            </div>

            {/* Kit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motor Kit</label>
              <select className="w-full p-3 border rounded-lg bg-gray-50" onChange={handleKitChange} value={getId(selectedKit) || ''} disabled={!selectedBike}>
                <option value="">Select Kit</option>
                {selectedBike?.kits?.map((kit, index) => (
                    <option key={`${getId(kit)}-${index}`} value={getId(kit)}>
                        {kit?.name} (Speed: {kit?.topSpeed} km/h) - Rs. {kit?.price?.toLocaleString()}
                    </option>
                ))}
              </select>
            </div>

            {/* Battery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Battery</label>
              <select className="w-full p-3 border rounded-lg bg-gray-50" onChange={handleBatteryChange} value={getId(selectedBattery) || ''} disabled={!selectedKit}>
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

            {/* Charger */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Charger</label>
              <select className="w-full p-3 border rounded-lg bg-gray-50" onChange={handleChargerChange} value={getId(selectedCharger) || ''} disabled={!selectedBattery}>
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
                <span className="text-2xl font-bold text-orange-500">
                    {selectedCharger ? `Rs. ${totalPrice.toLocaleString()}/-` : 'Select options above'}
                </span>
            </div>
          </div>
        </div>

        {/* 2. RECOMMENDED PRODUCTS SECTION (Full Width) */}
        {selectedCharger && featuredProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8 px-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Complete Your EV Setup</h2>
                <p className="text-gray-500 text-sm mt-1">Recommended accessories for your new conversion</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 text-gray-600 hover:text-orange-600 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 text-gray-600 hover:text-orange-600 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="relative group">
               <div 
  ref={scrollRef} 
  className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x px-1" 
  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
>
{featuredProducts
  .filter(product => product.isAvailable) // Filter for available products
  .map((product) => (
    <div key={product._id} className="min-w-[280px] snap-start">
      <ProductCard product={product} />
    </div>
))}
</div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
