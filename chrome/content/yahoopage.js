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
