import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NetworkBanner from "./components/NetworkBanner";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterLand from "./pages/RegisterLand";
import ViewLands from "./pages/ViewLands";
import TransferLand from "./pages/TransferLand";
import LandHistory from "./pages/LandHistory";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* 🔗 Network Status Bar */}
        <NetworkBanner />

        {/* 🔝 Navigation */}
        <Navbar />

        {/* 🧭 Main Content Area */}
        <main className="flex-grow p-4 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/register-land" element={<RegisterLand />} />
            <Route path="/view-lands" element={<ViewLands />} />
            <Route path="/transfer-land" element={<TransferLand />} />
            <Route path="/land-history" element={<LandHistory />} />

            {/* 🛠 Future Routes */}
            <Route path="/verify-lands" element={<div>🧾 Verify Lands (Coming Soon)</div>} />
            <Route path="/login" element={<div>🔐 Login Page (Coming Soon)</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
