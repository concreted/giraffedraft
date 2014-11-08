console.log('background.js');

// $(document).ready(function(){
//     alert("working");
// });

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
  console.log('updated');
});
