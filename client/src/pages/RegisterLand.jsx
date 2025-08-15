// client/src/pages/RegisterLand.jsx

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerLand } from "../services/contract";

const RegisterLand = () => {
  const [form, setForm] = useState({ location: "", area: "", price: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { location, area, price } = form;

    if (!location || !area || !price) {
      toast.error("❗ Please fill in all fields");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to register this land?\nLocation: ${location}\nArea: ${area}\nPrice: ${price} ETH`
    );
    if (!confirm) return;

    toast.info("📤 Submitting to blockchain...");

    try {
      const success = await registerLand(location, area, price);
      if (success) {
        toast.success("✅ Land registered successfully!");
        setForm({ location: "", area: "", price: "" });
      }
    } catch (err) {
      console.error("❌ Submission failed:", err);
      toast.error("❌ Transaction failed. Check console for details.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        🏡 Register New Land
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="location"
          placeholder="Land Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-3 rounded-md"
        />
        <input
          type="text"
          name="area"
          placeholder="Area (e.g. 1200 sq ft)"
          value={form.area}
          onChange={handleChange}
          className="w-full border p-3 rounded-md"
        />
        <input
          type="text"
          name="price"
          placeholder="Price in ETH (e.g. 1.5)"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-3 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md text-lg hover:bg-green-700"
        >
          📥 Submit to Blockchain
        </button>
      </form>
    </div>
  );
};

export default RegisterLand;
