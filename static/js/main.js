var req = new XMLHttpRequest();

req.addEventListener("progress", updateProgress);
req.addEventListener("load", transferComplete);
req.addEventListener("error", transferFailed);
req.addEventListener("abort", transferCanceled);


// progress on transfers from the server to the client (downloads)
function updateProgress (oEvent) {
  // if (oEvent.lengthComputable) {
  //   var percentComplete = oEvent.loaded / oEvent.total * 100;
  //   console.log(percentComplete);
  // } else {
  //   // Unable to compute progress information since the total size is unknown
  // }
}

function transferComplete(evt) {
  // console.log("The transfer is complete.");
  // console.log(evt.target.response);
  kwartoverbier.handleResponseData(evt.target.response);
}

function transferFailed(evt) {
  console.log("An error occurred while transferring the file.");
}

function transferCanceled(evt) {
  console.log("The transfer has been canceled by the user.");
}
var api = 'qH86QPaygCDGtGgOwtwqgmousRawrRpV',
kwartoverbier = {
    options: {
        tagsUrl : '/beer/tags.json',
		url: 'https://api.giphy.com/v1/gifs/random?api_key='+api+'&rating=G'
    },
    init: function(){
        this.getTag();
        this.setYesNo();
    },
    setYesNo: function() {
        var dateTime = this.getDateTime();
        if (dateTime.beertime){
            document.querySelector('.no').setAttribute('style', 'display:none;');
            document.querySelector('.yes').setAttribute('style', 'display:block;');
        } else {
            document.querySelector('.yes').setAttribute('style', 'display:none;');
            document.querySelector('.no').setAttribute('style', 'display:block;');
        }
    },
    getGif: function(){
            // console.log(this.tag);
            req.open('GET', this.options.url);
            req.send();
    },
    getTag: function(){
        var context = this;
        var tagReq = new XMLHttpRequest();

        tagReq.open('GET', this.options.tagsUrl);
        tagReq.send();
        tagReq.addEventListener("progress", updateProgress);
        tagReq.addEventListener("load", function (e) {
          if (e.target.readyState === 4) {
            if (e.target.status === 200) {
              var obj = JSON.parse(e.target.responseText);
              context.tag = context.getTagsByDate(obj.tags);
            }
          }
        });
        tagReq.addEventListener("error", transferFailed);
        tagReq.addEventListener("abort", transferCanceled);
    },
    getTagsByDate: function(obj){
        var dateTime = this.getDateTime(),
            tags = [],
            tag;
            // console.log(dateTime.day);
        if(dateTime.day == 1 && dateTime.beertime == false){
            // monday
            tags = obj.monday;
        } if (dateTime.beertime) {
            tags = obj.beer;
        } else {
            tags = obj.work;
        }

        this.tag = this.getRandomTag(tags);
        this.getGif();

    },
    getRandomTag: function(tags) {
        // console.log('get random tag', tags);
        // console.log(tags.length);
        var rand = Math.floor(Math.random() * tags.length);
        // console.log(rand)
        // console.log(tags[rand]);
        return tags[rand];
    },
    getDateTime: function(){
        var dateTimeStamp = new Date();
        var obj = {};
        obj.day = dateTimeStamp.getDay();

        if (dateTimeStamp.getHours() >= 16 && dateTimeStamp.getMinutes() >= 15){
            obj.beertime = true
        }
        return obj
    },
    handleResponseData: function(resp){

        var obj = JSON.parse(resp);
        if (obj.data && obj.data.type === 'gif'){
            // console.log('gif')
            req.open('GET', obj.data.image_original_url);
            document.documentElement.style.setProperty('--backgroundGif', 'url("' + obj.data.image_original_url + '")');
        }

    }
}


document.addEventListener("DOMContentLoaded", function(event) {
  kwartoverbier.init();
});
