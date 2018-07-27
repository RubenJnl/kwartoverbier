(function() {
  'use strict';

  var openPage = function() {
      var optionsUrl = 'https://kwartoverbier.nl';
      chrome.tabs.create({url: optionsUrl});
  };

  chrome.browserAction.onClicked.addListener(function(tab) {
      openPage();
  });

})();
