// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC72 {
    function ownerOf(uint256 tokenId) external view returns (address owner);

    function mintNft(address to, string memory tokenURI) external;
}
