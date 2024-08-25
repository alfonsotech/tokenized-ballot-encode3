import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`)
  });

  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`)
  });

  console.log("Deploying MyToken contract with the account:", account.address);

  const myToken = await viem.deployContract("MyToken");

  console.log("MyToken deployed token address:", myToken.address);
}




// import { viem } from "hardhat";

// async function main() {
//   const [deployer] = await viem.getWalletClients();
//   console.log("Deploying MyToken contract with the account:", deployer.account.address);

//   const myToken = await viem.deployContract("MyToken");

//   console.log("MyToken deployed token address:", myToken.address);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
