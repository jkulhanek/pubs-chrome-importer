function importToPubs(url, tags, cb) {
  connector.addPublication(url, tags, cb);
}

connectedTabs = [];
function connectTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.onMessage.addListener(function (message) {
      console.log(message);
      importToPubs(message.url, message.tags, (e) => {
        port.postMessage({ type: '_PUBS_RESPONSE', error: e });
      });
    });
  });
}

function importToPubsVisual(useTags, tab) {
  if(!tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      importToPubsVisual(useTags, tab);
    });
    return;
  }

  if(!useTags) {
    return
  }

  chrome.tabs.executeScript(tab.id, { file: 'showDialog.js' }, () => connectTab()); 
}

chrome.contextMenus.create({"contexts":["page_action"], "title": "Import with tags", "onclick": function () {
    importToPubsVisual(true);
}});

chrome.contextMenus.create({"contexts":["page_action"], "title": "Import", "onclick": function () {
    importToPubsVisual(false);
}});

chrome.pageAction.onClicked.addListener(function(tab) {
    importToPubsVisual(true, tab);
});


chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'arxiv.org/' },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});
