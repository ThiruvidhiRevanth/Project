// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract PersonalDetails {
    struct Person {
        string name;
        uint age;
        string addressInfo;
        string email;
    }

    mapping(address => Person) private people;

    // Event to emit when a person is added, updated, or deleted
    event PersonAdded(address indexed personAddress, string name, uint age, string addressInfo, string email);
    event PersonUpdated(address indexed personAddress, string name, uint age, string addressInfo, string email);
    event PersonDeleted(address indexed personAddress);

    // Function to add or update personal details
    function addOrUpdatePerson(string memory _name, uint _age, string memory _addressInfo, string memory _email) public {
        people[msg.sender] = Person(_name, _age, _addressInfo, _email);
        emit PersonAdded(msg.sender, _name, _age, _addressInfo, _email);
    }

    // Function to delete personal details
    function deletePerson() public {
        delete people[msg.sender];
        emit PersonDeleted(msg.sender);
    }

    // Function to retrieve personal details
    function getPerson(address _personAddress) public view returns (string memory, uint, string memory, string memory) {
        Person memory person = people[_personAddress];
        return (person.name, person.age, person.addressInfo, person.email);
    }
}
