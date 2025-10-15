const { expect } = require("chai");

describe("Marketplace", function () {
    let token, marketplace, owner, buyer, seller;
    
    beforeEach(async function () {
        [owner, buyer, seller] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("MarketplaceToken");
        token = await Token.deploy();
        await token.waitForDeployment();
        
        const Marketplace = await ethers.getContractFactory("Marketplace");
        marketplace = await Marketplace.deploy(await token.getAddress());
        await marketplace.waitForDeployment();
        
        // Give buyer tokens
        await token.transfer(buyer.address, ethers.parseEther("100"));
    });
    
    it("Should list an item", async function () {
        await marketplace.connect(seller).listItem("Laptop", "Gaming laptop", ethers.parseEther("10"));
        
        const item = await marketplace.getItem(1);
        expect(item.name).to.equal("Laptop");
        expect(item.price).to.equal(ethers.parseEther("10"));
    });
    
    it("Should buy an item", async function () {
        await marketplace.connect(seller).listItem("Laptop", "Gaming laptop", ethers.parseEther("10"));
        
        // Buyer approves marketplace to spend tokens
        await token.connect(buyer).approve(await marketplace.getAddress(), ethers.parseEther("10"));
        
        // Buyer buys item
        await marketplace.connect(buyer).buyItem(1);
        
        const item = await marketplace.getItem(1);
        expect(item.available).to.equal(false);
    });
});