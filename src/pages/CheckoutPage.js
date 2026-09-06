import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, user, clearCart } = useCart();
  
  const [banks, setBanks] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Shipping State
  const [recipientName, setRecipientName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  const paymentMethod = location.state?.paymentMethod || 'online';
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    const fetchData = async () => {
      try {
        const [banksRes, waRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/banks`),
          axios.get(`${BASE_URL}/api/settings/whatsapp`)
        ]);
        setBanks(banksRes.data);
        setWhatsappNumber(waRes.data.number || '923001234567');
      } catch (error) {
        console.error('Error fetching checkout data', error);
      }
    };
    fetchData();
  }, [user, cartItems, navigate]);

  const handleApplyVoucher = async () => {
    setVoucherError('');
    setAppliedVoucher(null);

    if (paymentMethod === 'cod') {
        setVoucherError("Vouchers are not applicable on Cash on Delivery orders.");
        return;
    }

    if (!voucherCode.trim()) return;

    try {
        const response = await axios.post(`${BASE_URL}/api/vouchers/validate`, { code: voucherCode });
        const voucher = response.data;
        
        const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        if (subtotal < voucher.minOrderValue) {
            setVoucherError(`Minimum order value of ₨ ${voucher.minOrderValue} required.`);
            return;
        }

        setAppliedVoucher(voucher);
        setVoucherError('');
    } catch (error) {
        setVoucherError(error.response?.data?.message || 'Invalid Voucher');
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalDeliveryCharges = cartItems.reduce((total, item) => total + (item.deliveryCharges || 0), 0);

  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.applicability === 'all') {
        if (appliedVoucher.discountType === 'fixed') {
            discountAmount = Math.min(appliedVoucher.value, subtotal);
        } else {
            discountAmount = (subtotal * appliedVoucher.value) / 100;
        }
    } else {
        let eligibleSubtotal = 0;
        
        cartItems.forEach(item => {
            const isEligibleCat = appliedVoucher.applicability === 'category' && item.category === appliedVoucher.targetId;
            const isEligibleSec = appliedVoucher.applicability === 'section' && item.section === appliedVoucher.targetId;

            if (isEligibleCat || isEligibleSec) {
                eligibleSubtotal += (item.price * item.quantity);
            }
        });

        if (eligibleSubtotal > 0) {
             if (appliedVoucher.discountType === 'fixed') {
                 discountAmount = Math.min(appliedVoucher.value, eligibleSubtotal);
             } else {
                 discountAmount = (eligibleSubtotal * appliedVoucher.value) / 100;
             }
        }
    }
    discountAmount = Math.round(discountAmount);
  }

  let onlinePayable = 0;
  let codPayable = 0;
  let codTax = 0;

  if (paymentMethod === 'cod') {
    codTax = Math.round(subtotal * 0.04);
    onlinePayable = totalDeliveryCharges;
    codPayable = subtotal + codTax;
  } else {
    onlinePayable = (subtotal + totalDeliveryCharges) - discountAmount;
    codPayable = 0;
  }


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Check File Type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Only Images (JPEG, PNG, WEBP) and PDFs are allowed.");
        e.target.value = null; 
        setScreenshot(null);
        return;
      }

      // 2. Check File Size (5MB Limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("File is too large! Please upload a file smaller than 5MB.");
        e.target.value = null;
        setScreenshot(null);
        return;
      }

      setScreenshot(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!recipientName.trim()) { alert("Please enter recipient name."); return; }
    if (!shippingAddress.trim()) { alert("Please enter shipping address."); return; }
    
    // Validate Postal Code (Numeric)
    if (!/^\d+$/.test(postalCode)) { alert("Postal code must be a number."); return; }
    
    // Validate Contact Number (Exact 11 digits)
    if (!/^\d{11}$/.test(contactNumber)) { alert("Contact number must be exactly 11 digits."); return; }
    
    if (!selectedBank) { alert("Please select a bank account."); return; }
    if (!screenshot) { alert("Payment screenshot is mandatory."); return; }

    setLoading(true);

    // Amounts are recomputed and enforced by the server from the product
    // catalogue; these fields only describe *what* is being ordered.
    const formData = new FormData();
    formData.append('bankAccount', selectedBank);
    formData.append('paymentMethod', paymentMethod);
    if (appliedVoucher?.code) formData.append('voucherCode', appliedVoucher.code);
    formData.append('paymentScreenshot', screenshot);
    formData.append('recipientName', recipientName);
    formData.append('shippingAddress', shippingAddress);
    formData.append('postalCode', postalCode);
    formData.append('contactNumber', contactNumber);
    
    const productData = cartItems.map(item => ({
      product: item.id,
      quantity: item.quantity
    }));
    formData.append('products', JSON.stringify(productData));

    try {
      await axios.post(`${BASE_URL}/api/orders`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("Order submitted successfully! You will be notified via email once orrder is verified.");
      clearCart();
      navigate('/profile'); 
    } catch (error) {
      console.error("Order submission failed:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to submit order.";
      if (errorMessage.includes("Only images and PDFs are allowed")) {
         alert("Upload Error: The file you selected is not supported. Please upload an Image or PDF.");
      } else {
         alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            
            {/* SHIPPING INFO */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Recipient Name</label>
                  <input 
                    type="text" 
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number (11 digits)</label>
                    <input 
                        type="text" 
                        value={contactNumber}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, ''); // Allow only numbers
                            if (val.length <= 11) setContactNumber(val);
                        }}
                        placeholder="03001234567"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                        required
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Postal Code</label>
                    <input 
                        type="text" 
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))} // Allow only numbers
                        placeholder="54000"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                        required
                    />
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address</label>
                  <textarea 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows="3"
                    placeholder="House No, Street, Area, City"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Payment Required</h2>
              <div className="flex gap-4">
                <div className="flex-1 bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                  <p className="text-sm text-gray-500 uppercase font-bold">Pay Online Now</p>
                  <p className="text-2xl font-bold text-orange-600">₨ {onlinePayable.toLocaleString()}</p>
                  {discountAmount > 0 && <p className="text-xs text-green-600 font-bold mt-1">Voucher Applied: -₨ {discountAmount}</p>}
                  {paymentMethod === 'cod' && <p className="text-xs text-gray-400 mt-1">(Delivery Charges)</p>}
                </div>
                {codPayable > 0 && (
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                    <p className="text-sm text-gray-500 uppercase font-bold">Pay on Delivery</p>
                    <p className="text-2xl font-bold text-gray-800">₨ {codPayable.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">(Includes 4% Tax)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Voucher Section */}
            {paymentMethod === 'online' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-3">Apply Voucher</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            placeholder="Enter Code"
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none uppercase font-mono"
                        />
                        <button 
                            onClick={handleApplyVoucher}
                            className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                        >
                            Apply
                        </button>
                    </div>
                    {voucherError && <p className="text-red-500 text-sm mt-2 font-semibold">{voucherError}</p>}
                    {appliedVoucher && !voucherError && (
                        <div className="mt-3 bg-green-50 text-green-700 p-3 rounded-xl flex justify-between items-center">
                            <span><strong>{appliedVoucher.code}</strong> applied!</span>
                            {discountAmount === 0 && <span className="text-xs text-red-500">(Criteria not met)</span>}
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Select Bank Account</h2>
              <div className="space-y-3">
                {banks.map((bank) => (
                  <label key={bank.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${selectedBank === bank.id ? 'border-black bg-gray-50 ring-1 ring-black' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="bank" value={bank.id} checked={selectedBank === bank.id} onChange={(e) => setSelectedBank(e.target.value)} className="mt-1 mr-3" />
                    <div>
                      <p className="font-bold text-gray-900">{bank.bankName}</p>
                      <p className="text-sm text-gray-600">{bank.accountHolderName} - {bank.accountNumber}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Proof of Payment</h2>
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition hover:border-orange-400 group">
                <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={handleFileChange} />
                <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">📎</span>
                <span className="font-semibold text-gray-700">
                  {screenshot ? screenshot.name : "Upload Payment Screenshot"}
                </span>
                <span className="text-xs text-gray-400 block mt-1">
                    {screenshot ? 'Change File' : 'Supported: JPG, PNG, PDF (Max 5MB)'}
                </span>
              </label>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-500 shadow-sm shrink-0">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg></div>
              <div><p className="text-green-800 font-bold">Important Step!</p><p className="text-sm text-green-700 mb-1">Please also send your payment screenshot to our WhatsApp for faster verification.</p><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded hover:bg-green-700 transition">Send on WhatsApp</a></div>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition shadow-lg transform hover:-translate-y-1 disabled:opacity-50">{loading ? 'Submitting Order...' : 'Submit Order'}</button>
          </div>
        </div>
      </main>
    </div>
  );
}