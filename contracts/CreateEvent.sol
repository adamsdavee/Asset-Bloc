// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IERC72.sol";

error EventCreation__NotTime();
error EventCreation__NotApproved();
error EventCreation__NotAdmin();
error EventCreation__MustBeGreaterThanZero();
error EventCreation__NotListed();
error EventCreation__NotSeller();
error EventCreation__AssetFractionNotAvailable();
error EventCreation__SaleInProgress();
error EventCreation__NoProceeds();
error EventCreation__TransferFailed();

contract EventCreation is AccessControl {
    uint256 private totalNumberEvents;
    address public immutable i_owner;
    bytes32 public constant APPROVAL_ROLE = keccak256("APPROVAL_ROLE");

    enum Status {
        Pending,
        Not_Approved,
        Approved
    }

    // struct User {
    //     address seller;
    //     uint256 totalEarned;
    // }

    struct Event {
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
    mapping(address => mapping(address => uint256)) private s_proceeds;

    Event[] private allEvents;

    modifier onlyAdmin() {
        if (i_owner != msg.sender) revert EventCreation__NotAdmin();
        _;
    }

    modifier isSeller(uint256 eventId) {
        Event memory listing = eachEvent[eventId];
        if (listing.seller != msg.sender) revert EventCreation__NotSeller();
        _;
    }

    modifier isListed(uint256 eventId) {
        Event memory listing = eachEvent[eventId];
        if (listing.assetPrice <= 0) revert EventCreation__NotListed();
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
        address _nftAddress,
        address seller
    ) external {
        Event memory saleEvent = Event(
            _assetType,
            _startAt,
            _endAt,
            _assetPrice,
            Status.Pending,
            _assetPrice,
            _nftAddress,
            msg.sender
        );

        // if (block.timestamp < _startAt) revert EventCreation__NotTime();
        // userToEventId[msg.sender][totalNumberEvents] = User(msg.sender, 0);
        eachEvent[totalNumberEvents] = saleEvent;
        allEvents.push(saleEvent);

        totalNumberEvents += 1;
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
        ) revert EventCreation__NotApproved();
        if (saleEvent.assetFractionAvailable < price)
            revert EventCreation__AssetFractionNotAvailable();
        if (msg.value < 0) revert EventCreation__MustBeGreaterThanZero();

        saleEvent.assetFractionAvailable -= price;
        s_proceeds[msg.sender][nftAddress] += price;

        IERC72 nft = IERC72(nftAddress);
        nft.mintNft(msg.sender, _tokenUri);

        // emit ItemFractionSold();
    }

    function cancelEvent(
        uint256 eventId
    ) external isListed(eventId) isSeller(eventId) {
        Event memory saleEvent = eachEvent[eventId];
        if (block.timestamp >= saleEvent.startAt)
            revert EventCreation__SaleInProgress();
        delete eachEvent[eventId];
        delete allEvents[eventId];

        // emit ItemCanceled()
    }

    function withdrawProceeds(address nftAddress) external {
        uint256 proceeds = s_proceeds[msg.sender][nftAddress];
        if (proceeds <= 0) revert EventCreation__NoProceeds();
        s_proceeds[msg.sender][nftAddress] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        if (!success) revert EventCreation__TransferFailed();
    }

    //////////////////////
    // Getter Functions //
    //////////////////////

    function getAllSaleEvents() public view returns (Event[] memory) {
        return allEvents;
    }
}

// 1. Create event
// 2. Validate Doc by Admins
// 2. Buy asset
// 2. Cancel event
// 4. DEFI
