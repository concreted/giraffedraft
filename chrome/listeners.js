console.log('listeners.js===============================');
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
  console.log("=======================message received in iframe!======================");
  console.log(event);
}

console.log(window);
//console.log(parent.postMessage);
// window.postMessage({}, '*');
// parent.postMessage({}, '*');
