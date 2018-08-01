(function() {
  'use strict';
  var url = {
      "old" : 'https://kwartoverbier.nl/#plugin',
      "new" : 'https://new.kwartoverbier.nl/'
  },
  notification = true,
  notificationSend = false,
  NotificationOptions = {
      type: 'basic',
      iconUrl: '/images/notification_icon.png',
      title: 'Het is #Kwartoverbier! 🍻',
      message: 'Cheers!',
      eventTime: Date.now(),

  },

  checkNotification = function() {

    if (notificationSend == false){
        var dNow = new Date(),
        iHour = dNow.getHours(),
        iMinute = dNow.getMinutes();

        if (iHour == 16 && iMinute == 16 ) {
            showNotification();
            notificationSend = true;
      	} if (iHour == 16 && iMinute > 14 && iMinute < 15){
            setTimeout(function(){
                checkNotification();
            }, 100);
        } else {
            setTimeout(function(){
                checkNotification();
            }, 20000);
        }
    }



  },

  showNotification = function(){
      chrome.notifications.create('1615alert', NotificationOptions, function(){
          setTimeout(function(){
              clearNotification();
          }, 60000);
      });
      chrome.notifications.onClicked.addListener(function(id) {
          openPage();
          clearNotification();
      })
  },

  clearNotification = function(){

    chrome.notifications.clear('1615alert', function(){
        notificationSend = false;
    });

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

  checkOptionsClick = function() {

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
  },
  checkOptions = function(){

      chrome.storage.sync.get(['obj'], function(data) {
          if (typeof data.obj != 'undefined' && typeof data.obj.notification != 'undefined'){
              notification = data.obj.notification;
          }
      });
  };

  chrome.browserAction.onClicked.addListener(function(tab) {
      checkOptionsClick()
  });

  checkOptions();

  if (notification){
    checkNotification()
  }


})();
