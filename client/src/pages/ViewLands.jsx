// client/src/pages/ViewLands.jsx

import React, { useEffect, useState } from "react";
import { getLandsByOwner, getCurrentUser } from "../services/contract";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewLands = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        const data = await getLandsByOwner(user);
        setLands(data);
      } catch (error) {
        console.error("Failed to fetch lands", error);
        toast.error("❌ Could not load your lands.");
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          🌍 Your Registered Lands
        </h1>

        {currentUser && (
          <p className="text-center text-gray-600 mb-8">
            Connected as: <span className="font-mono text-blue-700">{currentUser}</span>
          </p>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your lands...</p>
          </div>
        ) : lands.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏡</div>
            <p className="text-xl text-gray-700 font-medium mb-2">No Lands Found</p>
            <p className="text-gray-500 mb-6">
              It looks like you haven’t registered any lands yet.
            </p>
            <button
              onClick={() => window.location.href = "/register-land"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
            >
              ➕ Register Your First Land
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lands.map((land) => (
              <div key={land.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    Land #{land.id}
                  </h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      land.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {land.isVerified ? "✅ Verified" : "⏳ Pending"}
                  </span>
                </div>

                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-medium text-gray-600">📍 Location:</span>{" "}
                    {land.location}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">📐 Area:</span>{" "}
                    {land.area} sq ft
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">💰 Price:</span>{" "}
                    <span className="text-green-600 font-bold">{land.price} ETH</span>
                  </p>
                  {land.registeredAt && (
                    <p>
                      <span className="font-medium text-gray-600">📅 Registered On:</span>{" "}
                      {formatDate(land.registeredAt)}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex gap-2 border-t pt-4 border-gray-200">
                  <button
                    onClick={() => window.location.href = "/land-history"}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition"
                  >
                    📜 History
                  </button>
                  <button
                    onClick={() => window.location.href = "/transfer-land"}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm transition"
                  >
                    🔄 Transfer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewLands;
