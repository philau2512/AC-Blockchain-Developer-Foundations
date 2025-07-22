// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IPaymentManager.sol";

abstract contract PaymentManager is Ownable, IPaymentManager {
    uint256 private _price;
    
    constructor(uint256 initialPrice) {
        _price = initialPrice;
    }
    
    function setPrice(uint256 newPrice) public override onlyOwner {
        _price = newPrice;
    }
    
    function getPrice() public view override returns (uint256) {
        return _price;
    }
    
    function processMintPayment(uint256 amount) public payable override returns (bool) {
        uint256 requiredPayment = _price * amount;
        require(msg.value >= requiredPayment, "Insufficient payment");
        return true;
    }
    
    function withdraw() public override onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
} 