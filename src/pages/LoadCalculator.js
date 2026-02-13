import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const APPLIANCE_WATTAGES = {
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
};

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
];

const BATTERY_VOLTAGES = [
  { value: 12, label: '12V Battery' },
  { value: 24, label: '24V Battery' },
  { value: 48, label: '48V Battery' },
  { value: 72, label: '72V Battery' }
];

const calculateTotal = (type, count, hours, wattage) => {
  const total = wattage * count;
  const dailyKwh = (total * hours) / 1000;
  return { watts: total, kwh: dailyKwh };
};

const ApplianceSection = ({ title, options, onUpdateTotals }) => {
  const [selectedType, setSelectedType] = useState('select');
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const result = calculateTotal(
      selectedType,
      count,
      time,
      APPLIANCE_WATTAGES[selectedType]
    );
    setTotal(result.watts);

    // Update parent totals
    const allSections = document.querySelectorAll('.appliance-section');
    let totalWatts = 0;
    let totalDailyKwh = 0;

    allSections.forEach((section) => {
      const typeSelect = section.querySelector('select');
      const countInput = section.querySelector('input[type="number"]');
      const timeSelect = section.querySelector('.time-select');

      const type = typeSelect?.value || 'select';
      const count = parseInt(countInput?.value || '0');
      const time = parseFloat(timeSelect?.value || '1');
      const result = calculateTotal(type, count, time, APPLIANCE_WATTAGES[type]);
      totalWatts += result.watts;
      totalDailyKwh += result.kwh;
    });

    onUpdateTotals(totalWatts, totalDailyKwh);
  }, [selectedType, count, time, onUpdateTotals]);

  return (
    <div className="appliance-section mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {title}
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            aria-label={`Select ${title} type`}
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
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 0)}
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            aria-label={`${title} quantity`}
            placeholder="Qty"
          />
        </div>

        <div className="w-32">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Usage Time
          </label>
          <select
            value={time}
            onChange={(e) => setTime(parseFloat(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition time-select"
            aria-label={`${title} usage time`}
          >
            {TIME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-32 text-right">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Total
          </label>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 font-semibold text-gray-900">
            {total} Watts
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LoadCalculator() {
  const [totalWatts, setTotalWatts] = useState(0);
  const [totalKwh, setTotalKwh] = useState(0);
  const [batteryVoltage, setBatteryVoltage] = useState(null);
  const [batteryResult, setBatteryResult] = useState('Please select battery voltage');
  const [loadProducts, setLoadProducts] = useState([]);

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const scrollRef = useRef(null); 

  useEffect(() => {
    const fetchLoadProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/ev/load-featured-products`);
        setLoadProducts(res.data);
      } catch (err) {
        console.error("Error fetching load featured products:", err);
      }
    };
    fetchLoadProducts();
  }, []);

  const updateBatterySuggestion = () => {
    if (!batteryVoltage) {
      setBatteryResult('Please select battery voltage');
      return;
    }

    // Convert kWh to Wh (multiply by 1000)
    const whPerDay = totalKwh * 1000;
    // Calculate Amp-hours by dividing Wh by voltage
    const amphours = (whPerDay / batteryVoltage) * 1.2; // Adding 20% safety margin

    setBatteryResult(`Recommended Battery: ${Math.ceil(amphours)}Ah ${batteryVoltage}V`);
  };

  useEffect(() => {
    updateBatterySuggestion();
  }, [totalKwh, batteryVoltage]);

  const handleUpdateTotals = (watts, kwh) => {
    setTotalWatts(watts);
    setTotalKwh(kwh);
  };

  const getId = (item) => item?.id || item?._id;

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Load Calculator</h1>
          <p className="text-gray-600">
            Calculate your daily power consumption and get battery recommendations
          </p>
        </div>

        <div className="space-y-6">
          <ApplianceSection
            title="Fan"
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'dc', label: 'DC Fan', wattage: APPLIANCE_WATTAGES.dc },
              { value: 'ac', label: 'AC Fan', wattage: APPLIANCE_WATTAGES.ac },
              { value: 'ceiling', label: 'Ceiling Fan', wattage: APPLIANCE_WATTAGES.ceiling },
              { value: 'pedestal', label: 'Pedestal Fan', wattage: APPLIANCE_WATTAGES.pedestal }
            ]}
          />

          <ApplianceSection
            title="Light"
            onUpdateTotals={handleUpdateTotals}
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
            onUpdateTotals={handleUpdateTotals}
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
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'mini', label: 'Mini Fridge', wattage: APPLIANCE_WATTAGES.mini },
              { value: 'medium', label: 'Medium Fridge', wattage: APPLIANCE_WATTAGES.medium },
              { value: 'large', label: 'Large Fridge', wattage: APPLIANCE_WATTAGES.large }
            ]}
          />

          <ApplianceSection
            title="Washing Machine"
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'automatic', label: 'Automatic', wattage: APPLIANCE_WATTAGES.automatic },
              { value: 'semiautomatic', label: 'Semi-Automatic', wattage: APPLIANCE_WATTAGES.semiautomatic }
            ]}
          />

          <ApplianceSection
            title="Water Pump"
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'pump0_5', label: '0.5 HP Pump', wattage: APPLIANCE_WATTAGES.pump0_5 },
              { value: 'pump1', label: '1.0 HP Pump', wattage: APPLIANCE_WATTAGES.pump1 }
            ]}
          />

          <ApplianceSection
            title="Computer"
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'desktop', label: 'Desktop PC', wattage: APPLIANCE_WATTAGES.desktop },
              { value: 'gaming', label: 'Gaming PC', wattage: APPLIANCE_WATTAGES.gaming }
            ]}
          />

          <ApplianceSection
            title="Iron"
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'regular', label: 'Regular Iron', wattage: APPLIANCE_WATTAGES.regular },
              { value: 'steam', label: 'Steam Iron', wattage: APPLIANCE_WATTAGES.steam }
            ]}
          />

          <ApplianceSection
            title="Split AC"
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'ac1ton', label: '1.0 Ton AC', wattage: APPLIANCE_WATTAGES.ac1ton },
              { value: 'ac1_5ton', label: '1.5 Ton AC', wattage: APPLIANCE_WATTAGES.ac1_5ton },
              { value: 'ac2ton', label: '2.0 Ton AC', wattage: APPLIANCE_WATTAGES.ac2ton }
            ]}
          />

          <ApplianceSection
            title="Inverter AC"
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'inverter1ton', label: '1.0 Ton Inverter AC', wattage: APPLIANCE_WATTAGES.inverter1ton },
              { value: 'inverter1_5ton', label: '1.5 Ton Inverter AC', wattage: APPLIANCE_WATTAGES.inverter1_5ton },
              { value: 'inverter2ton', label: '2.0 Ton Inverter AC', wattage: APPLIANCE_WATTAGES.inverter2ton }
            ]}
          />

          <ApplianceSection
            title="Laptop"
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'laptop13', label: '13" Laptop', wattage: APPLIANCE_WATTAGES.laptop13 },
              { value: 'laptop15', label: '15" Laptop', wattage: APPLIANCE_WATTAGES.laptop15 },
              { value: 'laptop17', label: '17" Laptop', wattage: APPLIANCE_WATTAGES.laptop17 }
            ]}
          />

          <ApplianceSection
            title="Microwave"
            onUpdateTotals={handleUpdateTotals}
            options={[
              { value: 'microwave20', label: '20L Microwave', wattage: APPLIANCE_WATTAGES.microwave20 },
              { value: 'microwave25', label: '25L Microwave', wattage: APPLIANCE_WATTAGES.microwave25 },
              { value: 'microwave30', label: '30L Microwave', wattage: APPLIANCE_WATTAGES.microwave30 }
            ]}
          />

          <div className="mt-8 p-8 bg-black text-white rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Total Load</h3>
                <div className="text-3xl font-bold text-white mb-2">{totalWatts.toLocaleString()} Watts</div>
                <div className="text-lg text-gray-300">{totalKwh.toFixed(2)} kWh/day</div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-400">Battery Recommendation</h3>
                <select
                  value={batteryVoltage || ''}
                  onChange={(e) => setBatteryVoltage(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full p-3 mb-4 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  aria-label="Battery voltage"
                >
                  <option value="">--Select Battery Voltage--</option>
                  {BATTERY_VOLTAGES.map((voltage) => (
                    <option key={voltage.value} value={voltage.value}>
                      {voltage.label}
                    </option>
                  ))}
                </select>
                <div className="text-lg font-semibold text-orange-500">{batteryResult}</div>
              </div>
            </div>
          </div>
        </div>

        {batteryVoltage && loadProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8 px-1">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Complete Your Setup</h2>
                <p className="text-gray-500 text-sm mt-1">Recommended products for your load requirements</p>
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
                {loadProducts
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