import { viem } from "hardhat";
import { createPublicClient, http, createWalletClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { stringToHex, pad } from "viem";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY_ACCOUNT1 || "";

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

  console.log("Deploying contracts with the account:", account.address);

  // Deploy MyToken contract first (if not already deployed)
  const myTokenContract = await viem.deployContract("MyToken");
  console.log("MyToken contract deployed at:", myTokenContract.address);

  // Get the current block number
  const currentBlock = await publicClient.getBlockNumber();
  
  // Set the target block number (e.g., current block + 10)
  const targetBlockNumber = currentBlock + 10n;

  // Define proposal names
  const proposalNames = ["Proposal 1", "Proposal 2", "Proposal 3"];

  // Encode proposal names as bytes32 array
  const encodedProposalNames = proposalNames.map((name) =>
    pad(stringToHex(name, { size: 32 }))
  );

  // Deploy TokenizedBallot contract
  const tokenizedBallotContract = await viem.deployContract("TokenizedBallot", [
    encodedProposalNames,
    myTokenContract.address,
    targetBlockNumber,
  ]);

  console.log("TokenizedBallot contract deployed at:", tokenizedBallotContract.address);
  console.log("Target Block Number:", targetBlockNumber.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//OLD DEPLOY
// import { viem } from "hardhat";
// import { parseEther, encodeAbiParameters, parseAbiParameters, stringToHex, pad } from "viem";


// async function main() {
//   const publicClient = await viem.getPublicClient();
//   const [deployer] = await viem.getWalletClients();

//   // Deploy MyToken contract first (if not already deployed)
//   const myTokenContract = await viem.deployContract("MyToken");
//   console.log("MyToken contract deployed at:", myTokenContract.address);

//   // Get the current block number
//   const currentBlock = await publicClient.getBlockNumber();
  
//   // Set the target block number (e.g., current block + 10)
//   const targetBlockNumber = currentBlock + 10n;

//   // Define proposal names
//  const proposalNames = ["Proposal 1", "Proposal 2", "Proposal 3"];

//   // Encode proposal names as bytes32 array
//   const encodedProposalNames = proposalNames.map((name) =>
//   pad(stringToHex(name, { size: 32 }))
// );

//   // Deploy TokenizedBallot contract
//   const tokenizedBallotContract = await viem.deployContract("TokenizedBallot", [
//     encodedProposalNames,
//     myTokenContract.address,
//     targetBlockNumber,
//   ]);

//   console.log("TokenizedBallot contract deployed at:", tokenizedBallotContract.address);
//   console.log("Target Block Number:", targetBlockNumber.toString());
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
