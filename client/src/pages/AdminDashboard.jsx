import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLands, getCurrentUser, getAdmin, verifyLand } from "../services/contract";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [stats, setStats] = useState({ totalLands: 0, verifiedLands: 0 });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [admin, setAdmin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [allLands, userAddress, adminAddress] = await Promise.all([
        getAllLands(),
        getCurrentUser(),
        getAdmin()
      ]);

      const total = allLands.length;
      const verified = allLands.filter((land) => land.isVerified).length;

      setLands(allLands);
      setStats({ totalLands: total, verifiedLands: verified });
      setCurrentUser(userAddress);
      setAdmin(adminAddress);
      setIsAdmin(userAddress.toLowerCase() === adminAddress.toLowerCase());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("❌ Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLand = async (landId) => {
    if (!isAdmin) {
      toast.error("⚠️ Only admin can verify lands.");
      return;
    }
    try {
      toast.info("🔍 Verifying land...");
      const result = await verifyLand(landId);
      if (result) {
        toast.success("✅ Land verified successfully!");
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error verifying land:", error);
      if (error?.reason?.includes("Only admin")) {
        toast.error("🚫 Rejected: Only admin can perform this action");
      } else {
        toast.error("❌ Verification failed");
      }
    }
  };

  const buttons = [
    { label: "Register Land", path: "/register-land", icon: "🏡" },
    { label: "View All Lands", path: "/view-lands", icon: "🌍" },
    { label: "Land History", path: "/land-history", icon: "📜" },
    { label: "Transfer Land", path: "/transfer-land", icon: "🔄" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
            🏛️ Land Registry Admin Dashboard
          </h1>
          <p className="text-center text-gray-600 mb-2">
            Connected Wallet: <span className="font-mono text-blue-600">{currentUser}</span>
          </p>
          <p className="text-center text-gray-600 mb-6">
            Contract Admin: <span className="font-mono text-green-600">{admin}</span>
          </p>

          {!isAdmin && (
            <div className="text-center text-red-700 font-semibold mb-4">
              ⚠️ You are not the admin. You can view data but cannot verify lands.
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-500 text-white p-6 rounded-xl">
              <div className="text-3xl font-bold">{stats.totalLands}</div>
              <div className="text-blue-100">Total Lands</div>
            </div>
            <div className="bg-green-500 text-white p-6 rounded-xl">
              <div className="text-3xl font-bold">{stats.verifiedLands}</div>
              <div className="text-green-100">Verified Lands</div>
            </div>
            <div className="bg-purple-500 text-white p-6 rounded-xl">
              <div className="text-3xl font-bold">
                {stats.totalLands > 0
                  ? Math.round((stats.verifiedLands / stats.totalLands) * 100)
                  : 0}
                %
              </div>
              <div className="text-purple-100">Verification Rate</div>
            </div>
          </div>

          {/* Nav Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => navigate(btn.path)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl shadow transition duration-200 text-lg flex items-center justify-center space-x-2"
              >
                <span>{btn.icon}</span>
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lands Table */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            📋 Recent Land Registrations
          </h2>

          {lands.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No lands registered yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Owner</th>
                    <th className="text-left py-3 px-4">Location</th>
                    <th className="text-left py-3 px-4">Area</th>
                    <th className="text-left py-3 px-4">Price (ETH)</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lands.slice(0, 10).map((land) => (
                    <tr
                      key={land.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-mono">#{land.id}</td>
                      <td className="py-3 px-4 font-mono text-sm">
                        {land.owner.slice(0, 6)}...{land.owner.slice(-4)}
                      </td>
                      <td className="py-3 px-4">{land.location}</td>
                      <td className="py-3 px-4">{land.area}</td>
                      <td className="py-3 px-4">{land.price || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            land.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {land.isVerified ? "✅ Verified" : "⏳ Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {!land.isVerified && isAdmin && (
                          <button
                            onClick={() => handleVerifyLand(land.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="text-red-600 hover:text-red-800 font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
