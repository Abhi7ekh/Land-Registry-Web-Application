// utils/gas.js
import { formatEther } from "ethers";

let cachedPriceUSD = null;
let lastFetch = 0;

export async function fetchEthPriceUSD() {
  const now = Date.now();
  if (cachedPriceUSD && now - lastFetch < 5 * 60 * 1000) {
    return cachedPriceUSD;
  }
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await res.json();
    cachedPriceUSD = data.ethereum.usd;
    lastFetch = now;
    return cachedPriceUSD;
  } catch (err) {
    console.error("Failed to fetch ETH price", err);
    return null;
  }
}

export async function estimateTxFeeUSD(txRequest, provider) {
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice; // BigInt in Ethers v6
  if (!gasPrice) throw new Error("Gas price unavailable");

  const gasLimit = await provider.estimateGas(txRequest); // also BigInt

  const feeEthBigInt = gasPrice * gasLimit;
  const feeEth = parseFloat(formatEther(feeEthBigInt));

  const ethUSD = await fetchEthPriceUSD();
  const feeUSD = ethUSD ? feeEth * ethUSD : null;

  return {
    gasLimit: gasLimit.toString(),
    gasPrice: gasPrice.toString(),
    feeEth,
    feeUSD,
  };
}
