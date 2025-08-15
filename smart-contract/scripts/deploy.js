const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Land Registry Contract...");

  const LandRegistry = await hre.ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy();

  // Wait for the contract to be mined
  await landRegistry.waitForDeployment();

  const deployedAddress = await landRegistry.getAddress();
  console.log("✅ Land Registry deployed to:", deployedAddress);

  // 🔍 Get the admin address (correct getter for public variable)
  const admin = await landRegistry.admin();
  console.log("📋 Contract Admin:", admin);

  // 🔎 Try to verify the contract
  console.log("🔍 Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: deployedAddress,
      constructorArguments: [],
    });
    console.log("✅ Contract verified on Etherscan");
  } catch (error) {
    console.log("⚠️ Verification failed:", error.message);
  }

  // 🧾 Copy ABI to frontend
  console.log("📁 Copying ABI to client...");
  const fs = require("fs");
  const path = require("path");

  const artifactsPath = path.join(__dirname, "../artifacts/contracts/LandRegistry.sol/LandRegistry.json");
  const clientAbiPath = path.join(__dirname, "../../client/src/services/LandRegistryABI.json");

  if (fs.existsSync(artifactsPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
    fs.writeFileSync(clientAbiPath, JSON.stringify(artifact.abi, null, 2));
    console.log("✅ ABI copied to client");
  } else {
    console.log("❌ ABI file not found");
  }

  console.log("\n🎉 Deployment Complete!");
  console.log("📝 Next steps:");
  console.log("1. ⚙️ Update contract address in client/src/services/contract.js:");
  console.log("     ➤ use:", deployedAddress);
  console.log("2. 🌐 Run the frontend and test DApp functionality");
  console.log("3. 🛡️ Assign admin and test land registration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
