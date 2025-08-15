const fs = require("fs");
const path = require("path");

const artifactPath = path.join(
  __dirname,
  "../artifacts/contracts/LandRegistry.sol/LandRegistry.json"
);
const destinationPath = path.join(
  __dirname,
  "../../client/src/services/LandRegistryABI.json"
);

function copyABI() {
  try {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abi = artifact.abi;

    fs.writeFileSync(destinationPath, JSON.stringify(abi, null, 2));
    console.log("✅ ABI copied to client/src/services/LandRegistryABI.json");
  } catch (error) {
    console.error("❌ Failed to copy ABI:", error);
  }
}

copyABI();
