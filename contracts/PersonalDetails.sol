// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract PersonalDetails {
    struct Record {
        uint256 age; // No scaling needed
        uint256 bloodPressure; // Scaled by 100
        uint256 sex; // No scaling needed
        uint256 cp; // Scaled by 100
        uint256 thalach; // Scaled by 100
        uint256 oldpeak; // Scaled by 100
    }

    mapping(address => Record) private records;
    mapping(address => bool) private hasRecord; // Track if an account has stored data

    // Save record with scaled values
    function setRecord(
        uint256 _age,
        uint256 _bloodPressure, // Multiply float by 100 before passing
        uint256 _sex,
        uint256 _cp, // Multiply float by 100 before passing
        uint256 _thalach, // Multiply float by 100 before passing
        uint256 _oldpeak // Multiply float by 100 before passing
    ) public {
        require(!hasRecord[msg.sender], "Record already exists for this account"); // Check if the account has already stored data

        records[msg.sender] = Record(_age, _bloodPressure, _sex, _cp, _thalach, _oldpeak);
        hasRecord[msg.sender] = true; // Mark the account as having stored data
    }

    // Fetch the record (returns scaled values)
    function getRecord() public view returns (uint256, uint256, uint256, uint256, uint256, uint256) {
        require(hasRecord[msg.sender], "No record found for this account");
        Record memory record = records[msg.sender];
        return (
            record.age,
            record.bloodPressure, // Divide by 100 on the frontend to get the float value
            record.sex,
            record.cp, // Divide by 100 on the frontend to get the float value
            record.thalach, // Divide by 100 on the frontend to get the float value
            record.oldpeak // Divide by 100 on the frontend to get the float value
        );
    }

    // Delete record
    function deleteRecord() public {
        require(hasRecord[msg.sender], "No record found to delete");
        delete records[msg.sender];
        hasRecord[msg.sender] = false; // Reset the record status
    }

    // Check if record exists
    function recordExists() public view returns (bool) {
        return hasRecord[msg.sender];
    }
}
