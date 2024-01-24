// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin\contracts\access\AccessControl.sol";

error EventCreation__NotTime();
error EventCreation__NotApproved();

contract EventCreation {
    uint256 private totalNumberEvents;

    struct User {
        address seller;
        uint256 totalEarned;
    }

    struct Event {
        string assetType;
        uint256 startAt;
        uint256 endAt;
        uint256 assetPrice;
        bool approved;
    }

    mapping(address => mapping(uint256 => User)) private userToEventId;
    mapping(uint256 => Event) private eachEvent;

    Event[] private allEvents;

    modifier onlyAdmin() {}

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
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
            false
        );
        if (theEvent.approved) revert EventCreation__NotApproved();
        if (block.timestamp < _startAt) revert EventCreation__NotTime();
        userToEventId[msg.sender][totalNumberEvents] = User(msg.sender, 0);
        eachEvent[totalNumberEvents] = theEvent;

        totalNumberEvents += 1;
    }

    function validateEventDoc(
        string calldata _docLink,
        uint256 eventId
    ) external onlyAdmin {}
}

// 1. Create event
// 2. Validate Doc by Admins
// 2. Buy asset
// 2. Cancel event
// 3. Make Admin
// 4. DEFI
