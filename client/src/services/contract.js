import { toast } from "react-hot-toast";
import {
  BrowserProvider,
  Contract,
  formatEther,
  parseEther,
  ZeroAddress,
} from "ethers";
import abi from "./LandRegistryABI.json";

const contractAddress =
  import.meta.env.VITE_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const expectedChainId = import.meta.env.VITE_CHAIN_ID || "0x7a69"; // 31337 in hex

let cachedContract = null;
let cachedSignerAddress = null;

const getSignerAndContract = async () => {
  try {
    if (typeof window === "undefined" || !window.ethereum) {
      toast.error("🦊 MetaMask not detected");
      return null;
    }

    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const currentChainId = `0x${network.chainId.toString(16)}`;

    if (currentChainId !== expectedChainId) {
      toast.error(
        `⚠️ Wrong network. Please connect to Chain ID: ${expectedChainId}`
      );
      return null;
    }

    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    if (!cachedContract || cachedSignerAddress !== signerAddress) {
      cachedContract = new Contract(contractAddress, abi, signer);
      cachedSignerAddress = signerAddress;
    }

    return cachedContract;
  } catch (err) {
    toast.error("❌ Failed to connect to Ethereum network");
    console.error(err);
    return null;
  }
};

// Auto-refresh on chain change
if (typeof window !== "undefined" && window.ethereum?.on) {
  window.ethereum.on("chainChanged", () => window.location.reload());
}

// 👤 Get Current User
export const getCurrentUser = async () => {
  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_accounts", []);
  return accounts[0] || ZeroAddress;
};

// 📊 Dashboard Stats
export const getLandStats = async () => {
  const contract = await getSignerAndContract();
  if (!contract)
    return { totalLands: "0", verifiedLands: "0" };

  try {
    const [total, verified] = await contract.getLandStats();
    return Object.freeze({
      totalLands: total.toString(),
      verifiedLands: verified.toString(),
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    return { totalLands: "0", verifiedLands: "0" };
  }
};

// 📋 All Lands
export const getAllLands = async () => {
  const contract = await getSignerAndContract();
  if (!contract) return [];

  try {
    const lands = await contract.getAllLands();
    return lands.map((land) => ({
      id: Number(land.landId),
      owner: land.owner,
      location: land.location,
      area: Number(land.area),
      status: Number(land.status),
      isVerified: Number(land.status) === 1,
    }));
  } catch (err) {
    toast.error("Failed to fetch lands ❌");
    return [];
  }
};

// 👤 Lands Owned by Specific Address
export const getLandsByOwner = async (ownerAddress) => {
  const contract = await getSignerAndContract();
  if (!contract) return [];

  try {
    const ids = await contract.getMyLands(); // uses msg.sender
    const lands = await Promise.all(
      ids.map(async (id) => {
        const [landId, location, area, owner, status] = await contract.getLandDetails(id);
        return {
          id: Number(landId),
          location,
          area: Number(area),
          owner,
          status: Number(status),
          isVerified: Number(status) === 1,
        };
      })
    );
    return lands;
  } catch (err) {
    toast.error("Failed to fetch owner lands ❌");
    return [];
  }
};

// 🔍 Single Land Details
export const getLandDetails = async (landId) => {
  const contract = await getSignerAndContract();
  if (!contract) return null;

  try {
    const [id, location, area, owner, status] = await contract.getLandDetails(landId);
    return {
      id: Number(id),
      location,
      area: Number(area),
      owner,
      status: Number(status),
      isVerified: Number(status) === 1,
    };
  } catch (err) {
    toast.error("Land not found ❌");
    return null;
  }
};

// 🧾 Transaction Wrapper
const wrapTx = async (txPromise, action = "Transaction") => {
  try {
    const tx = await txPromise;
    toast.success(`${action} submitted: ${tx.hash}`);
    await tx.wait();
    toast.success(`${action} confirmed ✅`);
    return true;
  } catch (err) {
    toast.error(`${action} failed ❌`);
    console.error(`${action} error:`, err);
    return false;
  }
};

// 🏠 Register Land (2-parameter version)
export const registerLand = async (location, area) => {
  const contract = await getSignerAndContract();
  if (!contract) return false;

  return await wrapTx(
    contract.registerLand(location, area),
    "Register Land"
  );
};

// 🔄 Transfer Land Ownership
export const transferLand = async (landId, newOwner) => {
  const contract = await getSignerAndContract();
  if (!contract) return false;

  return await wrapTx(
    contract.transferLand(landId, newOwner),
    "Transfer Land"
  );
};

// ✅ Verify Land
export const verifyLand = async (landId) => {
  const contract = await getSignerAndContract();
  if (!contract) return false;

  return await wrapTx(contract.verifyLand(landId), "Verify Land");
};

// ❌ Reject Land
export const rejectLand = async (landId) => {
  const contract = await getSignerAndContract();
  if (!contract) return false;

  return await wrapTx(contract.rejectLand(landId), "Reject Land");
};

// 📦 Export raw contract getter
export const getContract = getSignerAndContract;

export async function getAdmin() {
  const contract = await getContract();
  return await contract.getAdmin();
}

// ✅ NEW: Check if connected account is admin
export const isCurrentUserAdmin = async () => {
  const contract = await getContract();
  if (!contract) return false;

  const admin = await contract.getAdmin();
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const currentUser = await signer.getAddress();

  return currentUser.toLowerCase() === admin.toLowerCase();
};
