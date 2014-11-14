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

var click = function(){
  document.querySelector('.NavTabs').childNodes[5].click();
};

var calculate = function(){
  $http.post('http://giraffedraft.azurewebsites.net/api/suggest', undrafted).
  success(function(data, status, headers, config) {
    suggestions = data;
  }).
  error(function(data, status, headers, config) {
    console.log('does not work', undrafted);
  });
};


var markDrafted = function(){
  console.log('undrafted', this.player);
  drafted.push(this.player);
  var ind = undrafted.indexOf(this.player);
  undrafted.splice(ind,1);
  calculate();
};

var getPlayers = function() {
  document.querySelector('.NavTabs').childNodes[5].click();
  document.querySelector('.SubNavTabs').children[1].click();

  var players = document.getElementsByClassName('Fz-xs Ell');
  console.log(players);
  Array.prototype.slice.call(players).forEach(function(player) {
    state[player.innerHTML] = [];
  });
};

var selectDraftResults = function() {
  // Select the draft results tab
  document.querySelector('.NavTabs').childNodes[5].click();
  document.querySelector('.SubNavTabs').children[0].click();
};

var updateState = function() {
  selectDraftResults();
  // Drafted player
  var draftedPlayer = document.querySelector('#results-by-round').querySelector('tbody').children[1].children[1].innerText;
  // Fantasy sports player
  var fantasyPlayer = document.querySelector('#results-by-round').querySelector('tbody').children[1].children[2].innerText.trim();

  state[fantasyPlayer].push(draftedPlayer);

  console.log(state);
};

var initialize = function() {
  // Populates fantasy players into state
  getPlayers();
  console.log(state);

  selectDraftResults();

  var draft = document.querySelector('#results-by-round').querySelector('tbody').children;
  Array.prototype.slice.call(draft).forEach(function(playerNode) {
    if (playerNode.className !== 'drkTheme') {
      var fantasyPlayer = playerNode.children[2].innerText.trim();        // Need to trim because of leading space before each player's name
      //console.log('Fantasy player:', fantasyPlayer);
      var draftedPlayer = playerNode.children[1].innerText;
      state[fantasyPlayer].push(draftedPlayer);
    }
  });
  console.log(state);

  // Set event listener to scrape the DOM
  document.querySelector('.Col2c').addEventListener('DOMNodeInserted', updateState);
};

setInterval(function() {
  var data = document.querySelector('input').value;
  console.log(data);
  var w = document.querySelector('#giraffedraft').contentWindow;
  console.log(w);
  w.postMessage({data: data}, '*');
}, 2000);
