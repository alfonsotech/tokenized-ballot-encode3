import { viem } from "hardhat";
import { createPublicClient, http, createWalletClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY_ACCOUNT1 || "";
const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS || "";
const BALLOT_CONTRACT_ADDRESS = process.env.BALLOT_CONTRACT_ADDRESS || "";

const MINT_VALUE = parseEther("10");

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

    const tokenContract = await viem.getContractAt("MyToken", "0xc89e7284cf41ecfd96afa858019617f1388c6e30");
    const ballotContract = await viem.getContractAt("TokenizedBallot", "0xa303307108833e804c763ab3f4438486f7db78be");

    // Mint tokens to deployer
    // await tokenContract.write.mint([account.address, MINT_VALUE]);

    // Mint tokens to deployer
    const mintTx = await tokenContract.write.mint([account.address, MINT_VALUE]);
    const mintReceipt = await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log("Mint transaction receipt:", mintReceipt);
    console.log("Tokens minted successfully. Amount:", MINT_VALUE.toString());


    // Self-delegate to activate voting power
    // await tokenContract.write.delegate([account.address]);
    // Self-delegate to activate voting power
    const delegateTx = await tokenContract.write.delegate([account.address]);
    const delegateReceipt = await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    console.log("Delegate transaction receipt:", delegateReceipt);
    console.log("Self-delegation completed successfully for address:", account.address);

    // Check voting power
    const votingPower = await ballotContract.read.getVotingPower([account.address]);

    console.log(`Deployer voting power: ${votingPower}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



//MVP
// import { viem } from "hardhat";
// import { createPublicClient, http, createWalletClient, parseEther } from "viem";
// import { privateKeyToAccount } from "viem/accounts";
// import { sepolia } from "viem/chains";
// import * as dotenv from "dotenv";

// dotenv.config();

// const providerApiKey = process.env.ALCHEMY_API_KEY || "";
// const deployerPrivateKey = process.env.PRIVATE_KEY_ACCOUNT1 || "";
// const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS || "";
// const BALLOT_CONTRACT_ADDRESS = process.env.BALLOT_CONTRACT_ADDRESS || "";

// //Public keys for two metamask accounts
// const ACCOUNT1 = process.env.PUBLIC_KEY_ACCOUNT1 || "";
// const ACCOUNT2 = process.env.PUBLIC_KEY_ACCOUNT2 || "";

// const MINT_VALUE = parseEther("1");

// async function main() {
//     const publicClient = createPublicClient({
//         chain: sepolia,
//         transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`)
//     });

//     const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
//     const walletClient = createWalletClient({
//         account,
//         chain: sepolia,
//         transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`)
//     });

//     //Harcoding the contract addresses to bypass an error
//     const tokenContract = await viem.getContractAt("MyToken", "0xc89e7284cf41ecfd96afa858019617f1388c6e30");
//     const ballotContract = await viem.getContractAt("TokenizedBallot", "0xa303307108833e804c763ab3f4438486f7db78be");

//     const voter1 = ACCOUNT1 as `0x${string}`; 
//     const voter2 = ACCOUNT2 as `0x${string}`;

//     // Mint tokens to voters
//     await tokenContract.write.mint([voter1, MINT_VALUE]);
//     await tokenContract.write.mint([voter2, MINT_VALUE]);

//     // Self-delegate to activate voting power
//     await tokenContract.write.delegate([voter1], { account: voter1 });
//     await tokenContract.write.delegate([voter2], { account: voter2 });

//     // Check voting power
//     const votingPower1 = await ballotContract.read.getVotingPower([voter1]);
//     const votingPower2 = await ballotContract.read.getVotingPower([voter2]);

//     console.log(`Voter1 voting power: ${votingPower1}`);
//     console.log(`Voter2 voting power: ${votingPower2}`);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });

// OLD SCRIPT
// import { viem } from "hardhat";
// import { parseEther } from "viem";
// import dotenv from 'dotenv';
// dotenv.config();

// const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
// const BALLOT_CONTRACT_ADDRESS = process.env.BALLOT_CONTRACT_ADDRESS;

// const MINT_VALUE = parseEther("10"); // Adjust as needed

// async function main() {
//     const [deployer, voter1, voter2] = await viem.getWalletClients();
//     const tokenContract = await viem.getContractAt("MyToken", "TOKEN_CONTRACT_ADDRESS");
//     const ballotContract = await viem.getContractAt("TokenizedBallot", "BALLOT_CONTRACT_ADDRESS");

//     // Mint tokens to voters
//     await tokenContract.write.mint([voter1.account.address, MINT_VALUE]);
//     await tokenContract.write.mint([voter2.account.address, MINT_VALUE]);

//     // Self-delegate to activate voting power
//     await tokenContract.write.delegate([voter1.account.address], { account: voter1.account });
//     await tokenContract.write.delegate([voter2.account.address], { account: voter2.account });

//     // Check voting power
//     const votingPower1  = await ballotContract.read.getVotingPower([voter1.account.address]);
//     const votingPower2 = await ballotContract.read.getVotingPower([voter2.account.address]);

//     console.log(`Voter1 voting power: ${votingPower1}`);
//     console.log(`Voter2 voting power: ${votingPower2}`);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });
