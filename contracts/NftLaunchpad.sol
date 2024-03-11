// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error FractionalNft__NotOwner();

contract FractionalNft is ERC721URIStorage, AccessControl {
    address immutable i_owner;
    uint256 private s_tokenCounter;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    modifier onlyAdmin() {
        if (i_owner != msg.sender) revert FractionalNft__NotOwner();
        _;
    }

    constructor(address contractAddress) ERC721("Fractional NFT", "FNT") {
        i_owner = msg.sender;
        s_tokenCounter = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, i_owner);
        _grantRole(MINTER_ROLE, contractAddress);
    }

    function mintNft(
        address to,
        string memory TokenURI
    ) external onlyRole(MINTER_ROLE) {
        _safeMint(to, s_tokenCounter);
        _setTokenURI(s_tokenCounter, TokenURI);
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
