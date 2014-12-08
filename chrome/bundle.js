(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// insert arrive into page html
var arrive = require('./lib/arrive-2.0.0.min.js');
var inject = require('./content/inject');
var ypage = require('./content/yahoopage');

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
    // use actionOnLoad because every time queue is changed, ys-queue-table reloads.
    actionOnLoad(scrapeQueue, '.ys-queue-table');
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
  actionOnLoad(sync, '#ys-order-list-container');
}
else {
  inject.sidebar('http://giraffedraft.azurewebsites.net');
  //console.log('not in draft');
}

inject.sidebarButton();

// var target = document.querySelector('body');

// var observer = new MutationObserver(function (mutations) {
//     // Whether you iterate over mutations..
//     mutations.forEach(function (mutation) {
//       // or use all mutation records is entirely up to you
//       var entry = {
//         mutation: mutation,
//         el: mutation.target,
//         value: mutation.target.textContent,
//         oldValue: mutation.oldValue
//       };
//       console.log('Recording mutation:', entry);
//     });
//   });
//
// var config = { attributes: true, childList: true, characterData: true };
//
// observer.observe(target, config);


// Setup sync on draft pick. Should only update new draft picks, not do
// full sync.

// This can't be in a function for some reason. If in a function, the
// event listener doesn't register???
// actionOnLoad(function() {
//   actionOnChange(function() {
//     updateState();
//     console.log('booga');
//   },'#ys-order-list-container');
// }, '#ys-order-list-container');

function watchDraftAndUpdateState() {
  actionOnChange(function() {
    updateState();
    //console.log('booga');
  },'#ys-order-list-container');
}

// sets a mutation observer on an element.
// if element doesn't exist, waits for it to be loaded with
// actionOnLoad.

// Need to test when draft is first starting.
// This works when joining a draft in progress, but NOT
// when draft first starts
function actionOnChange(action, selector, parent) {
  function watch() {
    var observer = new MutationObserver(function(mutations) {
      //console.log(mutations);
      action();
    });
    var config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(target, config);
    //console.log(observer);
  }

  var target = document.querySelector(selector);

  if (!target) {
    actionOnLoad(watch, selector, parent);
  }
  else {
    watch();
  }
}

