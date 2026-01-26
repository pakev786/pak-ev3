import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = ({ onCancel, onSuccess, productToEdit = null }) => {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [extraPreviews, setExtraPreviews] = useState([]);

  const [formData, setFormData] = useState({
    image: null,
    extraImages: [],
    title: '',
    description: '',
    price: '',
    optionalPrice: '',
    category: '',
    section: '',
    youtubeLink: '',
    codAvailable: true,
    isAvailable: true,
    deliveryCharges: 0,
    deliveryTimeMin: 3,
    deliveryTimeMax: 5,
    warranty: 0
  });

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, secRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/categories`),
          axios.get(`${BASE_URL}/api/sections`)
        ]);
        setCategories(catRes.data);
        setSections(secRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (productToEdit) {
      const getID = (field) => {
        if (!field) return '';
        if (typeof field === 'object') return field.id || field._id || '';
        return field; 
      };

      setFormData({
        image: null, 
        extraImages: [],
        title: productToEdit.title || '',
        description: productToEdit.description || '',
        price: productToEdit.price || '',
        optionalPrice: productToEdit.optionalPrice || '',
        category: getID(productToEdit.category),
        section: getID(productToEdit.section),
        youtubeLink: productToEdit.youtubeLink || '',
        codAvailable: productToEdit.codAvailable !== undefined ? productToEdit.codAvailable : true,
        isAvailable: productToEdit.isAvailable !== undefined ? productToEdit.isAvailable : true,
        deliveryCharges: productToEdit.deliveryCharges || 0,
        deliveryTimeMin: productToEdit.deliveryTimeMin || 3,
        deliveryTimeMax: productToEdit.deliveryTimeMax || 5,
        warranty: productToEdit.warranty || 0
      });
      
      if (productToEdit.image) {
        setImagePreview(`${BASE_URL}${productToEdit.image}`);
      }
      
      if (productToEdit.extraImages && productToEdit.extraImages.length > 0) {
        const formatted = productToEdit.extraImages.map(img => ({
            src: `${BASE_URL}${img}`,
            file: null,
            originalUrl: img 
        }));
        setExtraPreviews(formatted);
      }
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Cover image must be smaller than 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExtraImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 5MB). Skipped.`);
        return;
      }
      newFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
          setExtraPreviews(prev => [...prev, { src: reader.result, file: file, originalUrl: null }]);
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({ ...prev, extraImages: [...prev.extraImages, ...newFiles] }));
  };

  // --- FIXED: Visual Remove Only ---
  const handleRemoveCover = () => {
    // Just clear the UI state. Do NOT call the backend DELETE endpoint here.
    // The backend update (PUT) will handle replacing the file when you submit.
    if (window.confirm("Remove current cover image? You must upload a new one to save.")) {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
    }
  };

  const handleRemoveExtra = async (index) => {
    if (!window.confirm("Remove this image?")) return;

    const itemToRemove = extraPreviews[index];

    // 1. If it's a new file (client side), just remove from state
    if (itemToRemove.file) {
        const updatedFiles = formData.extraImages.filter(f => f !== itemToRemove.file);
        setFormData(prev => ({ ...prev, extraImages: updatedFiles }));
        setExtraPreviews(prev => prev.filter((_, i) => i !== index));
    } 
    // 2. If it's on server, we CAN delete it immediately because extraImages is not required
    else if (itemToRemove.originalUrl) {
        try {
            await axios.delete(`${BASE_URL}/api/products/${productToEdit.id}/images`, {
                data: { imageUrl: itemToRemove.originalUrl, type: 'extra' }
            });
            setExtraPreviews(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error deleting image", error);
            alert("Failed to delete image.");
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- GRACEFUL ERROR HANDLING ---
    // Check if we have a file selected OR an existing preview
    // If imagePreview is null, it means the user removed the cover and didn't add a new one.
    if (!imagePreview) {
        alert("A cover image is required. Please upload one before saving.");
        return;
    }

    if (!formData.title || !formData.price || !formData.category) {
      alert("Please fill in all required fields (Title, Price, Category).");
      return;
    }

    setLoading(true);
    const data = new FormData();
    
    if (formData.image) data.append('image', formData.image);
    if (formData.extraImages.length > 0) {
      formData.extraImages.forEach(file => data.append('extraImages', file));
    }

    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('youtubeLink', formData.youtubeLink);

    if (formData.optionalPrice && Number(formData.optionalPrice) > 0) {
      data.append('optionalPrice', formData.optionalPrice);
    } 
    
    data.append('category', formData.category);
    data.append('codAvailable', formData.codAvailable);
    data.append('isAvailable', formData.isAvailable);
    data.append('deliveryCharges', formData.deliveryCharges);
    data.append('deliveryTimeMin', formData.deliveryTimeMin);
    data.append('deliveryTimeMax', formData.deliveryTimeMax);
    data.append('warranty', formData.warranty);
    
    if (formData.section) {
        data.append('section', formData.section);
    } else {
        data.append('section', '');
    }

    try {
      if (productToEdit) {
        await axios.put(`${BASE_URL}/api/products/${productToEdit.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post(`${BASE_URL}/api/products`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200 max-w-3xl mx-auto relative animate-fade-in-down">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm text-white ${productToEdit ? 'bg-orange-500' : 'bg-black'}`}>{productToEdit ? '✎' : '+'}</span>
        {productToEdit ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Images */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Cover Image <span className="text-red-500">*</span></label>
          <div className="flex items-center justify-center w-full">
            <div className="w-full relative">
                {imagePreview ? (
                    <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                         <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-contain p-2" />
                         {/* REMOVE BUTTON */}
                         <button 
                            type="button" 
                            onClick={handleRemoveCover}
                            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition"
                         >✕</button>
                    </div>
                ) : (
                    <label htmlFor="cover-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <span className="text-sm text-gray-500">Click to upload cover</span>
                        </div>
                        <input id="cover-file" type="file" className="hidden" onChange={handleCoverImageChange} accept="image/*" />
                    </label>
                )}
            </div>
          </div>
        </div>

        {/* ... Rest of the form remains unchanged ... */}
        {/* Extra Images */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Extra Images</label>
          <div className="flex flex-wrap gap-4">
            {extraPreviews.map((item, idx) => (
              <div key={idx} className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden relative group">
                <img src={item.src} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                 <button 
                    type="button" 
                    onClick={() => handleRemoveExtra(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center shadow hover:bg-red-600"
                 >✕</button>
              </div>
            ))}
            <label htmlFor="extra-files" className="w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center">
              <span className="text-2xl text-gray-400">+</span>
              <input id="extra-files" type="file" className="hidden" multiple onChange={handleExtraImagesChange} accept="image/*" />
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
        </div>

        {/* YouTube Link */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">YouTube Video Link</label>
          <div className="relative">
             <span className="absolute left-3 top-3 text-red-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
             </span>
             <input 
                type="text" 
                name="youtubeLink" 
                placeholder="https://youtu.be/..." 
                value={formData.youtubeLink} 
                onChange={handleInputChange} 
                className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Product details, specs, etc." />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Compare Price</label>
            <input type="number" name="optionalPrice" value={formData.optionalPrice} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>

        {/* Shipping & Warranty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Cost</label>
            <input type="number" name="deliveryCharges" value={formData.deliveryCharges} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Time (Days)</label>
            <div className="flex gap-2">
              <input type="number" name="deliveryTimeMin" value={formData.deliveryTimeMin} onChange={handleInputChange} placeholder="Min" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-center" />
              <input type="number" name="deliveryTimeMax" value={formData.deliveryTimeMax} onChange={handleInputChange} placeholder="Max" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-center" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Warranty (Days)</label>
            <input type="number" name="warranty" value={formData.warranty} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="flex items-center cursor-pointer gap-3">
              <input type="checkbox" name="codAvailable" checked={formData.codAvailable} onChange={handleInputChange} className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" />
              <span className="font-semibold text-gray-700">COD Available</span>
            </label>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="flex items-center cursor-pointer gap-3">
              <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} className="w-5 h-5 text-green-500 focus:ring-green-500 border-gray-300 rounded" />
              <span className="font-semibold text-gray-700">Available / In Stock</span>
            </label>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white">
              <option value="">-- Select --</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Section</label>
            <select name="section" value={formData.section} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white">
              <option value="">-- None --</option>
              {sections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          {onCancel && <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-600 hover:text-gray-900 font-semibold transition">Cancel</button>}
          <button type="submit" disabled={loading} className="px-8 py-3 bg-black text-white font-bold rounded-lg shadow-md hover:bg-orange-600 transition">{loading ? 'Saving...' : (productToEdit ? 'Update' : 'Create')}</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;