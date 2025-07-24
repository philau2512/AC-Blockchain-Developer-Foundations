// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./NFTBase.sol";
import "contracts/security/Pausable.sol";

contract NFTSaleManager is Pausable, Ownable {
    NFTBase public nftContract;
    bytes32 public merkleRoot;
    uint256 public maxPerWallet;
    uint256 public price;
    
    mapping(address => uint256) private mintedPerWallet;

    constructor(
        address _nftContract,
        uint256 _maxPerWallet,
        uint256 _price,
        bytes32 _merkleRoot
    ) Ownable(msg.sender) {
        nftContract = NFTBase(_nftContract);
        maxPerWallet = _maxPerWallet;
        price = _price;
        merkleRoot = _merkleRoot;
    }

    modifier onlyWhitelisted(bytes32[] calldata merkleProof) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(
            MerkleProof.verifyCalldata(merkleProof, merkleRoot, leaf),
            "Not whitelisted or Wrong proof"
        );
        _;
    }

    event PriceUpdated(uint256 oldPrice, uint256 newPrice);
    event Minted(address indexed to, uint256 amount);
    event BatchMinted(address indexed to, uint256 amount);
    event Withdrawn(uint256 amount);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);

    /** ============================= GETTERS & SETTERS ============================= */

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function setMaxPerWallet(uint256 _maxPerWallet) external onlyOwner {
        maxPerWallet = _maxPerWallet;
    }

    function setPrice(uint256 _price) external onlyOwner {
        uint256 oldPrice = price;
        price = _price;
        emit PriceUpdated(oldPrice, _price);
    }

    function isWhitelisted(address user, bytes32[] calldata merkleProof) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(user));
        return MerkleProof.verifyCalldata(merkleProof, merkleRoot, leaf);
    }

    function getMintedPerWallet(address user) public view returns (uint256) {
        return mintedPerWallet[user];
    }

    // đổi địa chỉ contract NFT
    function setNFTContract(address _nftContract) external onlyOwner {
        require(_nftContract != address(0), "Invalid NFT contract address");
        nftContract = NFTBase(_nftContract);
    }


    /** ============================= PAUSE FUNCTIONS ============================= */
    
    function pause() external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    /** ============================= FUNCTIONS ============================= */

    // Hàm mint chính
    function mint(uint256 amount, bytes32[] calldata merkleProof) external payable whenNotPaused onlyWhitelisted(merkleProof) {
        require(amount > 0, "Amount must be greater than 0");
        require(
            mintedPerWallet[msg.sender] + amount <= maxPerWallet,
            "Exceeds max per wallet"
        );
        require(msg.value >= price * amount, "Insufficient payment");

        mintedPerWallet[msg.sender] += amount;

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = nftContract.mint(msg.sender);
            emit Minted(msg.sender, tokenId);
        }
    }

    // mint Batch cho admin
    function mintBatch(address to, uint256 amount) external whenNotPaused onlyOwner {
        require(
            mintedPerWallet[to] + amount <= maxPerWallet,
            "Exceeds max per wallet"
        );

        mintedPerWallet[to] += amount;

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = nftContract.mint(to);
            emit Minted(to, tokenId);
        }
    }

    // rút ETH về ví admin
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
        emit Withdrawn(balance);
    }
} 