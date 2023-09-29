const hre = require('hardhat');

async function main() {
  const Vote = await hre.ethers.getContractFactory('Voting');
  const vote = await Vote.deploy();

  await vote.waitForDeployment();
  console.log('Vote deployed to:', vote.target);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
