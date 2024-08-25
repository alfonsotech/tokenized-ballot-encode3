import { viem } from "hardhat";
import { parseEther } from "viem";
import dotenv from 'dotenv';
dotenv.config();

const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
const BALLOT_CONTRACT_ADDRESS = process.env.BALLOT_CONTRACT_ADDRESS;

const MINT_VALUE = parseEther("10"); // Adjust as needed

async function main() {
    const [deployer, voter1, voter2] = await viem.getWalletClients();
    const tokenContract = await viem.getContractAt("MyToken", "TOKEN_CONTRACT_ADDRESS");
    const ballotContract = await viem.getContractAt("TokenizedBallot", "BALLOT_CONTRACT_ADDRESS");

    // Mint tokens to voters
    await tokenContract.write.mint([voter1.account.address, MINT_VALUE]);
    await tokenContract.write.mint([voter2.account.address, MINT_VALUE]);

    // Self-delegate to activate voting power
    await tokenContract.write.delegate([voter1.account.address], { account: voter1.account });
    await tokenContract.write.delegate([voter2.account.address], { account: voter2.account });

    // Check voting power
    constvotingPower1  = await ballotContract.read.getVotingPower([voter1.account.address]);
    const votingPower2 = await ballotContract.read.getVotingPower([voter2.account.address]);

    console.log(`Voter1 voting power: ${votingPower1}`);
    console.log(`Voter2 voting power: ${votingPower2}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
