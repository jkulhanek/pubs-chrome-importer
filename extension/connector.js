var connector = (function () {
  var hostName = "com.google.chrome.pubs.downloader";

  function sendMessage(message, cb) {
    chrome.runtime.sendNativeMessage(
      hostName,
      message,
      function (message) {
        if(message === undefined) {
          message = {error: chrome.runtime.lastError.message }
        }
        cb(message)
      });
  }

  function parseRequest(url, tags, info) {
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
    else {
      if(info) {
        request = info;
      }
    }
    if(request)
      request.tags = tags;
    return request;
  }
  function addPublication(url, tags, info, cb) {
    try {
      var request = parseRequest(url, tags, info);
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
      console.error(e);
      cb("Unknown error");
    }
  }

  return { addPublication };
})();
