(() => {
  'use strict';
  var url = {
    "old": 'https://kwartoverbier.nl/#plugin',
    "new": 'https://new.kwartoverbier.nl/'
  },
    hourMessage = 16,
    minuteMessage = 15,
    notification = true,
    notificationSend = false,
    notificationTime = new Date(),
    currentTimer = false,
    NotificationOptions = {
      type: 'basic',
      iconUrl: '/images/notification_icon.png',
      title: 'Het is #Kwartoverbier! 🍻',
      message: 'Cheers!',
      eventTime: Date.now()
    },

    toggleIdle = (state) => {
      // console.log('from idle', state);
      if (state == 'active'){
        checkNotification()
      } else if (currentTimer) {
        clearTimeout(currentTimer)
      }
    },

    checkNotification = () => {
      // console.log(currentTimer);
      if (currentTimer) {
        clearTimeout(currentTimer)
      }
      notificationTime.setHours(hourMessage)
      notificationTime.setMinutes(minuteMessage)
      notificationTime.setSeconds(0)
      var time = notificationTime
      var currentTime = new Date().getTime();
      // console.log(currentTime, time, time-currentTime);
      if (currentTime > time) {
        notificationTime.setDate(notificationTime.getDate() + 1)
        showNotification()
      } else {
        
      }
      var timeout = time-currentTime > 3600000 ? 60000 : time-currentTime
      currentTimer = setTimeout(checkNotification, timeout);
    },

    showNotification = () => {
      notificationSend = true
      chrome.notifications.create('1615alert', NotificationOptions, function () {
        setTimeout(function () {
          //   clearNotification();
          checkNotification()
          notificationSend = false;
        }, 60000);
      });
      chrome.notifications.onClicked.addListener(function (id) {
        openPage();
        clearNotification();
      });
    },

    // clearNotification = () => {

    //   chrome.notifications.clear('1615alert', function () {
    //     // notificationSend = false;
    //   });

    // },

    openPage = () => {

      chrome.storage.sync.get(['obj'], function (data) {
        var popupUrl = url.old;

        chrome.tabs.create({ url: popupUrl });
      });

    },

    checkOptionsClick = () => {

      chrome.storage.sync.get(['obj'], (data) =>  {

        if (typeof data.obj != 'undefined' && typeof data.obj.popup != 'undefined') {

          if (JSON.parse(data.obj.popup)) {

            var popupUrl = 'popup.html?url=' + url.old

            if (typeof data.obj.style != 'undefined') {

              popupUrl = 'popup.html?url=' + url[data.obj.style]
            }

            chrome.browserAction.setPopup({ popup: popupUrl });
          } else {
            openPage();
          }
        } else {
          openPage();
        }
      });
    },
    checkOptions = () => {

      chrome.storage.sync.get(['obj'], (data) => {
        if (typeof data.obj != 'undefined' && typeof data.obj.notification != 'undefined') {
          notification = data.obj.notification;
        }
      });
    };

  chrome.browserAction.onClicked.addListener((tab) => {
    checkOptionsClick()
  });

  checkOptions();

  if (notification) {
    checkNotification()
    chrome.idle.onStateChanged.addListener((state) => {
        toggleIdle(state)
      }
    )
  }


})();
