var Lottery = artifact.require("./lottery.sol");

contract("Lottery", function(accounts){

    it("initializes with two candidates", function() {
        return Lottery(1000).deployed().then(function(instance) {
            return instance.owner();
        }).then(function(address) {
            assert.equal(address, accounts[0]);
        });
    });
});