var Lottery = artifacts.require("./lottery.sol");
chai = require("chai");
chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
expect = chai.expect;

contract("Lottery", function(accounts){
    describe("Deploy the Lottery smart contract", function(){
        it("catch an instance of the Lottery contract", function(){
            return Lottery.new().then(function(instance){
                lotteryContract = instance;
            });
        });
    });

});