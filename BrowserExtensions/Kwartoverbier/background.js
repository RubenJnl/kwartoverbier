(function() {
  'use strict';
  var url = {
      "old" : 'https://kwartoverbier.nl',
      "new" : 'https://new.kwartoverbier.nl'
  },

  openPage = function() {

      chrome.storage.sync.get(['obj'], function(data) {
          var popupUrl = url.old;

          if (typeof data.obj != 'undefined' && typeof data.obj.style != 'undefined'){
              popupUrl = url[data.obj.style]
          }
          chrome.tabs.create({url: popupUrl});
      });

  },

  checkOptions = function() {
      chrome.storage.sync.get(['obj'], function(data) {

        if (typeof data.obj != 'undefined' && typeof data.obj.popup != 'undefined' ){

          if (JSON.parse(data.obj.popup)) {

            var popupUrl = 'popup.html?url=' + url.old

            if (typeof data.obj.style != 'undefined'){

                popupUrl = 'popup.html?url=' + url[data.obj.style]
            }

            chrome.browserAction.setPopup({popup: popupUrl});
          } else {
            openPage();
          }
        } else {
          openPage();
        }
      });
  };

  chrome.browserAction.onClicked.addListener(function(tab) {
      checkOptions();
  });

})();
