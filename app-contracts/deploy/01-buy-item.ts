import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

async function main() {
  console.log("Deploying BuyItem contract...");

  // RPC provider ve private key'i environment'tan al
  const rpcUrl = process.env.ETHERS_RPC_PROVIDER;
  const privateKey = process.env.PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error("ETHERS_RPC_PROVIDER and PRIVATE_KEY must be set");
  }

  // Provider ve wallet oluştur
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying from address:", wallet.address);

  // Contract bytecode ve ABI'yi oku
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const contractPath = join(__dirname, "../artifacts/contracts/BuyItem.sol/BuyItem.json");
  const contractJson = JSON.parse(readFileSync(contractPath, "utf8"));

  // Contract factory oluştur
  const contractFactory = new ethers.ContractFactory(
    contractJson.abi,
    contractJson.bytecode,
    wallet
  );

  const endDate = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

  // Contract'ı deploy et
  const buyItem = await contractFactory.deploy(endDate);
  await buyItem.waitForDeployment();

  const contractAddress = await buyItem.getAddress();

  console.log(`BuyItem deployed to: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
