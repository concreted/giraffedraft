// inject.js

module.exports = {
  sidebar: sidebar,
  sidebarButton: sidebarButton
};

// Insert iFrame referencing popup.html
function sidebar(src, isInternalUrl) {
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
}

// Insert button to toggle showing the iFrame
function sidebarButton() {
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
