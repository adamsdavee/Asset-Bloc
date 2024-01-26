// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error FractionalNFT__NotOwner();

contract FractionalNFT is ERC721URIStorage, AccessControl {
    address immutable i_owner;
    string[4] internal fractionalNftUri;
    uint256 private s_tokenCounter;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    modifier onlyAdmin() {
        if (i_owner != msg.sender) revert FractionalNFT__NotOwner();
        _;
    }

    constructor(
        string[4] memory fractionalNft,
        address contractAddress
    ) ERC721("Fractional NFT", "FNT") {
        i_owner = msg.sender;
        fractionalNftUri = fractionalNft;
        s_tokenCounter = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, i_owner);
        _grantRole(MINTER_ROLE, contractAddress);
    }

    function mintNft() external onlyRole(MINTER_ROLE) {
        _safeMint(msg.sender, s_tokenCounter);
        _setTokenURI(s_tokenCounter, fractionalNftUri[s_tokenCounter]);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {}

    function grantRole(
        bytes32 role,
        address account
    ) public override onlyAdmin {}

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
