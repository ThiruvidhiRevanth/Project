// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

contract Authentication {
    uint256 public nbOfUsers;

    struct User {
        string signatureHash;
        address userAddress;
    }

    mapping(address => User) private user;

    // Event for registration
    event UserRegistered(address indexed userAddress, string signatureHash);

    constructor() {
        nbOfUsers = 0;
    }

    // Function to register a new user
    function register(string memory _signature) public {
        require(
            user[msg.sender].userAddress == address(0),
            "already registered"
        );

        user[msg.sender].signatureHash = _signature;
        user[msg.sender].userAddress = msg.sender;
        nbOfUsers++;

        emit UserRegistered(msg.sender, _signature);
    }

    // Function to get the signature hash of the caller
    function getSignatureHash() public view returns (string memory) {
        require(
            user[msg.sender].userAddress != address(0),
            "Not allowed"
        );

        return user[msg.sender].signatureHash;
    }

    // Function to get the user's registered address
    function getUserAddress() public view returns (address) {
        require(
            user[msg.sender].userAddress != address(0),
            "Not allowed"
        );

        return user[msg.sender].userAddress;
    }

    // Helper function to check if an address is registered
    function isRegistered(address _address) public view returns (bool) {
        return user[_address].userAddress != address(0);
    }

    // Helper function to retrieve user details for debugging
    function getUserDetails(address _user)
        public
        view
        returns (string memory signature, address userAddr)
    {
        require(
            user[_user].userAddress != address(0),
            "User not registered"
        );

        return (user[_user].signatureHash, user[_user].userAddress);
    }
}
