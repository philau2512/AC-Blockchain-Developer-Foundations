// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    uint public nextTokenId;
    address public owner;

    constructor() ERC721("MyNFT", "MNFT") {
        owner = msg.sender;
    }

    function mint(address to) external {
        require(msg.sender == owner, "Only owner can mint");
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}
