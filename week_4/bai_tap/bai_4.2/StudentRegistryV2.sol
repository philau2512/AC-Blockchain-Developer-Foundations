// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentRegistry {
    struct Student {
        string name;
        uint age;
        bool isRegistered;
    }

    mapping (address => Student) private students;

    address private owner;

    event StudentRegistered(address indexed user, string name, uint age);
    constructor() {
        owner = msg.sender;
    }

    function registerStudent(address _user, string memory _name, uint _age) public {
        require(msg.sender == owner, "Only owner can add students.");
        require(!students[_user].isRegistered, "Student already registered.");
        
        students[_user] = Student({
            name: _name,
            age: _age,
            isRegistered: true
        });
        emit StudentRegistered(_user, _name, _age);
    }

    function getStudent(address user) public view returns (string memory, uint, bool) {
        require(students[user].isRegistered, "Student not registered.");
        return (students[user].name, students[user].age, students[user].isRegistered);
    }

    function isStudentRegistered(address user) public view returns (bool) {
        return students[user].isRegistered;
    }
}