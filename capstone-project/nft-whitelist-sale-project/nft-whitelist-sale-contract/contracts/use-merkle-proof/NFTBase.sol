// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "contracts/security/Pausable.sol";

contract NFTBase is ERC721, Ownable, Pausable {
    using Strings for uint256;

    uint256 public maxSupply;
    uint256 public totalMinted;
    string public baseURI;
    mapping(uint256 => string) private _tokenURIs;
    
    // Role manager contract address
    address public saleManager;
    
    modifier onlySaleManager() {
        require(msg.sender == saleManager, "Caller is not the sale manager");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        string memory _baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        baseURI = _baseURI;
    }

    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    event SaleManagerUpdated(address indexed oldManager, address indexed newManager);

    /** ============================= PAUSE FUNCTIONS ============================= */
    
    function pause() external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    function unpause() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    /** ============================= GETTERS & SETTERS ============================= */

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function setSaleManager(address _saleManager) external onlyOwner {
        require(_saleManager != address(0), "Invalid sale manager address");
        address oldManager = saleManager;
        saleManager = _saleManager;
        emit SaleManagerUpdated(oldManager, _saleManager);
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }

    function setTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
        require(_exists(tokenId), "URI set for nonexistent token");
        _tokenURIs[tokenId] = uri;
    }

    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(
            newMaxSupply >= totalMinted,
            "New max supply must be >= total minted"
        );
        maxSupply = newMaxSupply;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");

        string memory tokenURIValue = _tokenURIs[tokenId];
        if (bytes(tokenURIValue).length > 0) {
            return tokenURIValue;
        }

        if (bytes(baseURI).length > 0) {
            return string(abi.encodePacked(baseURI, tokenId.toString()));
        }

        return "";
    }

    /** ============================= FUNCTIONS ============================= */

    function mint(address to) 
        external 
        onlySaleManager 
        whenNotPaused  // Thêm modifier này
        returns (uint256) 
    {
        require(totalMinted < maxSupply, "Exceeds maximum supply");
        uint256 newTokenId = totalMinted + 1;
        totalMinted++;
        _safeMint(to, newTokenId);
        return newTokenId;
    }
}