// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

contract PersonalDetails {
    struct HealthRecord {
        uint age;
        uint bloodPressure;
        uint sex;
        uint cp;
        uint thalach;
        uint oldpeak;
        bool exists; // Marker to check if the record exists
    }

    mapping(address => HealthRecord) private records;

    // Event for logging purposes
    event RecordUpdated(address indexed user, uint age, uint bloodPressure, uint sex, uint cp, uint thalach, uint oldpeak);

    // Create or Update
    function setRecord(uint _age, uint _bloodPressure, uint _sex, uint _cp, uint _thalach, uint _oldpeak) public {
        records[msg.sender] = HealthRecord(_age, _bloodPressure, _sex, _cp, _thalach, _oldpeak, true);
        emit RecordUpdated(msg.sender, _age, _bloodPressure, _sex, _cp, _thalach, _oldpeak);
    }

    // Read
    function getRecord() public view returns (uint, uint, uint, uint, uint, uint) {
        require(records[msg.sender].exists, "Record does not exist");
        HealthRecord storage record = records[msg.sender];
        return (record.age, record.bloodPressure, record.sex, record.cp, record.thalach, record.oldpeak);
    }

    // Delete
    function deleteRecord() public {
        require(records[msg.sender].exists, "Record does not exist");
        delete records[msg.sender];
    }
}
