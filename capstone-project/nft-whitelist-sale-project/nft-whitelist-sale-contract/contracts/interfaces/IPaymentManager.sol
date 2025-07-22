// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPaymentManager {
    function setPrice(uint256 _price) external;
    function getPrice() external view returns (uint256);
    function withdraw() external;
    function processMintPayment(uint256 amount) external payable returns (bool);
} 