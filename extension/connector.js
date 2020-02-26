var connector = (function () {
  var port = null;
  var hostName = "com.google.chrome.pubs.downloader";
  var waitingCallbacks = {};
  var messageCounter = 1;

  function checkError() {
    var error = chrome.runtime.lastError.message;
    if(error) {
      for(var key in waitingCallbacks) {
        cb = waitingCallbacks[key];
        cb({error: error});
      }
      waitingCallbacks = {};
    }
  }
  
  function sendMessage(message, cb) {
    waitingCallbacks[messageCounter] = cb;
    message.id = messageCounter;
    messageCounter += 1;
    if(!port) {
      port = chrome.runtime.connectNative(hostName);
      port.onMessage.addListener(function (message) {
        checkError();
        var callback = waitingCallbacks[message.id];
        if(callback) {
          callback(message);
          delete waitingCallbacks[message.id];
        }
      });

      port.onDisconnect.addListener(function () {
        checkError();
        port = null;
      });
    }

    
    port.postMessage(message);
  }

  function parseRequest(url, tags) {
    url = new URL(url);
    request = null;
    if(url.hostname == 'arxiv.org') {
      if(url.pathname.startsWith('/abs/')) {
        request = {
          arxiv_id: url.pathname.substr(5)
        };
      } else if(url.pathname.startsWith('/pdf/')) {
        request = {
          arxiv_id: url.pathname.substring(5, url.pathname.length - 4),
        };
      }

      if(request) {
        request.pdf = 'https://arxiv.org/pdf/' + request.arxiv_id + '.pdf';
      }
    }
    if(request)
      request.tags = tags;
    return request;
  }
  function addPublication(url, tags, cb) {
    try {
      var request = parseRequest(url, tags);
      if(!request) {
        cb("Publication not found");
      }

      console.log(request);
      sendMessage(request, (obj) => {
        if(obj.error) {
          if(obj.detailed) {
            console.log(obj.detailed);
          }
          cb(obj.error);
        } else {
          cb();
        }
      });
    } catch(e) {
      console.log(e);
      cb("Unknown error");
    }
  }

  return { addPublication };
})();
