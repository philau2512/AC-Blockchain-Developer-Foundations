// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWhitelistable {
    function addToWhitelist(address user) external;
    function revokeWhitelist(address user) external;
    function isWhitelisted(address _address) external view returns (bool);
    function onlyWhitelisted() external view;
} 