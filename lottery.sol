pragma solidity ^0.4.0;

contract Lottery {
    
    struct gambler{
        uint tokens;
        bytes32 gamblersGuess;
    }
    address[] public addressIndices;
    address[] public winnerIndices;
    mapping (address => gambler) _accounts;
    
    bool gameStatus = true;
    
    address owner;

    bytes32 constant private winningGuess;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function Lottery(){
        owner = msg.sender;
        winningGuess = sha3(uint(1000));
    }
    
    function () public payable {
        require (gameStatus == true);
        require (msg.value == 1 ether);
        _accounts[msg.sender].tokens += 1;
        addressIndices.push(msg.sender);
    }
    
    function makeGuess(uint guess) public{
        require (gameStatus == true);
        require(_accounts[msg.sender].tokens>0);
        _accounts[msg.sender].tokens -= 1;
        _accounts[msg.sender].gamblersGuess = sha3(uint(guess));
    }
    
    function closeGame() onlyOwner returns(bool){
        // winnerAddress();
        return gameStatus = false;
    }
    
    function winnerAddress() private {
        uint arrayLength = addressIndices.length;
        for (uint i=0; i<arrayLength; i++){
            if(_accounts[addressIndices[i]].gamblersGuess == winningGuess){
                winnerIndices.push(addressIndices[i]);
            }
        }
        
    }
    
    function getTokens() public returns (uint) {
        return _accounts[msg.sender].tokens;
    }
    function getGuess() public returns (bytes32) {
        return _accounts[msg.sender].gamblersGuess;
    }
}

// contract EtherTransferFrom {
    
//     Lottery private _instance;
    
//     function EtherTransferFrom() public {
//         // _instance = EtherTransferTo(address(this));
//         _instance = new Lottery();
//     }
    
//     function getBalance() public returns (uint) {
//         return address(this).balance;
//     }
    
//     function getBalanceOfInstance() public returns (uint) {
//         //return address(_instance).balance;
//         // return _instance.getBalance();
//     }
    
//     function () public payable {
//         //msg.sender.send(msg.value);
//         address(_instance).send(msg.value);
//     }
// }