var popoverEl = document.getElementById('popover'),
    windowEl = document.getElementById('newwindow'),
    styleNewEl = document.getElementById('new'),
    styleOldEl = document.getElementById('old'),
    saveBtn = document.getElementById('save');

function save() {
  var popup = 'false',
    style = 'new';
    if (popoverEl.checked){
        popup = 'true';
    }
    if(styleOldEl.checked){
        style = 'old'
    }

    chrome.storage.sync.set({
        popup: popup,
        style: style,
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
    chrome.storage.sync.get(['popup'], function(data){
      if(JSON.parse(data.popup)){
         popoverEl.checked = true;
         windowEl.removeAttribute('checked');
     } else {
         windowEl.checked = true;
         popoverEl.removeAttribute('checked');
     }
    });

    chrome.storage.sync.get(['style'], function(data){
        console.log(data)
      if(data.style == 'old'){
         styleOldEl.checked = true;
         // windowEl.removeAttribute('checked');
     } else {
         styleNewEl.checked = true;
         // styleOldEl.removeAttribute('checked');
     }
    });
}


load();
saveBtn.addEventListener('click', save);
