var port = null;
var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}
var hostName = "com.google.chrome.pubs.downloader";
function appendMessage(text) {
  console.log(text);
}
function sendNativeMessage(message) {
  port.postMessage(message);
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}
function onNativeMessage(message) {
  appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}
function onDisconnected() {
  appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
  //updateUiState();
}
function connect() {
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  //updateUiState();
}
function sendSync(message, onSuccess, onFailure) {
  port = chrome.runtime.connectNative(hostName);
  var wasReceived = false;
  port.onMessage.addListener(function (message) {
    if(message.status === 'success') {
      wasReceived = true;
      onSuccess(message);
    } 
    else {
      wasReceived = true;
      onFailure(message);
    }
  });
  port.onDisconnect.addListener(function () {
    if(!wasReceived) {
      onFailure({
        status: 'failed',
        message: 'failed to connect',
        detailed: chrome.runtime.lastError.message
      });
    }
  });
  port.postMessage(message);
}

document.addEventListener('DOMContentLoaded', function() {
  let form = document.getElementById('form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let tags = e.target.children.tags.value.split(' ');
    tags = tags.filter(function (e) {
      return e !== null && e !== '';
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let tab = tabs[0];
      let url = tab.url;
      let arxivCode = url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
      sendSync({ url: url, tags: tags }, function () {
        window.close();
      }, function (message) {
        alert(JSON.stringify(message));
        window.close();
      });
    });
  });
}, false);
