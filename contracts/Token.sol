//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

contract Token {
    string public name="Hardhat Token";
    string public symbol = "HHT";
    uint public totalSupply = 10000;
    address public owner;

    mapping(address => uint) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transferToken(address to, uint amount) external {
        require(balances[msg.sender] >= amount, "Not sufficent token for transfer");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function checkBalance(address account) public view returns(uint) {
        return balances[account];
    }
}