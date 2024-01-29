// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IFractionalNft.sol";

error SaleEvents__NotTime();
error SaleEvents__NotApproved();
error SaleEvents__NotAdmin();
error SaleEvents__MustBeGreaterThanZero();
error SaleEvents__NotListed();
error SaleEvents__NotSeller();
error SaleEvents__AssetFractionNotAvailable();
error SaleEvents__SaleInProgress();
error SaleEvents__NoProceeds();
error SaleEvents__TransferFailed();

contract SaleEvents is AccessControl {
    uint256 private totalNumberEvents;
    address public immutable i_owner;
    bytes32 public constant APPROVAL_ROLE = keccak256("APPROVAL_ROLE");

    enum Status {
        Pending,
        Not_Approved,
        Approved
    }

    struct User {
        address seller;
        mapping(address => uint256) earnedPerAsset;
        uint256 totalEarned;
    }

    struct Event {
        uint256 id;
        string assetType;
        uint256 startAt;
        uint256 endAt;
        uint256 assetPrice;
        Status status;
        uint256 assetFractionAvailable;
        address nftAddress;
        address seller;
    }

    mapping(address => mapping(uint256 => User)) private userToEventId;
    mapping(uint256 => Event) private eachEvent;
    mapping(address => mapping(address => Event)) private s_listing;
    mapping(address => User) private s_proceeds;

    Event[] private allEvents;

    modifier onlyAdmin() {
        if (i_owner != msg.sender) revert SaleEvents__NotAdmin();
        _;
    }

    modifier isSeller(uint256 eventId) {
        Event memory listing = eachEvent[eventId];
        if (listing.seller != msg.sender) revert SaleEvents__NotSeller();
        _;
    }

    modifier isListed(uint256 eventId) {
        Event memory listing = eachEvent[eventId];
        if (listing.assetPrice <= 0) revert SaleEvents__NotListed();
        _;
    }

    constructor() {
        i_owner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, i_owner);
    }

    function createSaleEvent(
        uint256 _startAt,
        uint256 _endAt,
        string calldata _assetType,
        uint256 _assetPrice, // Doclink
    ) external {
        totalNumberEvents += 1;
        Event memory saleEvent = Event(
            totalNumberEvents,
            _assetType,
            _startAt,
            _endAt,
            _assetPrice,
            Status.Pending,
            _assetPrice,
            _nftAddress,
            msg.sender
        );

        // if (block.timestamp < _startAt) revert SaleEvents__NotTime();
        // userToEventId[msg.sender][totalNumberEvents] = User(msg.sender, 0);
        eachEvent[totalNumberEvents] = saleEvent;
        allEvents.push(saleEvent);
    }

    function validateEventDoc(
        string calldata _docLink,
        uint256 eventId,
        Status _status
    ) external onlyRole(APPROVAL_ROLE) {
        Event storage theEvent = eachEvent[eventId];
        theEvent.status = _status;

        // emit ValidateEvent(eventId, _status);
    }

    function grantRole(bytes32, address account) public override onlyAdmin {
        _grantRole(APPROVAL_ROLE, account);
    }

    function buyAssetFraction(
        uint256 eventId,
        address nftAddress,
        uint256 price,
        string memory _tokenUri
    ) external payable {
        Event storage saleEvent = eachEvent[eventId];
        if (
            saleEvent.status == Status.Pending ||
            saleEvent.status == Status.Not_Approved
        ) revert SaleEvents__NotApproved();
        if (saleEvent.assetFractionAvailable < price)
            revert SaleEvents__AssetFractionNotAvailable();
        if (msg.value < 0) revert SaleEvents__MustBeGreaterThanZero();

        saleEvent.assetFractionAvailable -= price;
        s_proceeds[saleEvent.seller].earnedPerAsset[nftAddress] += price;
        s_proceeds[saleEvent.seller].totalEarned += price;

        IFractionalNft nft = IFractionalNft(nftAddress);
        nft.mintNft(msg.sender, _tokenUri);

        // emit ItemFractionSold();
    }

    function cancelEvent(
        uint256 eventId
    ) external isListed(eventId) isSeller(eventId) {
        Event memory saleEvent = eachEvent[eventId];
        if (block.timestamp >= saleEvent.startAt)
            revert SaleEvents__SaleInProgress();
        delete eachEvent[eventId];
        delete allEvents[eventId];

        // emit ItemCanceled()
    }

    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender].totalEarned;
        if (proceeds <= 0) revert SaleEvents__NoProceeds();
        s_proceeds[msg.sender].totalEarned = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) revert SaleEvents__TransferFailed();
    }

    //////////////////////
    // Getter Functions //
    //////////////////////

    function getAllSaleEvents() public view returns (Event[] memory) {
        return allEvents;
    }

    function getEventById(uint256 eventId) public view returns (Event memory) {
        return eachEvent[eventId];
    }

    function getSellerProceedsPerAsset(
        address nftAddress
    ) external view returns (uint256) {
        return s_proceeds[msg.sender].earnedPerAsset[nftAddress];
    }

    function getSellerTotalProceeds() external view returns (uint256) {
        return s_proceeds[msg.sender].totalEarned;
    }

    function getEventStatus(uint256 eventId) public view returns (Status) {
        Event memory saleEvent = eachEvent[eventId];
        return saleEvent.status;
    }
}

// 1. Create event
// 2. Validate Doc by Admins
// 2. Buy asset
// 2. Cancel event
// 4. DEFI
