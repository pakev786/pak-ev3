import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminHome() {
  const [banners, setBanners] = useState({});
  const [loading, setLoading] = useState(true);
  
  // --- Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [modalFormData, setModalFormData] = useState({
    imageFile: null,
    linkType: 'none',
    linkValue: ''
  });
  const [modalPreview, setModalPreview] = useState(null);
  const [savingBanner, setSavingBanner] = useState(false);

  // --- Data for Selects ---
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionsList, setSectionsList] = useState([]); 
  
  const [secInputValue, setSecInputValue] = useState('');
  const [secIsMarquee, setSecIsMarquee] = useState(false);
  const [isSecInputVisible, setIsSecInputVisible] = useState(false);
  const [editingSecId, setEditingSecId] = useState(null);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);
  const secInputRef = useRef(null);
  
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const BANNERS_API_URL = `${BASE_URL}/api/banners`;
  const SEC_API_URL = `${BASE_URL}/api/sections`;
  const CAT_API_URL = `${BASE_URL}/api/categories`;


  const STATIC_ROUTES = [
    { label: 'EV Calculator', value: '/ev-calculator' },
    { label: 'Load Calculator', value: '/load-calculator' },
    { label: 'Branches', value: '/branches' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (secInputRef.current && !secInputRef.current.contains(event.target)) {
        closeSecInput();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bannersRes, sectionsRes, catsRes] = await Promise.all([
        axios.get(BANNERS_API_URL),
        axios.get(SEC_API_URL),
        axios.get(CAT_API_URL)
      ]);
      setBanners(bannersRes.data);
      setSectionsList(sectionsRes.data);
      setCategories(catsRes.data);
      setSections(sectionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBannerModal = (slot, label) => {
    const currentBanner = banners[slot];
    setEditingSlot({ slot, label });
    
    setModalFormData({
      imageFile: null,
      linkType: currentBanner?.linkType || 'none',
      linkValue: currentBanner?.linkValue || ''
    });
    
    if (currentBanner?.image) {
      setModalPreview(`${BASE_URL}${currentBanner.image}`);
    } else {
      setModalPreview(null);
    }

    setIsModalOpen(true);
  };

  const closeBannerModal = () => {
    setIsModalOpen(false);
    setEditingSlot(null);
    setModalFormData({ imageFile: null, linkType: 'none', linkValue: '' });
    setModalPreview(null);
  };

  const handleModalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModalFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => setModalPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!editingSlot) return;
    
    if (!modalPreview) {
        alert("Please upload an image for the banner.");
        return;
    }

    setSavingBanner(true);
    const formData = new FormData();
    if (modalFormData.imageFile) {
        formData.append('image', modalFormData.imageFile);
    }
    formData.append('linkType', modalFormData.linkType);
    formData.append('linkValue', modalFormData.linkValue);

    try {
      const response = await axios.post(`${BANNERS_API_URL}/${editingSlot.slot}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBanners(prev => ({ ...prev, [editingSlot.slot]: response.data }));
      closeBannerModal();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to save banner');
    } finally {
      setSavingBanner(false);
    }
  };

  const getImageUrl = (slot) => {
    if (banners[slot] && banners[slot].image) {
      return `${BASE_URL}${banners[slot].image}`;
    }
    return null;
  };

  const BannerSlot = ({ slot, label, className }) => {
    const hasImage = !!getImageUrl(slot);
    
    return (
      <div 
        onClick={() => openBannerModal(slot, label)}
        className={`relative group overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-orange-400 transition-colors ${className}`}
      >
        {hasImage ? (
          <img 
            src={getImageUrl(slot)} 
            alt={label} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <span className="text-4xl mb-2">+</span>
            <span className="text-sm font-semibold">{label}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white text-black px-4 py-2 rounded-full font-bold shadow-lg">Edit</span>
        </div>

        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md pointer-events-none">
          {label}
        </div>
      </div>
    );
  };

  // --- SECTIONS LOGIC ---
  const openSecInput = (e) => {
    e.stopPropagation();
    setEditingSecId(null);
    setSecInputValue('');
    setSecIsMarquee(false);
    setIsSecInputVisible(true);
  };

  const closeSecInput = () => {
    setIsSecInputVisible(false);
    setSecInputValue('');
    setSecIsMarquee(false);
    setEditingSecId(null);
  };

  const handleSecEdit = (e, sec) => {
    e.stopPropagation();
    setEditingSecId(sec.id);
    setSecInputValue(sec.name);
    setSecIsMarquee(sec.isMarquee || false);
    setIsSecInputVisible(true);
  };

  const handleSecDelete = async (id) => {
    if (window.confirm("Delete this section?")) {
      try {
        await axios.delete(`${SEC_API_URL}/${id}`);
        setSectionsList(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        alert('Failed to delete section');
      }
    }
  };

  const handleSecSubmit = async (e) => {
    e.preventDefault();
    if (!secInputValue.trim()) return;
    
    try {
      if (editingSecId) {
        const res = await axios.put(`${SEC_API_URL}/${editingSecId}`, { 
          name: secInputValue,
          isMarquee: secIsMarquee
        });
        setSectionsList(prev => prev.map(s => s.id === editingSecId ? res.data : s));
      } else {
        const res = await axios.post(SEC_API_URL, { 
          name: secInputValue,
          isMarquee: secIsMarquee
        });
        setSectionsList(prev => [...prev, res.data]);
      }
      closeSecInput();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving section');
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault(); 
    if (draggedSectionIndex === null || draggedSectionIndex === index) return;
    const newSections = [...sectionsList];
    const draggedItem = newSections[draggedSectionIndex];
    newSections.splice(draggedSectionIndex, 1);
    newSections.splice(index, 0, draggedItem);
    setSectionsList(newSections);
    setDraggedSectionIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedSectionIndex(null);
    try {
      const orderedIds = sectionsList.map(s => s.id);
      await axios.put(`${SEC_API_URL}/reorder`, { orderedIds });
    } catch (error) {
      console.error('Failed to save new order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <AdminNavbar active="home" />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Homepage Controller</h1>
          <p className="text-gray-600">Manage your main banner images and page layout sections</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
          <div className="mb-8 flex justify-between items-end">
             <div>
                <h2 className="text-2xl font-bold text-gray-900">1. Hero Banners</h2>
                <p className="text-gray-500 mt-1">Click any slot below to edit the image and link.</p>
             </div>
             <div className="hidden md:block text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold">Live Layout</div>
          </div>
          {loading ? (
             <div className="h-96 flex items-center justify-center bg-gray-50 rounded-2xl">Loading Layout...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] md:h-[500px]">
              <BannerSlot slot="main" label="Main Banner (Big)" className="h-64 md:h-full" />
              <div className="grid grid-cols-2 gap-4 h-full">
                <BannerSlot slot="side1" label="Top Left" className="h-32 md:h-auto" />
                <BannerSlot slot="side2" label="Top Right" className="h-32 md:h-auto" />
                <BannerSlot slot="side3" label="Bottom Left" className="h-32 md:h-auto" />
                <BannerSlot slot="side4" label="Bottom Right" className="h-32 md:h-auto" />
              </div>
            </div>
          )}
        </div>

        {/* --- BANNER EDIT MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Edit {editingSlot?.label}</h3>
                <button onClick={closeBannerModal} className="text-gray-400 hover:text-red-500 text-2xl">&times;</button>
              </div>
              
              <form onSubmit={handleSaveBanner} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image</label>
                  <div className="relative h-48 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 group">
                    {modalPreview ? (
                        <img src={modalPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold">
                        {modalPreview ? 'Replace Image' : 'Upload Image'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleModalFileChange} />
                    </label>
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Link To</label>
                    <select 
                        className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
                        value={modalFormData.linkType}
                        onChange={(e) => setModalFormData({...modalFormData, linkType: e.target.value, linkValue: ''})}
                    >
                        <option value="none">No Link</option>
                        <option value="static">Static Page (e.g., Calculators)</option>
                        <option value="category">Category</option>
                        <option value="section">Section</option>
                        <option value="external">External Link (URL)</option>
                    </select>
                </div>

                {modalFormData.linkType !== 'none' && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                           {modalFormData.linkType === 'external' ? 'Enter Full URL' : 'Select Target'}
                        </label>
                        
                        {modalFormData.linkType === 'static' && (
                            <select 
                                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
                                value={modalFormData.linkValue}
                                onChange={(e) => setModalFormData({...modalFormData, linkValue: e.target.value})}
                            >
                                <option value="">-- Select Page --</option>
                                {STATIC_ROUTES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                        )}

                        {modalFormData.linkType === 'category' && (
                            <select 
                                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
                                value={modalFormData.linkValue}
                                onChange={(e) => setModalFormData({...modalFormData, linkValue: e.target.value})}
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        )}

                        {modalFormData.linkType === 'section' && (
                            <select 
                                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
                                value={modalFormData.linkValue}
                                onChange={(e) => setModalFormData({...modalFormData, linkValue: e.target.value})}
                            >
                                <option value="">-- Select Section --</option>
                                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        )}

                        {modalFormData.linkType === 'external' && (
                            <input 
                                type="url"
                                placeholder="https://example.com"
                                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:border-orange-500"
                                value={modalFormData.linkValue}
                                onChange={(e) => setModalFormData({...modalFormData, linkValue: e.target.value})}
                            />
                        )}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={savingBanner}
                    className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition"
                >
                    {savingBanner ? 'Saving...' : 'Save Banner'}
                </button>
              </form>
            </div>
          </div>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">2. Homepage Sections</h2>
              <p className="text-gray-500">Create and reorder the product sections that appear below the hero banner.</p>
            </div>
            <button onClick={openSecInput} disabled={isSecInputVisible} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${isSecInputVisible ? 'bg-gray-300' : 'bg-black text-white hover:bg-orange-600'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            </button>
          </div>

          {isSecInputVisible && (
            <div ref={secInputRef} className="mb-6 bg-white p-6 rounded-2xl shadow-xl border-l-4 border-black">
              <h3 className="font-bold mb-3">{editingSecId ? 'Edit Section' : 'New Section'}</h3>
              <form onSubmit={handleSecSubmit} className="flex gap-4 items-center">
                <input 
                  autoFocus
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"
                  placeholder="Section Name"
                  value={secInputValue}
                  onChange={e => setSecInputValue(e.target.value)}
                />
                <label className="flex items-center gap-2 cursor-pointer bg-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 transition">
                  <input type="checkbox" checked={secIsMarquee} onChange={e => setSecIsMarquee(e.target.checked)} className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300" />
                  <span className="text-sm font-semibold text-gray-700">Marquee Mode</span>
                </label>
                <button type="submit" className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition">Save</button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {sectionsList.length === 0 ? (
              <p className="text-center text-gray-400 py-12">No sections defined yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {sectionsList.map((section, index) => (
                  <li 
                    key={section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-4 flex items-center justify-between group transition-colors cursor-move ${draggedSectionIndex === index ? 'bg-orange-50 opacity-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-gray-300 group-hover:text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-gray-800">{section.name}</span>
                          {section.isMarquee && <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">Marquee</span>}
                        </div>
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Row: {index + 1}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handleSecEdit(e, section)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">Edit</button>
                      <button onClick={() => handleSecDelete(section.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}