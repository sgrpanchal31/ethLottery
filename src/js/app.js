App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    console.log("init");
    return App.initWeb3();
  },

  initWeb3: function() {
    console.log("initWeb3");
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    console.log(web3)
    return App.initContract();
  },
  initContract: function() {
    console.log("initCOntract");
    $.getJSON("lottery.json", function(lottery) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Lottery = TruffleContract(lottery);
      // Connect provider to interact with contract
      App.contracts.Lottery.setProvider(App.web3Provider);

      // App.listenForEvents();

      return App.render();
    });
  },
  // listenForEvents: function() {
  //   App.contracts.Lottery.deployed().then(function(instance) {
  //     // Restart Chrome if you are unable to receive this event
  //     // This is a known issue with Metamask
  //     // https://github.com/MetaMask/metamask-extension/issues/2393
  //     instance.votedEvent({}, {
  //       fromBlock: 0,
  //       toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       App.render();
  //     });
  //   });
  // },
  // balance: function(acct){
  //   return web3.eth.getBalance(acct, function(err){
  //     if(err){
  //       console.log(err);
  //     }
  //   }), 'ether').toNumber();
  // },


  render: function(){
    console.log("render");
    var accRow = $(".accountRow");
    var accTemplate = $(".accountTemplate");
    var loader = $("#loader");
    var content = $("#content");

    loader.hide();
    content.show();

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        console.log('hii');
        $("#accountAddress").html("Your Account: "+ account);
        console.log(App.account);
      }
    });

    return App.bindEvents();


  },
  bindEvents: function() {
    console.log("bindEvent");
    $(document).on('click', '#sendBtn', function(){
      var _amount = parseInt($("#amountSend").val());
      App.sendEther(_amount);
    });
    $(document).on('click', '#sendBet', function(){
      var _guess = parseInt($("#guess").val());
      App.makeGuess(_guess);
    });
  },
  sendEther: function(_value) {
    console.log("sendEther");

    if(_value != 1) {
      alert("The amout in the version should be 1 ether");
      return;
    }
    var account = App.account;

    App.contracts.Lottery.deployed().then(function(instance) {
      console.log("sending...");

      instance.send(web3.toWei(_value, "ether")).then(function(result) {
        console.log(result.tx);
        $("#sendBet").removeClass("disabled");
        $('#guess').prop('disabled',false);
      }).catch(function(err){
        console.log(err.message);
      });
    });

  },
  makeGuess:function(_guess){
    $("#loader").show();
    App.contracts.Lottery.deployed().then(function(instance) {
      return instance.makeGuess(_guess, { from: App.account });
    }).then(function(result) {
      $("#loader").hide();
      $("#gameStatus").show();
    }).catch(function(err) {
      console.error(err.message);
    });

  }

};

$(function() {
  $(window).load(function() {
    console.log("loaded");
    App.init();
  });
});
