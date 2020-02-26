//<div style="position:absolute;width:100%;height: 100%;top:0px;left:0px;z-index:90000;background: #ffffffbb;">
var dialogCode = `<dialog id="_pubsDialog" style="
  width: 300px;
  height: 184px;
  background:#fff;
  border: 1px solid #898989;
  top: 50%;
  left: 50%;
  position:absolute;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
  ">
    <div style="margin-top: 20px; font-size: large; font-weight:normal;">Import to pubs</div>
<div style="
    margin: 10px 8px 0px 8px;
    text-align: left;
    font-size: small;
    font-weight: normal;
">List of comma separated tags: </div>
<div style="margin: 0 8px 10px 8px;"><textarea id="_pubsTags" style="
    width: 100%;
    box-sizing: border-box;
    height: 72px;
"></textarea> <button id="_confirmBtn" style="
    margin-top: 8px;
    float: right;
    height: 30px;
    display: block;
    background: #3399ff;
    border: none;
    color: white;
    border-radius: 8px;
    width: 120px;">Import</button>
<button id="_cancelBtn" style="
    margin-top: 8px;
    float: left;
    height: 30px;
    display: block;
    background: #fff;
    border: 1px solid #3399ff;
    color: #3399ff;
    border-radius: 8px;
    width: 120px;">Cancel</button>
</div>
<div id="_pubsLoader" style="position:absolute; top:0px; left:0px; width:100%; height:100%; background:#fff">
  <div class="loader">Loading...</div>
</div>
</dialog>
<style>
#_pubsDialog .loader,
#_pubsDialog .loader:before,
#_pubsDialog .loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
}
#_pubsDialog .loader {
  color: #000;
  font-size: 10px;
  margin: 80px auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
#_pubsDialog .loader:before,
#_pubsDialog .loader:after {
  content: '';
  position: absolute;
  top: 0;
}
#_pubsDialog .loader:before {
  left: -3.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
#_pubsDialog .loader:after {
  left: 3.5em;
}
@-webkit-keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}`;
var dialog = document.querySelector("dialog#_pubsDialog");
if(!dialog) {
  document.body.innerHTML += dialogCode;
  dialog = document.querySelector("dialog#_pubsDialog");
  var tags = dialog.querySelector("#_pubsTags");
  dialog.querySelector("#_pubsLoader").style.display = "none";
  dialog.querySelector("#_cancelBtn").addEventListener("click", function() {
    dialog.close()
  });

  var connected = false;
  chrome.runtime.onConnect.addListener((port) => {
    if(connected)
      return;
    connected = true;
    port.onMessage.addListener((msg) => {
      console.log(msg);
      if (msg.type == "_PUBS_RESPONSE") {
        if(msg.error) {
          alert(msg.error);
        }
        dialog.close();
      }
    });

    dialog.querySelector("#_confirmBtn").addEventListener("click", function() {
      dialog.querySelector("#_pubsLoader").style.display = "block";
      port.postMessage({ type: "_PUBS_ADD_PUBLICATION", url: window.location.href, tags: tags.value });
    });
    // TODO: remove disabled clas
  });
}

dialog.showModal();

