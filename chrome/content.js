console.log('content.js');

var toggler = '<li id="gd-toggle"><a href="#">Giraffe Draft</a></li>';

var sidebar = '<div class="gd-sidebar from-left">asdf</div>';

// Add styles
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('styles.css');
(document.head||document.documentElement).appendChild(style);

console.log($('#yucs-top-list'));
$('#yucs-top-list').prepend(toggler);

$('body').prepend(sidebar);

$('#gd-toggle').click(function() {
  //alert('hello!');
  console.log($('.gd-sidebar'));
  $('.gd-sidebar').toggleClass('is-visible');
  console.log($('.gd-sidebar.is-visible'));
});
