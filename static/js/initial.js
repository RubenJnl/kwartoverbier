/*!
 loadCSS: load a CSS file asynchronously.
 [c]2014 @scottjehl, Filament Group, Inc.
 Licensed MIT
 */

/* exported loadCSS */
function loadCSS( href, before, media, callback ){
    // Arguments explained:
    // `href` is the URL for your CSS file.
    // `before` optionally defines the element we'll use as a reference for injecting our <link>
    // By default, `before` uses the first <script> element in the page.
    // However, since the order in which stylesheets are referenced matters, you might need a more specific location in your document.
    // If so, pass a different reference element to the `before` argument and it'll insert before that instead
    // note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
    var ss = window.document.createElement('link');
    var ref = before || window.document.getElementsByTagName('script')[ 0 ];
    var sheets = window.document.styleSheets;
    ss.rel = 'stylesheet';
    ss.href = href;
    // temporarily, set media to something non-matching to ensure it'll fetch without blocking render
    ss.media = 'only x';
    // DEPRECATED
    if( callback ) {
        ss.onload = callback;
    }

    // inject link
    ref.parentNode.insertBefore( ss, ref );
    // This function sets the link's media back to `all` so that the stylesheet applies once it loads
    // It is designed to poll until document.styleSheets includes the new sheet.
    ss.onloadcssdefined = function( cb ){
        var defined;
        for( var i = 0; i < sheets.length; i++ ){
            if( sheets[ i ].href && sheets[ i ].href === ss.href ){
                defined = true;
            }
        }
        if( defined ){
            cb();
        } else {
            setTimeout(function() {
                ss.onloadcssdefined( cb );
            });
        }
    };
    ss.onloadcssdefined(function() {
        ss.media = media || 'all';
    });
    return ss;
}

var config = {

    // config for conditioner, ideally should be inline to avoid extra request
    conditioner: {
        'modules': {
            './components/Component/Component': {
                'options': {
                    'key': 'value'
                }
            }
        }
    },

    // location of asynchronously loaded fonts
    fonts: {
        ttf: '/static/css/ttf.css',
        woff: '/static/css/woff.css',
        woff2: '/static/css/woff2.css'
    }

};

(function(window, undefined){

    'use strict';

    var d = window.document;

    // cutting da mustardz
    if (!('querySelector' in d && 'addEventListener' in window)) {
        return;
    }

    // load font (woff)
    var ua = navigator.userAgent,
        fontFileUrl = config.fonts.woff;

    //console.log(ua);
    //
    //console.log(ua.indexOf('Chrome'), ua.indexOf('Mozilla') , ua.indexOf('like Gecko'))

    if( ( ua.indexOf('Chrome') != -1 && ua.indexOf('Mozilla') != -1 ) && ua.indexOf('like Gecko') != -1 && ua.indexOf('Safari') != -1 || ua.indexOf('Firefox') != -1 ){
        //console.log('woff2')
        fontFileUrl = config.fonts.woff2;
    }

    if( ua.indexOf('Android') > -1 && ua.indexOf('like Gecko') > -1 && ua.indexOf('Chrome') === -1 ){
        //console.log('ttf')
        fontFileUrl = config.fonts.ttf;
    }

    loadCSS(fontFileUrl);


}(this));