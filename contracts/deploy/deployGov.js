const { ethers } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = deployments; // Get the deploy function from hre.deployments
  const { deployer } = await getNamedAccounts(); // Get the deployer account

  console.log("Deploying HealthInsurance contract...");

  // Deploy the HealthInsurance contract
  const healthInsurance = await deploy("HealthInsurance", {
    from: deployer, // Address of the deployer
    args: [], // Constructor arguments if required
    log: true, // Display deployment logs
  });

  console.log("HealthInsurance contract deployed at:", healthInsurance.address);
};

module.exports.tags = ["HealthInsurance"]; // Optional: Tag for running specific scripts
