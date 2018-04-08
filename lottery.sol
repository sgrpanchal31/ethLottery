pragma solidity ^0.4.0;

contract Lottery {
    
    struct gambler{
        uint tokens;
        bytes32 gamblersGuess;
    }
    
    mapping (address => gambler) _accounts;
    
    address owner;

    bytes32 winningGuess;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function Lottery(){
        owner = msg.sender;
        winningGuess = sha3(uint(1000));
    }
    
    function () public payable {
        require (msg.value == 1 ether);
        _accounts[msg.sender].tokens += 1;
    }
    
    function makeGuess(uint guess) public{
        require(_accounts[msg.sender].tokens>0);
        _accounts[msg.sender].tokens -= 1;
        _accounts[msg.sender].gamblersGuess = sha3(uint(guess));
    }
    
    function getBalance() public returns (uint) {
        return address(this).balance;
    }
    
    // function withdraw() public returns (bool) {
    //     uint amount = winners[msg.sender];
    //     winners[msg.sender] = 0;
    //     if (msg.sender.send(amount)) {
    //         return true;
    //     } else {
    //         winners[msg.sender] = amount;
    //         return false;
    //     }
    // }
}

contract EtherTransferFrom {
    
    Lottery private _instance;
    
    function EtherTransferFrom() public {
        // _instance = EtherTransferTo(address(this));
        _instance = new Lottery();
    }
    
    function getBalance() public returns (uint) {
        return address(this).balance;
    }
    
    function getBalanceOfInstance() public returns (uint) {
        //return address(_instance).balance;
        return _instance.getBalance();
    }
    
    function () public payable {
        //msg.sender.send(msg.value);
        address(_instance).send(msg.value);
    }
}