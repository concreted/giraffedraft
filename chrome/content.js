// insert arrive into page html
var inject = require('./content/inject');
var ypage = require('./content/yahoopage');
var watch = require('./content/watch');

var undrafted = [];
var suggestions = [];
var drafted = [];
var state = {};
var allStats = {};
var queue = {};
var sidebar = '#giraffedraft';

var closeSidebar = function() {
  document.querySelector('#giraffedraft').className = 'giraffedraft-closed';
};

var openSidebar = function() {
  document.querySelector('#giraffedraft').className = 'giraffedraft-open';
};

postIFrameMessage = function(selector, message, targetOrigin) {
  var w = document.querySelector(selector).contentWindow;
  targetOrigin = targetOrigin || '*';
  w.postMessage(message, targetOrigin);
};


var sendState = function() {
  var w = document.querySelector('#giraffedraft').contentWindow;
  ////console.log(JSON.stringify(state));
  w.postMessage({state: state}, '*');
};

var sendUser = function() {
  var w = document.querySelector('#giraffedraft').contentWindow;

  var user = document.querySelector('.ys-order-user').querySelector('.Ell').innerText;

  //console.log("sending user:", user);
  w.postMessage({user: user}, '*');
};

var sendQueue = function() {
  var w = document.querySelector('#giraffedraft').contentWindow;

  //console.log("sending queue:", queue);
  w.postMessage({queue: queue}, '*');
};

var sendAllStats = function() {
  var w = document.querySelector('#giraffedraft').contentWindow;

  //console.log("sending queue:", queue);
  w.postMessage({allStats: allStats}, '*');
};



var getPlayers = function(cb) {
  clickDraftGrid();
  var user = document.querySelector('.ys-order-user').querySelector('.Ell').innerText;
  // problem is here somewhere================================================
  function scrapePlayers() {
    var players = document.querySelector('.ys-results-grid').querySelectorAll('.ys-team');
    //console.log(players);

    Array.prototype.slice.call(players).forEach(function(player) {
      var draftPosition = player.getAttribute('data-id');
      var obj = {draftPosition: draftPosition, team: {}, isPlayer: false};
      var playerName = player.innerText.trim();
      if (playerName === user) {
        obj.isPlayer = true;
      }
      state[playerName] = obj;
    });
  }
  scrapePlayers();
 //console.log('============== scraped players and positions =================');
 //console.log(state);
  cb();
};

var updateState = function() {
  clickDraftResults();
  var playerNode = document.querySelector('#results-by-round').querySelector('tbody').children[1];
  scrapePlayerFromRBR(playerNode);
  ypage.click('players')();
  postIFrameMessage(sidebar, {state: state});
};

var getPlayerStats = function(cb) {
  // select player tab
  ypage.click('players')();

  // click 'show drafted'
  // should check if already clicked.
  document.querySelector('#show-drafted').checked = true;


  // get players list
  //var players = document.querySelector('.player-listing-table').querySelector('tbody').children;
  var players = document.querySelector('.Col2c').querySelectorAll('.ys-player');
  // get stat categories
  var statCategoriesNode = document.querySelector('.player-listing-table').querySelector('thead').children[0].children;

  var statCategories = [];
  for (var i = 2; i < statCategoriesNode.length-1; i++) {
    //debugger;
    var stat = statCategoriesNode[i].querySelector('div').innerText;
    statCategories.push(stat);
  }

 //console.log(statCategories);

  // fill out allStats table
  Array.prototype.slice.call(players).forEach(function(player) {
    //console.log(player);
    var stats = {injured: false};
    // get player name
    var playerName = player.children[1].innerText;
    // check if player injured
    if (playerName.indexOf('Injured') >= 0) {
      stats.injured = true;
    }
    //remove 'Injured' text and any unicode, trim
    playerName = playerName.replace('Injured', '').replace(/[\uE000-\uF8FF]/g, '').trim();
    // first index is ID
    var playerRanking = player.children[0].innerText;
    // second index is player name
    // last index is extra td
    for (var i = 2; i < player.children.length-1; i++) {
      stats[statCategories[i-2]] = player.children[i].innerText;
    }
    stats.playerName = playerName;
    allStats[playerRanking] = stats;
  });
  cb();
};

function scrapePlayerFromRBR(playerNode) {
  //console.log(playerNode.children[1].innerText);
  //console.log(stats);

  var fantasyPlayer = playerNode.children[2].innerText.trim();        // Need to trim because of leading space before each player's name
  //console.log('Fantasy player:', fantasyPlayer);
  var draftedPlayer = playerNode.children[1].innerText;
  var draftedPlayerRank = playerNode.children[3].innerText;

  var stats = allStats[draftedPlayerRank];

  state[fantasyPlayer]['team'][draftedPlayerRank] = stats;
}

var scrapeDraftState = function(cb) {
  clickDraftResults();

  var draft = document.querySelector('#results-by-round').querySelector('tbody').getElementsByClassName('Fz-s');

  Array.prototype.slice.call(draft).forEach(scrapePlayerFromRBR);
};

// Scrapes queue state. Should be run on load.
var scrapeQueue = function() {
  queue = {};
  var currentQueue = document.querySelector('.ys-queue-container').querySelectorAll('.ys-player');
  Array.prototype.slice.call(currentQueue).forEach(function(playerNode) {
    var playerRank = playerNode.children[0].innerText;
    queue[playerRank] = allStats[playerRank];
  });
 //console.log('================queue================');
 //console.log(queue);
  sendQueue();
};

var initialize = function(cb) {
  // Populates fantasy players into state
  //debugger;
  getPlayerStats(function() {
    sendAllStats();
    getPlayers(function() {
     //console.log(state);
      setTimeout(function() {
        scrapeDraftState();
        scrapeQueue();
        cb();
      }, 2000);
    });
  });
};

// from smack talk
// Get the player's name
// Get the teams
function sync() {
 //console.log('*************** calling sync ******************')
  initialize(function() {
    sendUser();
    sendState();
    //sendQueue();
    ypage.click('players')();
    //console.log('here');
    // set a listener to watch the draft.
    watchDraftAndUpdateState();
    // set a listener on ys-queue-table to scrape queue whenever it updates.
    // use watch.onLoad because every time queue is changed, ys-queue-table reloads.
    watch.onLoad(scrapeQueue, '.ys-queue-table');
  });
 //console.log('****************** sending state *******************');
}

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
  //console.log("=======================message received in content.js!======================");
  //console.log(event.data);
  if (event.data.command === 'init') {
    //console.log('initializing');
    initialize(function() {});
  }
  if (event.data.command === 'sync') {
    sync();
  }
  if (event.data.command === 'players') {
    getPlayerStats();
  }
}

// Check if draft page loaded. If so, sync.
if (ypage.onDraft()) {
  // watch for main draft page
  inject.sidebar("popup.html", true);
  //console.log('in a draft');
  openSidebar();
  // ys-order-list-container seems to load last/late enough that everything else is loaded.
  watch.onLoad(sync, '#ys-order-list-container');
}
else {
  inject.sidebar('popup.html', true);
  //console.log('not in draft');
}

inject.sidebarButton();

function watchDraftAndUpdateState() {
  watch.onChange(function() {
    updateState();
    //console.log('booga');
  },'#ys-order-list-container');
}
