// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentRegistry {
    struct Student {
        string name;
        uint age;
        bool isRegister;
    }

    mapping (address => Student) private students;

    function register(string memory _name, uint _age) public {
        require(!students[msg.sender].isRegister, "Student already registered.");
        students[msg.sender] = Student(_name, _age, true);
    }

    function getStudent(address user) public view returns (string memory, uint, bool) {
        require(students[user].isRegister, "Student not registered.");
        return (students[user].name, students[user].age, students[user].isRegister);
    }

    function isStudentRegistered(address user) public view returns (bool) {
        return students[user].isRegister;
    }
}