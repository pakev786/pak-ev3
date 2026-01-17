import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminEVConfiguration() {
  const [activeTab, setActiveTab] = useState('chargers');
  const [chargers, setChargers] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [kits, setKits] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [ranges, setRanges] = useState([]);

  // Range Filters
  const [filterKit, setFilterKit] = useState('');
  const [filterBattery, setFilterBattery] = useState('');

  // Edit State
  const [editingId, setEditingId] = useState(null);

  // Forms
  const [chargerForm, setChargerForm] = useState({ name: '', price: '', amperes: '' });
  const [batteryForm, setBatteryForm] = useState({ name: '', price: '', boxPrice: '', amperes: '', selectedChargers: [] });
  const [kitForm, setKitForm] = useState({ name: '', price: '', fittingCost: '', topSpeed: '', selectedBatteries: [] });
  const [bikeForm, setBikeForm] = useState({ name: '', selectedKits: [] });
  const [rangeForm, setRangeForm] = useState({ kit: '', battery: '', range: '' });

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [c, b, k, bi, r] = await Promise.all([
          axios.get(`${BASE_URL}/api/ev/chargers`),
          axios.get(`${BASE_URL}/api/ev/batteries`),
          axios.get(`${BASE_URL}/api/ev/kits`),
          axios.get(`${BASE_URL}/api/ev/bikes`),
          axios.get(`${BASE_URL}/api/ev/ranges`)
      ]);
      setChargers(c.data);
      setBatteries(b.data);
      setKits(k.data);
      setBikes(bi.data);
      setRanges(r.data);
    } catch (error) { console.error("Error fetching data", error); }
  };

  const resetForms = () => {
      setEditingId(null);
      setChargerForm({ name: '', price: '', amperes: '' });
      setBatteryForm({ name: '', price: '', boxPrice: '', amperes: '', selectedChargers: [] });
      setKitForm({ name: '', price: '', fittingCost: '', topSpeed: '', selectedBatteries: [] });
      setBikeForm({ name: '', selectedKits: [] });
      setRangeForm({ kit: '', battery: '', range: '' });
  };

  const handleSubmit = async (e, type, data, endpoint) => {
      e.preventDefault();
      try {
          if (editingId) {
              await axios.put(`${BASE_URL}/api/ev/${endpoint}/${editingId}`, data);
          } else {
              await axios.post(`${BASE_URL}/api/ev/${endpoint}`, data);
          }
          resetForms();
          fetchData();
      } catch (error) { alert('Operation failed'); }
  };

  const handleEdit = (item, type) => {
      setEditingId(item.id);
      if(type === 'charger') setChargerForm({ name: item.name, price: item.price, amperes: item.amperes });
      if(type === 'battery') setBatteryForm({ name: item.name, price: item.price, boxPrice: item.boxPrice, amperes: item.amperes, selectedChargers: item.chargers.map(c => c?.id || c) });
      if(type === 'kit') setKitForm({ name: item.name, price: item.price, fittingCost: item.fittingCost, topSpeed: item.topSpeed, selectedBatteries: item.batteries.map(b => b?.id || b) });
      if(type === 'bike') setBikeForm({ name: item.name, selectedKits: item.kits.map(k => k?.id || k) });
      if(type === 'range') setRangeForm({ kit: item.kit?.id || item.kit, battery: item.battery?.id || item.battery, range: item.range });
  };

  const deleteItem = async (type, id) => {
      if(!window.confirm("Delete item?")) return;
      try { await axios.delete(`${BASE_URL}/api/ev/${type}/${id}`); fetchData(); } catch (error) { alert('Failed to delete'); }
  };

  const toggleSelection = (id, list, setList) => {
      setList(list.includes(id) ? list.filter(item => item !== id) : [...list, id]);
  };

  // Helper to safely get ID
  const getId = (item) => item?.id || item?._id || item;

  // Filtered Ranges Logic
  const getFilteredRanges = () => {
      return ranges.filter(r => {
          const rKitId = getId(r.kit);
          const rBatId = getId(r.battery);

          const matchesKit = filterKit ? rKitId === filterKit : true;
          const matchesBattery = filterBattery ? rBatId === filterBattery : true;

          return matchesKit && matchesBattery;
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <AdminNavbar active="ev-prices" />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">EV Configuration {editingId ? '(Editing Mode)' : ''}</h1>
        {editingId && <button onClick={resetForms} className="mb-4 text-sm underline text-red-500">Cancel Edit</button>}

        <div className="flex space-x-4 mb-8 border-b overflow-x-auto">
          {['chargers', 'batteries', 'kits', 'bikes', 'ranges'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); resetForms(); }} className={`pb-2 px-4 capitalize font-bold border-b-2 ${activeTab === tab ? 'border-black' : 'border-transparent text-gray-400'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* CHARGERS */}
        {activeTab === 'chargers' && (
            <div className="space-y-6">
                <form onSubmit={(e) => handleSubmit(e, 'charger', chargerForm, 'chargers')} className="bg-white p-6 rounded-xl shadow-sm flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[200px]"><label className="text-xs font-bold text-gray-400">Name</label><input value={chargerForm.name} onChange={e=>setChargerForm({...chargerForm, name: e.target.value})} className="border p-2 rounded w-full" placeholder="3A Charger" required/></div>
                    <div className="w-32"><label className="text-xs font-bold text-gray-400">Amperes (A)</label><input type="number" value={chargerForm.amperes} onChange={e=>setChargerForm({...chargerForm, amperes: e.target.value})} className="border p-2 rounded w-full" required/></div>
                    <div className="w-32"><label className="text-xs font-bold text-gray-400">Price</label><input type="number" value={chargerForm.price} onChange={e=>setChargerForm({...chargerForm, price: e.target.value})} className="border p-2 rounded w-full" required/></div>
                    <button className="bg-black text-white px-6 py-2 rounded font-bold">{editingId ? 'Update' : 'Add'}</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {chargers.map(c => (
                        <div key={getId(c)} className="bg-white p-4 rounded shadow-sm border flex justify-between">
                            <div><p className="font-bold">{c.name}</p><p className="text-sm text-gray-500">{c.amperes}A | Rs. {c.price}</p></div>
                            <div className="flex flex-col gap-2">
                                <button onClick={()=>handleEdit(c, 'charger')} className="text-blue-500 text-sm font-bold">Edit</button>
                                <button onClick={()=>deleteItem('chargers', getId(c))} className="text-red-500 text-sm font-bold">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* BATTERIES */}
        {activeTab === 'batteries' && (
            <div className="space-y-6">
                <form onSubmit={(e) => handleSubmit(e, 'battery', { ...batteryForm, chargers: batteryForm.selectedChargers }, 'batteries')} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2"><label className="text-xs font-bold text-gray-400">Name</label><input value={batteryForm.name} onChange={e=>setBatteryForm({...batteryForm, name: e.target.value})} className="border p-2 rounded w-full" required/></div>
                        <div><label className="text-xs font-bold text-gray-400">Amperes (Ah)</label><input type="number" value={batteryForm.amperes} onChange={e=>setBatteryForm({...batteryForm, amperes: e.target.value})} className="border p-2 rounded w-full" required/></div>
                        <div><label className="text-xs font-bold text-gray-400">Price</label><input type="number" value={batteryForm.price} onChange={e=>setBatteryForm({...batteryForm, price: e.target.value})} className="border p-2 rounded w-full" required/></div>
                        <div><label className="text-xs font-bold text-gray-400">Box Price</label><input type="number" value={batteryForm.boxPrice} onChange={e=>setBatteryForm({...batteryForm, boxPrice: e.target.value})} className="border p-2 rounded w-full" required/></div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-2">Compatible Chargers</label>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                            {chargers.map(c => (
                                <label key={getId(c)} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded border cursor-pointer hover:bg-gray-100">
                                    <input type="checkbox" checked={batteryForm.selectedChargers.includes(getId(c))} onChange={()=>toggleSelection(getId(c), batteryForm.selectedChargers, (val)=>setBatteryForm({...batteryForm, selectedChargers: val}))} />
                                    <span className="text-sm">{c.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button className="bg-black text-white px-6 py-2 rounded font-bold w-full">{editingId ? 'Update' : 'Add'} Battery</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {batteries.map(b => (
                        <div key={getId(b)} className="bg-white p-4 rounded shadow-sm border">
                            <div className="flex justify-between mb-2">
                                <h3 className="font-bold">{b.name}</h3>
                                <div className="space-x-2">
                                    <button onClick={()=>handleEdit(b, 'battery')} className="text-blue-500 text-sm font-bold">Edit</button>
                                    <button onClick={()=>deleteItem('batteries', getId(b))} className="text-red-500 text-sm font-bold">Delete</button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{b.amperes}Ah | Price: {b.price} | Box: {b.boxPrice}</p>
                            <p className="text-xs text-gray-400 mt-1">Chargers: {b.chargers?.length || 0} linked</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* KITS */}
        {activeTab === 'kits' && (
            <div className="space-y-6">
                <form onSubmit={(e) => handleSubmit(e, 'kit', { ...kitForm, batteries: kitForm.selectedBatteries }, 'kits')} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2"><label className="text-xs font-bold text-gray-400">Name</label><input value={kitForm.name} onChange={e=>setKitForm({...kitForm, name: e.target.value})} className="border p-2 rounded w-full" required/></div>
                        <div><label className="text-xs font-bold text-gray-400">Top Speed</label><input value={kitForm.topSpeed} onChange={e=>setKitForm({...kitForm, topSpeed: e.target.value})} className="border p-2 rounded w-full" required/></div>
                        <div><label className="text-xs font-bold text-gray-400">Price</label><input type="number" value={kitForm.price} onChange={e=>setKitForm({...kitForm, price: e.target.value})} className="border p-2 rounded w-full" required/></div>
                        <div><label className="text-xs font-bold text-gray-400">Fitting Cost</label><input type="number" value={kitForm.fittingCost} onChange={e=>setKitForm({...kitForm, fittingCost: e.target.value})} className="border p-2 rounded w-full" required/></div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-2">Compatible Batteries</label>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                            {batteries.map(b => (
                                <label key={getId(b)} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded border cursor-pointer hover:bg-gray-100">
                                    <input type="checkbox" checked={kitForm.selectedBatteries.includes(getId(b))} onChange={()=>toggleSelection(getId(b), kitForm.selectedBatteries, (val)=>setKitForm({...kitForm, selectedBatteries: val}))} />
                                    <span className="text-sm">{b.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button className="bg-black text-white px-6 py-2 rounded font-bold w-full">{editingId ? 'Update' : 'Add'} Kit</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {kits.map(k => (
                        <div key={getId(k)} className="bg-white p-4 rounded shadow-sm border">
                            <div className="flex justify-between mb-2">
                                <h3 className="font-bold">{k.name}</h3>
                                <div className="space-x-2">
                                    <button onClick={()=>handleEdit(k, 'kit')} className="text-blue-500 text-sm font-bold">Edit</button>
                                    <button onClick={()=>deleteItem('kits', getId(k))} className="text-red-500 text-sm font-bold">Delete</button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Speed: {k.topSpeed} | Price: {k.price} | Fitting: {k.fittingCost}</p>
                            <p className="text-xs text-gray-400 mt-1">Batteries: {k.batteries?.length || 0} linked</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* BIKES */}
        {activeTab === 'bikes' && (
            <div className="space-y-6">
                <form onSubmit={(e) => handleSubmit(e, 'bike', { name: bikeForm.name, kits: bikeForm.selectedKits }, 'bikes')} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                    <div><label className="text-xs font-bold text-gray-400">Bike Name</label><input value={bikeForm.name} onChange={e=>setBikeForm({...bikeForm, name: e.target.value})} className="border p-2 rounded w-full" required/></div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-2">Compatible Kits</label>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                            {kits.map(k => (
                                <label key={getId(k)} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded border cursor-pointer hover:bg-gray-100">
                                    <input type="checkbox" checked={bikeForm.selectedKits.includes(getId(k))} onChange={()=>toggleSelection(getId(k), bikeForm.selectedKits, (val)=>setBikeForm({...bikeForm, selectedKits: val}))} />
                                    <span className="text-sm">{k.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button className="bg-black text-white px-6 py-2 rounded font-bold">{editingId ? 'Update' : 'Add'} Bike</button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {bikes.map(b => (
                        <div key={getId(b)} className="bg-white p-4 rounded shadow-sm border">
                            <div className="flex justify-between mb-2">
                                <h3 className="font-bold text-xl">{b.name}</h3>
                                <div className="space-x-2">
                                    <button onClick={()=>handleEdit(b, 'bike')} className="text-blue-500 text-sm font-bold">Edit</button>
                                    <button onClick={()=>deleteItem('bikes', getId(b))} className="text-red-500 text-sm font-bold">Delete</button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Kits: {b.kits?.length || 0} linked</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* RANGES (FILTERABLE) */}
        {activeTab === 'ranges' && (
            <div className="space-y-6">
                
                {/* 1. INPUT FORM */}
                <form onSubmit={(e) => handleSubmit(e, 'range', rangeForm, 'ranges')} className="bg-white p-6 rounded-xl shadow-sm space-y-4 border-l-4 border-black">
                    <h3 className="font-bold text-lg">{editingId ? 'Edit Range' : 'Add New Range'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400">Kit</label>
                            <select value={rangeForm.kit} onChange={e=>setRangeForm({...rangeForm, kit: e.target.value})} className="border p-2 rounded w-full" required>
                                <option value="">Select Kit</option>
                                {kits.map(k => <option key={getId(k)} value={getId(k)}>{k.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400">Battery</label>
                            <select value={rangeForm.battery} onChange={e=>setRangeForm({...rangeForm, battery: e.target.value})} className="border p-2 rounded w-full" required>
                                <option value="">Select Battery</option>
                                {batteries.map(b => <option key={getId(b)} value={getId(b)}>{b.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400">Range (e.g. 50-60)</label>
                            <input value={rangeForm.range} onChange={e=>setRangeForm({...rangeForm, range: e.target.value})} className="border p-2 rounded w-full" placeholder="50-60" required/>
                        </div>
                    </div>
                    <button className="bg-black text-white px-6 py-2 rounded font-bold w-full">{editingId ? 'Update' : 'Add'} Range Definition</button>
                </form>

                {/* 2. FILTERS */}
                <div className="bg-gray-200 p-4 rounded-lg flex gap-4 items-center">
                    <span className="font-bold text-sm uppercase">Filters:</span>
                    <select value={filterKit} onChange={e=>setFilterKit(e.target.value)} className="border p-2 rounded text-sm w-48">
                        <option value="">All Kits</option>
                        {kits.map(k => <option key={getId(k)} value={getId(k)}>{k.name}</option>)}
                    </select>
                    <select value={filterBattery} onChange={e=>setFilterBattery(e.target.value)} className="border p-2 rounded text-sm w-48">
                        <option value="">All Batteries</option>
                        {batteries.map(b => <option key={getId(b)} value={getId(b)}>{b.name}</option>)}
                    </select>
                    {(filterKit || filterBattery) && (
                        <button onClick={() => {setFilterKit(''); setFilterBattery('')}} className="text-red-500 text-xs underline">Clear Filters</button>
                    )}
                </div>

                {/* 3. DISPLAY GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getFilteredRanges().length === 0 ? <p className="text-gray-500">No ranges found matching filters.</p> : null}
                    
                    {getFilteredRanges().map(r => (
                        <div key={getId(r)} className="bg-white p-4 rounded shadow-sm border flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">{r.range} km</p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-blue-600">{r.kit?.name || 'Unknown Kit'}</span> + <span className="font-semibold text-green-600">{r.battery?.name || 'Unknown Battery'}</span>
                                </p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={()=>handleEdit(r, 'range')} className="text-blue-500 text-sm font-bold">Edit</button>
                                <button onClick={()=>deleteItem('ranges', getId(r))} className="text-red-500 text-sm font-bold">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>
    </div>
  );
}