// actionOnLoad: uses arrive.js to watch for arrival of DOM element
// at selector, and calls action() when it arrives.
// To fix: Should check for existence of
function actionOnLoad(action, selector, parent) {
  if (parent) {
    document.querySelector(parent).arrive(selector, function() {
      //console.log(this);
      action();
      //document.unbindArrive(selector);
    });
  }
  else {
    document.arrive(selector, function() {
      //console.log(this);
      action();
      //document.unbindArrive(selector);
    });
  }
}

},{"./content/inject":2,"./content/yahoopage":3,"./lib/arrive-2.0.0.min.js":4}],2:[function(require,module,exports){
// inject.js

module.exports = {
  // Insert iFrame referencing popup.html
  sidebar: function(src, isInternalUrl) {
    var iframe = document.createElement('iframe');

    if (isInternalUrl) iframe.src = chrome.extension.getURL(src);
    else iframe.src = src;

    iframe.id = 'giraffedraft';
    iframe.align = 'right';
    iframe.width = '271';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.style.position = "fixed";
    iframe.style.top = '0px';
    iframe.style.right = '0px';
    iframe.style.zIndex = '10000000000';
    iframe.style.backgroundColor = 'white';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  },

  // Insert button to toggle showing the iFrame
  sidebarButton: function() {
    var toggler = document.createElement('button');
    toggler.id = 'giraffedraft-toggle';
    toggler.className = 'giraffedraft-toggle-closed';

    toggler.innerText = "Shot Caller";
    //toggler.style.fontSize = '20px';

    toggler.onclick = function() {
      var display = document.querySelector('#giraffedraft').style.display;
      if (display === '') {
        document.querySelector('#giraffedraft').style.display = 'none';
        toggler.className = 'giraffedraft-toggle-closed';
      }
      else {
        document.querySelector('#giraffedraft').style.display = '';
        toggler.className = 'giraffedraft-toggle-open';
      }
    };
    document.body.appendChild(toggler);
  }

};

},{}],3:[function(require,module,exports){
module.exports = {
  // Check if current page is Yahoo Draft page.
  onDraft: function() {
    return !!(document.querySelector('.ys-draftclient'));
  },

  // Check if current page is the main drafting interface.
  // draftMain: function() {
  //   return !!(document.querySelector('#draft-controls'));
  // },

  click: function(route) {
    if (route === 'players') {
      document.querySelector('.NavTabs').children[0].click();
    }
    else if (route === 'teams') {
      document.querySelector('.NavTabs').children[1].click();
    }
    else if (route === 'draftResults') {
      document.querySelector('.NavTabs').children[2].click();
      document.querySelector('.SubNavTabs').children[0].click();
    }
    else if (route === 'draftGrid') {
      document.querySelector('.NavTabs').children[2].click();
      document.querySelector('.SubNavTabs').children[1].click();
    }
  }

};

},{}],4:[function(require,module,exports){
/*
 * arrive.js
 * v2.0.0
 * https://github.com/uzairfarooq/arrive
 * MIT licensed
 *
 * Copyright (c) 2014 Uzair Farooq
 */

(function(q,r,m){function n(a,b,e){for(var d=0,c;c=a[d];d++)f.matchesSelector(c,b.selector)&&-1==b.firedElems.indexOf(c)&&(b.firedElems.push(c),e.push({callback:b.callback,elem:c})),0<c.childNodes.length&&n(c.childNodes,b,e)}function s(a){for(var b=0,e;e=a[b];b++)e.callback.call(e.elem)}function g(a){a.arrive=h.bindEvent;f.addMethod(a,"unbindArrive",h.unbindEvent);f.addMethod(a,"unbindArrive",h.unbindEventWithSelectorOrCallback);f.addMethod(a,"unbindArrive",h.unbindEventWithSelectorAndCallback);a.leave=
k.bindEvent;f.addMethod(a,"unbindLeave",k.unbindEvent);f.addMethod(a,"unbindLeave",k.unbindEventWithSelectorOrCallback);f.addMethod(a,"unbindLeave",k.unbindEventWithSelectorAndCallback)}var f=function(){var a=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(b,e){return b instanceof HTMLElement&&a.call(b,e)},addMethod:function(b,a,d){var c=b[a];b[a]=function(){if(d.length==
arguments.length)return d.apply(this,arguments);if("function"==typeof c)return c.apply(this,arguments)}}}}(),t=function(){var a=function(){this._eventsBucket=[];this._beforeRemoving=this._beforeAdding=null};a.prototype.addEvent=function(b,a,d,c){b={target:b,selector:a,options:d,callback:c,firedElems:[]};this._beforeAdding&&this._beforeAdding(b);this._eventsBucket.push(b);return b};a.prototype.removeEvent=function(b){for(var a=this._eventsBucket.length-1,d;d=this._eventsBucket[a];a--)b(d)&&(this._beforeRemoving&&
this._beforeRemoving(d),this._eventsBucket.splice(a,1))};a.prototype.beforeAdding=function(b){this._beforeAdding=b};a.prototype.beforeRemoving=function(b){this._beforeRemoving=b};return a}();m=function(a,b,e){function d(b){"number"!==typeof b.length&&(b=[b]);return b}var c=new t;c.beforeAdding(function(b){var c=b.target,d;if(c===q.document||c===q)c=document.getElementsByTagName("html")[0];d=new MutationObserver(function(a){e.call(this,a,b)});var l=a(b.options);d.observe(c,l);b.observer=d});c.beforeRemoving(function(b){b.observer.disconnect()});
this.bindEvent=function(a,e,p){"undefined"===typeof p&&(p=e,e=b);for(var l=d(this),f=0;f<l.length;f++)c.addEvent(l[f],a,e,p)};this.unbindEvent=function(){var b=d(this);c.removeEvent(function(a){for(var c=0;c<b.length;c++)if(a.target===b[c])return!0;return!1})};this.unbindEventWithSelectorOrCallback=function(b){var a=d(this);c.removeEvent("function"===typeof b?function(c){for(var d=0;d<a.length;d++)if(c.target===a[d]&&c.callback===b)return!0;return!1}:function(c){for(var d=0;d<a.length;d++)if(c.target===
a[d]&&c.selector===b)return!0;return!1})};this.unbindEventWithSelectorAndCallback=function(b,a){var e=d(this);c.removeEvent(function(c){for(var d=0;d<e.length;d++)if(c.target===e[d]&&c.selector===b&&c.callback===a)return!0;return!1})};return this};var h=new m(function(a){var b={attributes:!1,childList:!0,subtree:!0};a.fireOnAttributesModification&&(b.attributes=!0);return b},{fireOnAttributesModification:!1},function(a,b){a.forEach(function(a){var d=a.addedNodes,c=a.target,g=[];null!==d&&0<d.length?
n(d,b,g):"attributes"===a.type&&f.matchesSelector(c,b.selector)&&-1==b.firedElems.indexOf(c)&&(b.firedElems.push(c),g.push({callback:b.callback,elem:c}));s(g)})}),k=new m(function(a){return{childList:!0,subtree:!0}},{},function(a,b){a.forEach(function(a){a=a.removedNodes;var d=[];null!==a&&0<a.length&&n(a,b,d);s(d)})});r&&g(r.fn);g(HTMLElement.prototype);g(NodeList.prototype);g(HTMLCollection.prototype);g(HTMLDocument.prototype);g(Window.prototype)})(this,"undefined"===typeof jQuery?null:jQuery);

},{}]},{},[1]);
