var popoverEl = document.getElementById('popover'),
    windowEl = document.getElementById('newwindow'),
    // styleNewEl = document.getElementById('new'),
    // styleOldEl = document.getElementById('old'),
    saveBtn = document.getElementById('save'),
    alertFalseEl = document.getElementById('noAlert'),
    alertTrueEl = document.getElementById('alert');

function save() {
  var popup = 'false',
    style = 'new',
    notification = 'false';
    if (popoverEl.checked){
        popup = 'true';
    }
    // if(styleOldEl.checked){
    //     style = 'old'
    // }
    if (alertTrueEl){
      notification = 'true';
    }
    chrome.storage.sync.clear();

    chrome.storage.sync.set({
        obj: {
            popup: popup,
            style: style,
            notification: notification
        }
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Voorkeur opgeslagen!';
        setTimeout(function() {
          status.textContent = '';
    }, 5000);

  });
}

function load(){
    chrome.storage.sync.get(['obj'], function(data){

      if(typeof data.obj != 'undefined' && typeof data.obj.popup != 'undefined' && JSON.parse(data.obj.popup)){
         popoverEl.checked = true;
         windowEl.removeAttribute('checked');
     } else {
         windowEl.checked = true;
         popoverEl.removeAttribute('checked');
     }
     // if(typeof data.obj != 'undefined' && typeof data.obj.style != 'undefined' && data.obj.style == 'old'){
         // styleOldEl.checked = true;
         // windowEl.removeAttribute('checked');
     // } else {
     //     styleNewEl.checked = true;
     //     // styleOldEl.removeAttribute('checked');
     // }
     if(typeof data.obj != 'undefined' && typeof data.obj.notification != 'undefined' && data.obj.notification == 'true'){
         alertTrueEl.checked = true;
         alertFalseEl.removeAttribute('checked');
     } else {
         alertFalseEl.checked = true;
         alertTrueEl.removeAttribute('checked');
     }
    });
}


load();
saveBtn.addEventListener('click', save);
