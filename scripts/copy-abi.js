// scripts/copy-abi.js

const fs = require("fs");
const path = require("path");

// 📁 Paths
const abiPath = path.resolve(__dirname, "../smart-contract/artifacts/contracts/LandRegistry.sol/LandRegistry.json");
const outputPath = path.resolve(__dirname, "../client/src/services/LandRegistryABI.json");

// 🛠 Copy ABI
function copyABI() {
  try {
    const abiFile = JSON.parse(fs.readFileSync(abiPath, "utf8"));
    const abiOnly = abiFile.abi;

    fs.writeFileSync(outputPath, JSON.stringify(abiOnly, null, 2));
    console.log("✅ ABI copied successfully to client/src/services/LandRegistryABI.json");
  } catch (error) {
    console.error("❌ Failed to copy ABI:", error.message);
  }
}

copyABI();
