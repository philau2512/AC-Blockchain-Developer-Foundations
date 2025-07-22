// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IWhitelistable.sol";

abstract contract Whitelistable is Ownable, IWhitelistable {
    mapping(address => bool) private _whitelist;
    
    constructor() {}
    
    modifier whenWhitelisted() {
        require(_whitelist[msg.sender], "Not whitelisted");
        _;
    }
    
    function addToWhitelist(address user) public override onlyOwner {
        require(!_whitelist[user], "This address is already whitelisted");
        _whitelist[user] = true;
    }
    
    function revokeWhitelist(address user) public override onlyOwner {
        require(_whitelist[user], "This address is not whitelisted");
        _whitelist[user] = false;
    }
    
    function isWhitelisted(address _address) public view override returns (bool) {
        return _whitelist[_address];
    }
    
    function onlyWhitelisted() public view override whenWhitelisted {
        // This function exists solely to expose the whenWhitelisted modifier
        // for use by other contracts via the interface
    }
} 