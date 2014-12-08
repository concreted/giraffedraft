var assert = require('chai').assert;
var inject = require('../chrome/content/inject');
console.log(inject);

describe('HTML injection', function() {
  it('should have insertSidebar function', function() {
    assert.isFunction(inject.sidebar);
  });
  it('should have insertSidebarButton function', function() {
    assert.isFunction(inject.sidebarButton);
  });
});
