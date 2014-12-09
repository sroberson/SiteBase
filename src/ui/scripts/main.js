//Safe Console Polyfill
window.log = function () {
    'use strict';
    log.history = log.history || [];
    log.history.push(arguments);
    if (window.console) {
        console.log(Array.prototype.slice.call(arguments));
    }
};

window.debounce = function (func, wait, immediate) {
    'use strict';
    var timeout;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) {func.apply(context, args);}
        }, wait);
        if (immediate && !timeout) {func.apply(context, args);}
    };
};

if (typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function indexOf(searchElement, fromIndex) {
        'use strict';
        var length = this.length;
        // Don't search if there isn't a length
        if (!length) {
            return -1;
        }

        // Convert and transfer the number to 0
        fromIndex = Number(fromIndex);
        if (typeof fromIndex !== 'number' || isNaN(fromIndex)) {
            fromIndex = 0;
        }

        // If the search index goes beyond the length, fail
        if (fromIndex >= length) {
            return -1;
        }

        // If the index is negative, search that many indices from the length
        if (fromIndex < 0) {
            fromIndex = length - Math.abs(fromIndex);
        }

        // Search for the index
        var i;
        for (i = fromIndex; i < length; i++) {
            if (this[i] === searchElement) {
                return i;
            }
        }
        // Fail if no index
        return -1;
    };
}

require.config({
    "paths": {
        "jquery":        "../vendor/jquery-legacy/dist/jquery.min",
        "twitter_bs":    "../vendor/bootstrap/dist/js/bootstrap.min",
        "swipe":         "libs/jquery.touchSwipe.min",

        //modules
        "mod_moduleName":         "modules/mod_moduleName"
    },
    "shim": {
        "twitter_bs":    ["jquery"]
    }
});

// app, modules :: each auto-executes
require(["app", "mod_moduleName"]);

