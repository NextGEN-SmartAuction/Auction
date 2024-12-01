



// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.0;
contract SolidityTest{
    uint sum;
    function getResult(uint a,uint b) public returns(uint){
        sum=a+b;
        return sum;
    }
}