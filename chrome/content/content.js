// Insert iFrame referencing popup.html
var iframe = document.createElement('iframe');
iframe.src = chrome.extension.getURL("popup.html");
iframe.id = 'giraffedraft';
iframe.align = 'right';
iframe.width = '300';
iframe.height = '100%';
iframe.style.position = "fixed";
iframe.style.top = '0px';
iframe.style.right = '0px';
iframe.style.zIndex = '10000000000';
iframe.style.backgroundColor = 'white';
document.body.appendChild(iframe);


var undrafted = [];
var suggestions = [];
var drafted = [];
var state = {};
var allStats = {};

var sendState = function() {
  var w = document.querySelector('#giraffedraft').contentWindow;
  w.postMessage({state: state}, '*');
};

var sendUser = function() {
  var w = document.querySelector('#giraffedraft').contentWindow;
  // not working, why?
  //var user = document.querySelector('#fixed-pick').querySelector('.Ell').innerText;
  var user = 'Walter';
  console.log("sending user:", user);
  w.postMessage({user: user}, '*');
};

var click = function(){
  document.querySelector('.NavTabs').childNodes[5].click();
};

// var getUserName = function() {
//   document.querySelector('#fixed-pick').querySelector('.Ell').innerText;
// };

var getPlayers = function() {
  document.querySelector('.NavTabs').childNodes[5].click();
  document.querySelector('.SubNavTabs').children[1].click();

  var players = document.getElementsByClassName('Fz-xs Ell');
  //console.log(players);
  Array.prototype.slice.call(players).forEach(function(player) {
    state[player.innerHTML] = {};
  });
};

var selectDraftResults = function() {
  // Select the draft results tab
  document.querySelector('.NavTabs').childNodes[5].click();
  document.querySelector('.SubNavTabs').children[0].click();
};

var updateState = function() {
  // selectDraftResults();
  // // Drafted player
  // var draftedPlayer = document.querySelector('#results-by-round').querySelector('tbody').children[1].children[1].innerText;
  // // Fantasy sports player
  // var fantasyPlayer = document.querySelector('#results-by-round').querySelector('tbody').children[1].children[2].innerText.trim();
  //
  // state[fantasyPlayer].push(draftedPlayer);
  //
  // //console.log(state);
  // sendState();
};

var getPlayerStats = function() {
  // select player tab
  document.querySelector('.NavTabs').childNodes[1].click();

  // click 'show drafted'
  // should check if already clicked.
  document.querySelector('#show-drafted').click();


  // get players list
  var players = document.querySelector('.player-listing-table').querySelector('tbody').children;

  // get stat categories
  var statCategoriesNode = document.querySelector('.player-listing-table').querySelector('thead').children[0].children;

  var statCategories = [];
  for (var i = 2; i < statCategoriesNode.length-1; i++) {
    //debugger;
    var stat = statCategoriesNode[i].querySelector('div').innerText;
    statCategories.push(stat);
  }

  console.log(statCategories);

  // fill out allStats table
  Array.prototype.slice.call(players).forEach(function(player) {
    //console.log(player);

    // get player name
    var playerName = player.children[1].innerText.slice(3);
    var stats = {};
    // first index is ID
    // second index is player name
    // last index is extra td
    for (var i = 2; i < player.children.length-1; i++) {
      stats[statCategories[i-2]] = player.children[i].innerText;
    }
    allStats[playerName] = stats;
  });

  console.log(allStats);
  console.log(allStats.length);

};

var initialize = function() {
  // Populates fantasy players into state
  getPlayers();
  //console.log(state);

  selectDraftResults();

  var draft = document.querySelector('#results-by-round').querySelector('tbody').children;
  Array.prototype.slice.call(draft).forEach(function(playerNode) {
    if (playerNode.className !== 'drkTheme') {
      // grab stats:
      // click on player
      playerNode.children[1].click();
      //debugger;
      // read his stats

      var stats = {};
      var categoriesNode = document.querySelector('.ys-playerdetails-table').querySelector('thead').querySelector('tr').children;
      var statsNode = document.querySelector('.ys-playerdetails-table').querySelector('tbody').querySelector('tr').children;

      var categoriesList = Array.prototype.slice.call(categoriesNode);
      var statsList = Array.prototype.slice.call(statsNode);

      // start from second index - first index is description
      for (var i = 1; i < categoriesList.length; i++) {
        stats[categoriesList[i].innerText] = statsList[i].innerText;
      }

      //console.log(playerNode.children[1].innerText);
      //console.log(stats);

      var fantasyPlayer = playerNode.children[2].innerText.trim();        // Need to trim because of leading space before each player's name
      //console.log('Fantasy player:', fantasyPlayer);
      var draftedPlayer = playerNode.children[1].innerText;
      state[fantasyPlayer][draftedPlayer] = stats;
    }
  });
  //console.log(state);

  // Set event listener to scrape the DOM
  //document.querySelector('.Col2c').addEventListener('DOMNodeInserted', updateState);
};

// from smack talk
// Get the player's name
// Get the teams

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
  console.log("=======================message received in content.js!======================");
  console.log(event.data);
  if (event.data.command === 'init') {
    console.log('initializing');
    initialize();
  }
  if (event.data.command === 'sync') {
    initialize();
    console.log('sending state');
    //console.log(JSON.stringify(state));
    sendUser();
    sendState();
  }
  if (event.data.command === 'players') {
    getPlayerStats();
  }
}


// setInterval(function() {
//   console.log(JSON.stringify(state));
//   sendState();
// }, 2000);
