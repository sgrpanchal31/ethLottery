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

      return App.render();
    });
  },



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

    
    App.contracts.Lottery.deployed().then(function(instance) {
      console.log("instance created");
      Lottery = instance;
      return Lottery.getStatus({from: App.account});
    }).then(function(res){
      console.log(res);
      if(res){
        $('#gameStatus').show();
      } else{
        $('#gameStatus').hide();
        $('#getPrice').show();
      }
    }).catch(function(e){
      console.log(e);
    });

    App.contracts.Lottery.deployed().then(function(instance) {
      console.log("get owner");
      Lottery = instance;
      return Lottery.getOwner({from: App.account});
    }).then(function(owner){
      console.log(owner);
      if( App.account == owner){
        $('#closeGame').show();
      }
    }).catch(function(e){
      console.log(e);
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
    $(document).on('click', '#getPrice', function(){
      App.getPrice();
    });
    $(document).on('click', '#closeGame', function(){
      App.closeGame();
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

  },
  getPrice: function(){
    $('#getPrice').addClass("disabled");
    App.contracts.Lottery.deployed().then(function(instance) {
      console.log("getprice");
      Lottery = instance;
      return Lottery.getPrice({from: App.account});
    }).then(function(res){
      console.log(res);
      if(res){
        $('#gameStatus').html('Congrats you won'+ res+' ether');
      }
    }).catch(function(e){
      console.log(e);
      $('#getPrice').removeClass("disabled");
    });
  },
  closeGame: function(){
    $('#closeGame').addClass("disabled");
    App.contracts.Lottery.deployed().then(function(instance) {
      console.log("closegame");
      Lottery = instance;
      return Lottery.closeGame({from: App.account});
    }).then(function(price){
      console.log(res);
      if(res){
        $('#gameStatus').html('Game has been closed');
      }
    }).catch(function(e){
      console.log(e);
      $('#closeGame').removeClass("disabled");
    });
  }

};

$(function() {
  $(window).load(function() {
    console.log("loaded");
    App.init();
  });
});
