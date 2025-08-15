// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {
    address public admin;

    enum LandStatus { Registered, Verified, Rejected }

    struct Land {
        uint256 landId;
        string location;
        uint256 area;
        address owner;
        LandStatus status;
    }

    uint256 public nextLandId;
    mapping(uint256 => Land) public lands;
    mapping(address => uint256[]) public ownedLands;

    event LandRegistered(uint256 landId, address indexed owner);
    event LandVerified(uint256 landId);
    event LandRejected(uint256 landId);
    event LandTransferred(uint256 landId, address indexed from, address indexed to);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyOwner(uint256 _landId) {
        require(lands[_landId].owner == msg.sender, "Only land owner can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerLand(string memory _location, uint256 _area) external {
        lands[nextLandId] = Land({
            landId: nextLandId,
            location: _location,
            area: _area,
            owner: msg.sender,
            status: LandStatus.Registered
        });
        ownedLands[msg.sender].push(nextLandId);

        emit LandRegistered(nextLandId, msg.sender);
        nextLandId++;
    }

    function verifyLand(uint256 _landId) external onlyAdmin {
        require(lands[_landId].status == LandStatus.Registered, "Land must be registered first");
        lands[_landId].status = LandStatus.Verified;
        emit LandVerified(_landId);
    }

    function rejectLand(uint256 _landId) external onlyAdmin {
        require(lands[_landId].status == LandStatus.Registered, "Land must be registered first");
        lands[_landId].status = LandStatus.Rejected;
        emit LandRejected(_landId);
    }

    function transferLand(uint256 _landId, address _to) external onlyOwner(_landId) {
        require(lands[_landId].status == LandStatus.Verified, "Only verified lands can be transferred");

        // Remove from current owner
        uint256[] storage senderLands = ownedLands[msg.sender];
        for (uint256 i = 0; i < senderLands.length; i++) {
            if (senderLands[i] == _landId) {
                senderLands[i] = senderLands[senderLands.length - 1];
                senderLands.pop();
                break;
            }
        }

        // Transfer ownership
        lands[_landId].owner = _to;
        ownedLands[_to].push(_landId);

        emit LandTransferred(_landId, msg.sender, _to);
    }

    // ✅ Existing: Get lands of the current user
    function getMyLands() external view returns (uint256[] memory) {
        return ownedLands[msg.sender];
    }

    // ✅ NEW: Get lands by any owner's address
    function getLandsByOwner(address _owner) external view returns (uint256[] memory) {
        return ownedLands[_owner];
    }

    // ✅ Get all details of a land
    function getLandDetails(uint256 _landId) external view returns (
        uint256, string memory, uint256, address, LandStatus
    ) {
        Land memory land = lands[_landId];
        return (land.landId, land.location, land.area, land.owner, land.status);
    }

    // ✅ Return full land array
    function getAllLands() external view returns (Land[] memory) {
        Land[] memory allLands = new Land[](nextLandId);
        for (uint256 i = 0; i < nextLandId; i++) {
            allLands[i] = lands[i];
        }
        return allLands;
    }

    // ✅ Land Statistics
    function getLandStats() external view returns (uint256 totalLands, uint256 verifiedLands) {
        uint256 verifiedCount = 0;
        for (uint256 i = 0; i < nextLandId; i++) {
            if (lands[i].status == LandStatus.Verified) {
                verifiedCount++;
            }
        }
        return (nextLandId, verifiedCount);
    }

    function getAdmin() public view returns (address) {
    return admin;
}

}
