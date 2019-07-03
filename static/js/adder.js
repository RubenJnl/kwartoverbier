
adder = {
    options: {

    },
    init: function(){
        this.showAdders();
    },

    showAdders: function(){
      var dimensions = this.getScreenSize();
      console.log(dimensions);
    },

    getScreenSize: function(){
        var obj = {};

        obj.height = window.innerHeight ? window.innerHeight : window.screen.height;
        obj.width = window.innerWidth ? window.innerWidth : window.screen.width;

        return obj
    },

}


document.addEventListener("DOMContentLoaded", function(event) {
  adder.init();
});
