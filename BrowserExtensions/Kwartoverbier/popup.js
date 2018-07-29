(function() {
    var frame = document.getElementById('kobFrame'),
        url = window.location.search;

    url = url.substring((url.indexOf('=') + 1), url.length);

    frame.src = url;
})()
