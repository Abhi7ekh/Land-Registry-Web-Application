import React, { useState, useEffect } from "react";
import { getAllLands, getLandDetails, getAdmin } from "../services/contract";
import { toast, ToastContainer } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";

const LandHistory = () => {
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchAllLands();
    checkIfAdmin();
  }, []);

  const checkIfAdmin = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const user = await signer.getAddress();
      const admin = await getAdmin();

      setIsAdmin(user.toLowerCase() === admin.toLowerCase());
    } catch (err) {
      console.error("🔐 Error checking admin:", err);
    }
  };

  const fetchAllLands = async () => {
    try {
      const all = await getAllLands();
      setLands(all);
    } catch (err) {
      console.error("📦 Error fetching lands:", err);
      toast.error("❌ Failed to load lands.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLandDetails = async (id) => {
    try {
      const details = await getLandDetails(id);
      setSelectedLand(details);
    } catch (err) {
      console.error("📜 Error fetching land details:", err);
      toast.error("❌ Could not load land details.");
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          📜 Land Records & History
        </h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading all land data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Land List */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🏠 Lands</h2>
              {lands.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No lands registered yet.</p>
              ) : (
                <div className="max-h-[500px] overflow-y-auto space-y-3">
                  {lands.map((land) => (
                    <div
                      key={land.id}
                      onClick={() => fetchLandDetails(land.id)}
                      className={`p-4 border rounded-xl cursor-pointer transition ${
                        selectedLand?.id === land.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Land #{land.id}
                          </h3>
                          <p className="text-sm text-gray-600">{land.location}</p>
                          <p className="text-sm text-gray-600">{land.area}</p>
                          <p className="text-sm text-green-600 font-medium">
                            {land.price} ETH
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            land.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {land.isVerified ? "✅ Verified" : "⏳ Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Land Detail */}
            <div className="lg:col-span-2">
              {selectedLand ? (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    📄 Land #{selectedLand.id} Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Owner</p>
                      <p className="font-mono text-gray-800">{selectedLand.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-800">{selectedLand.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Area</p>
                      <p className="text-gray-800">{selectedLand.area}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-green-600 font-semibold">
                        {selectedLand.price} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedLand.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedLand.isVerified ? "✅ Verified" : "⏳ Pending"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Registered On</p>
                      <p className="text-gray-800">
                        {formatDate(selectedLand.registeredAt || Date.now() / 1000)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center py-20">
                  <div className="text-6xl mb-4">📂</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Select a Land
                  </h3>
                  <p className="text-gray-500">Click on a land to view its full details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandHistory;
