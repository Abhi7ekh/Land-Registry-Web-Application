import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const REQUIRED_CHAIN_ID_DEC = 31337;
const REQUIRED_CHAIN_ID_HEX = "0x" + REQUIRED_CHAIN_ID_DEC.toString(16);
const REQUIRED_NETWORK_NAME = "Localhost 8545";

const NetworkBanner = () => {
  const [mismatch, setMismatch] = useState(false);
  const [currentChainId, setCurrentChainId] = useState("");

  const checkNetwork = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId); // BigInt → Number

      setCurrentChainId(chainId);
      setMismatch(chainId !== REQUIRED_CHAIN_ID_DEC);
    } catch (error) {
      console.error("❌ Network check failed:", error);
      setCurrentChainId("unknown");
      setMismatch(true);
    }
  };

  const handleSwitch = async () => {
    try {
      if (!window.ethereum) return;

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: REQUIRED_CHAIN_ID_HEX }],
      });

      await checkNetwork(); // Refresh status
    } catch (switchError) {
      // If chain doesn't exist in wallet, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: REQUIRED_CHAIN_ID_HEX,
              rpcUrls: ["http://127.0.0.1:8545"],
              chainName: REQUIRED_NETWORK_NAME,
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
            }],
          });

          await checkNetwork(); // Refresh after adding
        } catch (addError) {
          console.error("❌ Failed to add network:", addError);
        }
      } else {
        console.error("❌ Failed to switch network:", switchError);
      }
    }
  };

  useEffect(() => {
    checkNetwork();

    if (window.ethereum) {
      window.ethereum.on("chainChanged", checkNetwork);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("chainChanged", checkNetwork);
      }
    };
  }, []);

  if (!mismatch) return null;

  return (
    <div className="bg-red-600 text-white text-sm py-2 px-4 flex items-center justify-between">
      <span>
        ⚠️ Wallet connected to unsupported network
        {currentChainId ? ` (chainId: ${currentChainId})` : ""}.
        Please switch to <strong>{REQUIRED_NETWORK_NAME}</strong>.
      </span>
      <button
        onClick={handleSwitch}
        className="bg-white text-red-700 font-semibold px-3 py-1 rounded shadow hover:bg-gray-100"
      >
        🔄 Switch Network
      </button>
    </div>
  );
};

export default NetworkBanner;
