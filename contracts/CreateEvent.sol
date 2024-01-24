// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

error EventCreation__NotTime();
error EventCreation__NotApproved();
error EventCreation__NotAdmin();

contract EventCreation is AccessControl {
    uint256 private totalNumberEvents;
    address public immutable i_owner;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    enum Status {
        Pending,
        Not_Approved,
        Approved
    }

    struct User {
        address seller;
        uint256 totalEarned;
    }

    struct Event {
        string assetType;
        uint256 startAt;
        uint256 endAt;
        uint256 assetPrice;
        Status status;
    }

    mapping(address => mapping(uint256 => User)) private userToEventId;
    mapping(uint256 => Event) private eachEvent;

    Event[] private allEvents;

    modifier onlyAdmin() {
        if (i_owner != msg.sender) revert EventCreation__NotAdmin();
        _;
    }

    constructor() {
        i_owner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, i_owner);
    }

    function CreateEvent(
        uint256 _startAt,
        uint256 _endAt,
        string calldata _assetType,
        uint256 _assetPrice
    ) external {
        Event memory theEvent = Event(
            _assetType,
            _startAt,
            _endAt,
            _assetPrice,
            Status.Pending
        );
        if (
            theEvent.status == Status.Pending ||
            theEvent.status == Status.Not_Approved
        ) revert EventCreation__NotApproved();
        if (block.timestamp < _startAt) revert EventCreation__NotTime();
        userToEventId[msg.sender][totalNumberEvents] = User(msg.sender, 0);
        eachEvent[totalNumberEvents] = theEvent;
        allEvents.push(theEvent);

        totalNumberEvents += 1;
    }

    // function()

    function validateEventDoc(
        string calldata _docLink,
        uint256 eventId,
        Status _status
    ) external onlyRole(MINTER_ROLE) {
        Event memory theEvent = eachEvent[eventId];
        theEvent.status = _status;

        // emit ValidateEvent(eventId, _status);
    }

    function grantRole(bytes32, address account) public override onlyAdmin {
        _grantRole(MINTER_ROLE, account);
    }
}

// 1. Create event
// 2. Edit event
// 2. Validate Doc by Admins
// 2. Buy asset
// 2. Cancel event
// 3. Make Admin
// 4. DEFI
