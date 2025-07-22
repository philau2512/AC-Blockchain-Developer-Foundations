import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("NFTWhitelistSale", function () {
  async function deployNFTWhitelistSale() {
    // Tạo merkle tree cho test
    const [owner, user1, user2, user3] = await ethers.getSigners();
    
    // Chỉ user1 và user2 trong whitelist
    const whitelistAddresses = [
      user1.address,
      user2.address
    ];
    
    // Tạo merkle tree
    const leafNodes = whitelistAddresses.map(addr => 
      keccak256(addr.toLowerCase())
    );
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const merkleRoot = merkleTree.getRoot();
    
    // Deploy contract
    const NFTWhitelistSale = await ethers.getContractFactory("NFTWhitelistSale");
    const nftWhitelistSale = await NFTWhitelistSale.deploy('0x' + merkleRoot.toString('hex'));
    await nftWhitelistSale.waitForDeployment();
    
    return { nftWhitelistSale, owner, user1, user2, user3, merkleTree };
  }
  
  it("Should deploy correctly with proper initial values", async function () {
    const { nftWhitelistSale } = await deployNFTWhitelistSale();
    
    expect(await nftWhitelistSale.name()).to.equal("NFTWhitelistSale");
    expect(await nftWhitelistSale.symbol()).to.equal("NFTWS");
    expect(await nftWhitelistSale.maxSupply()).to.equal(50);
    expect(await nftWhitelistSale.totalSupply()).to.equal(0);
  });
  
  it("Should allow whitelisted users to mint", async function () {
    const { nftWhitelistSale, user1, merkleTree } = await deployNFTWhitelistSale();
    
    // Tạo proof cho user1
    const proof = merkleTree.getHexProof(keccak256(user1.address.toLowerCase()));
    
    // Mint với user1
    await nftWhitelistSale.connect(user1).mint(1, proof, {
      value: ethers.parseEther("0.000001")
    });
    
    expect(await nftWhitelistSale.totalSupply()).to.equal(1);
    expect(await nftWhitelistSale.ownerOf(1)).to.equal(user1.address);
  });
  
  it("Should reject non-whitelisted users", async function () {
    const { nftWhitelistSale, user3, merkleTree } = await deployNFTWhitelistSale();
    
    // Tạo proof cho user3 (không có trong whitelist)
    const proof = merkleTree.getHexProof(keccak256(user3.address.toLowerCase()));
    
    // Thử mint với user3
    await expect(
      nftWhitelistSale.connect(user3).mint(1, proof, {
        value: ethers.parseEther("0.000001")
      })
    ).to.be.revertedWith("Not whitelisted");
  });
  
  it("Should enforce payment requirements", async function () {
    const { nftWhitelistSale, user1, merkleTree } = await deployNFTWhitelistSale();
    
    // Tạo proof cho user1
    const proof = merkleTree.getHexProof(keccak256(user1.address.toLowerCase()));
    
    // Thử mint với số tiền không đủ
    await expect(
      nftWhitelistSale.connect(user1).mint(1, proof, {
        value: ethers.parseEther("0.0000001")
      })
    ).to.be.revertedWith("Insufficient payment");
  });
  
  it("Should enforce max per wallet limit", async function () {
    const { nftWhitelistSale, user1, merkleTree } = await deployNFTWhitelistSale();
    
    // Tạo proof cho user1
    const proof = merkleTree.getHexProof(keccak256(user1.address.toLowerCase()));
    
    // Mint 2 NFT (max per wallet)
    await nftWhitelistSale.connect(user1).mint(2, proof, {
      value: ethers.parseEther("0.000002")
    });
    
    // Thử mint thêm 1 NFT
    await expect(
      nftWhitelistSale.connect(user1).mint(1, proof, {
        value: ethers.parseEther("0.000001")
      })
    ).to.be.revertedWith("Exceeds max per wallet");
  });
  
  it("Should allow owner to withdraw", async function () {
    const { nftWhitelistSale, owner, user1, merkleTree } = await deployNFTWhitelistSale();
    
    // Tạo proof cho user1
    const proof = merkleTree.getHexProof(keccak256(user1.address.toLowerCase()));
    
    // Mint với user1
    await nftWhitelistSale.connect(user1).mint(1, proof, {
      value: ethers.parseEther("0.000001")
    });
    
    // Kiểm tra số dư trước khi withdraw
    const initialBalance = await ethers.provider.getBalance(owner.address);
    
    // Rút tiền
    await nftWhitelistSale.connect(owner).withdraw();
    
    // Kiểm tra số dư sau khi withdraw
    const finalBalance = await ethers.provider.getBalance(owner.address);
    expect(finalBalance).to.be.gt(initialBalance);
  });
  
  it("Should allow owner to update merkle root", async function () {
    const { nftWhitelistSale, owner, user3 } = await deployNFTWhitelistSale();
    
    // Tạo merkle tree mới chỉ với user3
    const newWhitelist = [user3.address];
    const newLeafNodes = newWhitelist.map(addr => keccak256(addr.toLowerCase()));
    const newMerkleTree = new MerkleTree(newLeafNodes, keccak256, { sortPairs: true });
    const newMerkleRoot = '0x' + newMerkleTree.getRoot().toString('hex');
    
    // Cập nhật merkle root
    await nftWhitelistSale.connect(owner).setMerkleRoot(newMerkleRoot);
    
    // Tạo proof cho user3 với merkle tree mới
    const proof = newMerkleTree.getHexProof(keccak256(user3.address.toLowerCase()));
    
    // User3 giờ có thể mint
    await nftWhitelistSale.connect(user3).mint(1, proof, {
      value: ethers.parseEther("0.000001")
    });
    
    expect(await nftWhitelistSale.totalSupply()).to.equal(1);
    expect(await nftWhitelistSale.ownerOf(1)).to.equal(user3.address);
  });
}); 