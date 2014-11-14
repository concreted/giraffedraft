console.log('listeners.js===============================');
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
  console.log("=======================message received!======================");
  console.log(event.data);
}

console.log(window);

window.postMessage({}, '*');
