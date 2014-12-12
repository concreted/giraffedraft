var arrive = require('../lib/arrive-2.0.0.min.js');

function createMutationObserver(target, action) {
  var observer = new MutationObserver(function(mutations) {
    action();
  });
  var config = { attributes: true, childList: true, characterData: true, subtree: true };
  observer.observe(target, config);
}

// Need to test when draft is first starting.
// This works when joining a draft in progress, but NOT
// when draft first starts
function onChange(action, selector, parent) {
  var target = document.querySelector(selector);

  if (!target) {
    onLoad(watch, selector, parent);
  }
  else {
    createMutationObserver(target, action);
  }
}

// actionOnLoad: uses arrive.js to watch for arrival of DOM element
// at selector, and calls action() when it arrives.
// To fix: Should check for existence of element, and call action() if it
// already exists
function onLoad(action, selector, parent) {
  if (parent) {
    document.querySelector(parent).arrive(selector, function() {
      action();
    });
  }
  else {
    document.arrive(selector, function() {
      action();
    });
  }
}

// sets a mutation observer on an element.
// if element doesn't exist, waits for it to be loaded with
// watch.onLoad.
module.exports = {
  onChange: onChange,
  onLoad: onLoad
};
