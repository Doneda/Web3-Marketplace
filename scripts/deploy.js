async function main() {
    console.log("Deploying contracts...");
    
    // Deploy Token
    const Token = await ethers.getContractFactory("MarketplaceToken");
    const token = await Token.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("Token deployed to:", tokenAddress);
    
    // Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(tokenAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("Marketplace deployed to:", marketplaceAddress);
    
    console.log("\n=================================");
    console.log("SAVE THESE ADDRESSES:");
    console.log("=================================");
    console.log("TOKEN_ADDRESS:", tokenAddress);
    console.log("MARKETPLACE_ADDRESS:", marketplaceAddress);
    console.log("=================================\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});