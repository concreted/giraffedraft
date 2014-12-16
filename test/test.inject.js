var assert = require('chai').assert;
var jsdom = require('mocha-jsdom');
var sinon = require('sinon');
var HTMLElement = require('html-element');

describe('HTML injection', function() {
  var inject = require('../chrome/content/inject');

  jsdom();

  it('should have insertSidebar function', function() {
    assert.isFunction(inject.sidebar);
  });
  it('should have insertSidebarButton function', function() {
    assert.isFunction(inject.sidebarButton);
  });
  it('should insert an iframe on insertSidebar()', function() {
    assert.equal(document.querySelectorAll("iframe").length, 0);
    inject.sidebar();
    assert.equal(document.querySelectorAll("iframe").length, 1);
  });
  it('should insert a button on insertSidebarButton()', function() {
    assert.equal(document.querySelectorAll("button").length, 0);
    inject.sidebarButton();
    assert.equal(document.querySelectorAll("button").length, 1);
  });
});

describe('Watching the DOM', function() {
  var arrive = require('../chrome/lib/arrive-2.0.0.min.js');

  //var watch = require('../chrome/content/watch');

  jsdom();

  var cb = null;

  beforeEach(function() {
    cb = sinon.spy();
  });

  xit('should invoke callback when DOM element arrives', function() {
    assert.isFunction(watch.onLoad);
    assert.equal(document.querySelector('#test'), null);
  });
});
