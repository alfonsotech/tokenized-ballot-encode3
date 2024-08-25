import { viem } from "hardhat";
import { parseEther } from "viem";
import dotenv from 'dotenv';
dotenv.config();

const BALLOT_CONTRACT_ADDRESS = process.env.BALLOT_CONTRACT_ADDRESS;

async function main() {
  const publicClient = await viem.getPublicClient();
  const [deployer, acc1, acc2] = await viem.getWalletClients();

  // Get the deployed TokenizedBallot contract
  const tokenizedBallotContract = await viem.getContractAt("TokenizedBallot", BALLOT_CONTRACT_ADDRESS);

  console.log("Voting on proposals...");

  // Vote on proposals
  const voteTx1 = await tokenizedBallotContract.write.vote([0, parseEther("5")], {
    account: acc1.account,
  });
  await publicClient.waitForTransactionReceipt({ hash: voteTx1 });
  console.log(`Account ${acc1.account.address} voted 5 tokens for proposal 0`);

  const voteTx2 = await tokenizedBallotContract.write.vote([1, parseEther("3")], {
    account: acc2.account,
  });
  await publicClient.waitForTransactionReceipt({ hash: voteTx2 });
  console.log(`Account ${acc2.account.address} voted 3 tokens for proposal 1`);

  // Check voting results
  for (let i = 0; i < 3; i++) {
    const proposal = await tokenizedBallotContract.read.proposals([BigInt(i)]);
    console.log(`Proposal ${i}: ${proposal.name} has ${proposal.voteCount} votes`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
