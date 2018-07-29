(function() {
  'use strict';
  var url = {
      "old" : 'https://kwartoverbier.nl',
      "new" : 'https://new.kwartoverbier.nl'
  },

  openPage = function() {

      chrome.storage.sync.get(['popup'], function(data) {
          var popupUrl = url.new

          if (typeof data.style != 'undefined'){
              popupUrl = url[data.style]
          }
          chrome.tabs.create({url: popupUrl});
      });

  },

  checkOptions = function() {
      chrome.storage.sync.get(['style', 'popup'], function(data) {

          if (typeof data.popup != 'undefined' && JSON.parse(data.popup)) {
console.log(data, data.style)
              var popupUrl = 'popup.html?url=' + url.new

              if (typeof data.style != 'undefined'){

                  popupUrl = 'popup.html?url=' + url[data.style]
              }

              chrome.browserAction.setPopup({popup: popupUrl});
          } else {
              openPage();
          }
      });
  };

  chrome.browserAction.onClicked.addListener(function(tab) {
      checkOptions();
  });

})();
