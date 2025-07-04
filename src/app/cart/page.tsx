"use client";
import React, { useState } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart } = useCart();
  const [selected, setSelected] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', payment: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleCheck = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, payment: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    // Email send
    try {
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          payment: form.payment,
          items: selectedItems,
          total: total.toLocaleString(),
        }),
      });
    } catch (err) {
      alert('Email send failed.');
    }
    // WhatsApp message generation
    const number = '923020029229'; // اپنا نمبر یہاں ڈال دیا گیا ہے
    const itemsText = selectedItems.map((item, i) => `${i+1}. ${item.title} - ${item.price}`).join('%0A');
    const msg = `New Order!%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AAddress: ${form.address}%0APayment: ${form.payment}%0AItems:%0A${itemsText}%0ATotal: ${total.toLocaleString()} PKR`;
    const url = `https://wa.me/${number}?text=${msg}`;
    window.open(url, '_blank');
    setSubmitted(true);
  };


  const selectedItems = cart.filter((item) => selected.includes(item._id));
  const total = selectedItems.reduce((sum, item) => sum + Number(item.price.replace(/[^\d.]/g, "")), 0);

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-gray-500 mb-4">Your cart is empty.</div>
      ) : (
        <ul className="divide-y divide-gray-200 mb-6">
          {cart.map((item) => (
            <li key={item._id} className="flex items-center py-4">
              <input
                type="checkbox"
                className="mr-4 h-5 w-5 text-primary focus:ring-primary"
                checked={selected.includes(item._id)}
                onChange={() => handleCheck(item._id)}
              />
              <span className="flex-1 font-medium text-lg">{item.title}</span>
              <span className="text-primary font-bold text-lg ml-4">{item.price}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between items-center mt-6">
        <div className="text-xl font-semibold">
          Total: <span className="text-primary">{total.toLocaleString()} PKR</span>
        </div>
        <button
          className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-orange-600 disabled:opacity-50"
          disabled={selected.length === 0}
          onClick={() => setShowModal(true)}
        >
          Buy Now
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="underline text-primary inline-flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Continue Shopping
        </Link>
      </div>
      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-primary text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >×</button>
            <h2 className="text-xl font-bold mb-4">Checkout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={form.name}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={form.phone}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Full Address</label>
                <textarea
                  name="address"
                  required
                  className="w-full border rounded px-3 py-2"
                  value={form.address}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Payment Method</label>
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center">
                    <input type="radio" name="payment" value="EasyPaisa" checked={form.payment === 'EasyPaisa'} onChange={handlePaymentChange} required className="mr-2" /> EasyPaisa
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="payment" value="JazzCash" checked={form.payment === 'JazzCash'} onChange={handlePaymentChange} required className="mr-2" /> JazzCash
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="payment" value="Bank Transfer" checked={form.payment === 'Bank Transfer'} onChange={handlePaymentChange} required className="mr-2" /> Bank Transfer
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="payment" value="COD" checked={form.payment === 'COD'} onChange={handlePaymentChange} required className="mr-2" /> Cash on Delivery (COD)
                  </label>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold mt-4 hover:bg-orange-600">Confirm Order</button>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Message */}
      {submitted && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">Order Sent to WhatsApp!</h2>
            <p className="mb-4">آپ کا آرڈر WhatsApp پر بھیج دیا گیا ہے۔<br />اگر WhatsApp خود نہ کھلے تو براہ مہربانی browser میں popups allow کریں۔</p>
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold mt-2" onClick={() => setSubmitted(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
