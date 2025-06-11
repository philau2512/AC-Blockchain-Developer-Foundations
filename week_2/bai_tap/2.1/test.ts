import { SmartContract } from "./solution"

const contract = new SmartContract("Hello")
console.log(contract.getMessage());
console.assert(contract.getMessage() === "Hello", "Test 1 Failed");

contract.updateMessage("Blockchain!")
console.log(contract.getMessage());
console.assert(contract.getMessage() === "Blockchain!", "Test 2 Failed");

console.log("All tests passed!")