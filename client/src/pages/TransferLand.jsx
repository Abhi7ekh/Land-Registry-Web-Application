import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  transferLand,
  getLandsByOwner,
  getCurrentUser,
  getContract
} from "../services/contract";
import { estimateTxFeeUSD } from "../utils/gas";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TransferLand = () => {
  const [userLands, setUserLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [ensResolvedName, setEnsResolvedName] = useState("");
  const [addressValid, setAddressValid] = useState(null);

  useEffect(() => {
    fetchUserLands();
  }, []);

  const fetchUserLands = async () => {
    try {
      const address = await getCurrentUser();
      setCurrentUser(address);
      const lands = await getLandsByOwner(address);
      setUserLands(lands);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("❌ Failed to load your lands");
    }
  };

  const validateAddress = async (input) => {
    setAddressValid(null);
    setEnsResolvedName("");

    if (!input) return;

    try {
      if (ethers.utils.isAddress(input)) {
        setNewOwner(ethers.utils.getAddress(input));
        setAddressValid(true);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const resolved = await provider.resolveName(input);

      if (resolved) {
        setNewOwner(resolved);
        setAddressValid(true);
        setEnsResolvedName(input);
      } else {
        setAddressValid(false);
      }
    } catch (err) {
      console.error("Validation error:", err);
      setAddressValid(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!selectedLand || !newOwner) {
      toast.error("❗ Please select a land and a valid new owner address");
      return;
    }

    if (newOwner.toLowerCase() === currentUser.toLowerCase()) {
      toast.error("❗ Cannot transfer to yourself");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = await getContract();
      const txRequest = await contract.populateTransaction.transferLand(selectedLand, newOwner);
      const { feeEth, feeUSD } = await estimateTxFeeUSD(txRequest, provider);

      const confirm = window.confirm(`Estimated fee: ${feeEth.toFixed(6)} ETH${feeUSD ? ` (~$${feeUSD.toFixed(2)})` : ""}.\nProceed?`);
      if (!confirm) return;

      toast.info("🔄 Transferring ownership...");
      await transferLand(selectedLand, newOwner);
      toast.success("✅ Transfer successful!");

      setSelectedLand("");
      setNewOwner("");
      setEnsResolvedName("");
      setAddressValid(null);
      fetchUserLands();
    } catch (err) {
      console.error("Transfer failed:", err);
      toast.error("❌ Transfer failed. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
          🔄 Transfer Land Ownership
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transfer Form */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">📝 Transfer Details</h3>

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Land to Transfer</label>
                <select
                  value={selectedLand}
                  onChange={(e) => setSelectedLand(e.target.value)}
                  className="w-full border p-3 rounded-md"
                  required
                >
                  <option value="">Choose a land...</option>
                  {userLands.map((land) => (
                    <option key={land.id} value={land.id}>
                      #{land.id} - {land.location} ({land.area})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Owner Address or ENS</label>
                <div className="relative">
                  <input
                    type="text"
                    value={ensResolvedName || newOwner}
                    onChange={(e) => {
                      setNewOwner(e.target.value);
                      validateAddress(e.target.value);
                    }}
                    placeholder="0x... or vitalik.eth"
                    className="w-full border p-3 rounded-md pr-10"
                    required
                  />
                  {addressValid === true && (
                    <span className="absolute right-3 top-3 text-green-600">✅</span>
                  )}
                  {addressValid === false && (
                    <span className="absolute right-3 top-3 text-red-600">❌</span>
                  )}
                </div>
                {ensResolvedName && (
                  <p className="text-sm text-gray-600 mt-1">
                    Resolved to: <span className="font-mono">{newOwner}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !selectedLand || !newOwner}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {loading ? "🔄 Processing..." : "🔄 Transfer Land"}
              </button>
            </form>
          </div>

          {/* User's Lands */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">🏡 Your Lands</h3>
            {userLands.length === 0 ? (
              <p className="text-gray-600 text-center py-8">You don't own any lands yet.</p>
            ) : (
              <div className="space-y-3">
                {userLands.map((land) => (
                  <div
                    key={land.id}
                    className="bg-white p-4 rounded-lg border hover:shadow-md transition"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">Land #{land.id}</h4>
                        <p className="text-sm text-gray-600">{land.location}</p>
                        <p className="text-sm text-gray-600">{land.area}</p>
                        <p className="text-sm font-medium text-green-600">{land.price} ETH</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        land.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {land.isVerified ? '✅ Verified' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Transfers are irreversible once confirmed on-chain.</li>
            <li>• The new owner gains full control.</li>
            <li>• Verification status resets after transfer.</li>
            <li>• Ensure the recipient address is correct.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransferLand;
