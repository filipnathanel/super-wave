/**
 * A shorthand function to get elements whether a single dom element is passed or a string is passed
 * @param  {string or DOMElement} el
 * @param  {DOMElement under which we will look for elements} context 
 * @return {DOMElement} A single element returned by our query
 */
export function getEl(el, context = document){

    if (typeof el === 'string'){
        if(el.indexOf('#') == 0 && el.indexOf(' ') <= 0 ){
            return document.getElementById(el.substr(1));
        }else{
            return context.querySelector(el);
        }
    } else if (typeof el === 'object'){
        if (el.length){
            console.log('passed el shouldn\'t be iterable');
            return;
        }
        return el;
    }
}

/**
 * A shorthand function to get elements whether a single dom element is passed or a string is passed
 * @param  {string} el
 * @param  {DOMElement under which we will look for elements} context 
 * @return {DOMElement} Iterable elements returned by our query
 */
export function getEls(el, context = document){

    if (typeof el === 'string'){
        if( el.indexOf('.') == 0 && el.indexOf(' ') <= 0 ){
            return context.getElementsByClassName(el.substr(1));
        }else{
            return context.querySelectorAll(el);
        }
    } 
}

/*
 * Get Viewport Dimensions
 * returns object with viewport dimensions to match css in width and height properties
 * ( source: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript )
 */
export function getViewportDimensions() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = g.clientWidth,
        y = e.clientHeight ;
    return {
        width: x,
        height: y
    }
}


/**
 * event throttling
 * @param  {Object} ) { var timers [description]
 * @return {void}   
 */
export function debounce (func, wait, immediate) {
     var timeout;
     return function() {
         var context = this, args = arguments;
         var later = function() {
                 timeout = null;
                 if (!immediate) func.apply(context, args);
         };
         var callNow = immediate && !timeout;
         clearTimeout(timeout);
         timeout = setTimeout(later, wait);
         if (callNow) func.apply(context, args);
     };
};

/**
 * Merge defaults with user options
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
export function extend( defaults, options ) {
    // ES6
    if (typeof Object.assign === 'function'){
        return Object.assign({},defaults,options);
    // ES5
    }else{
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    }
};

/**
 * implements foreach for given iterable object/array
 * @param  {iterable} arrayesque any iterable object
 * @return {[type]}            [description]
 */
export function forEach(arrayesque, funct){
    Array.prototype.forEach.call(arrayesque, function(a,b){
        funct(a,b);
    });
}

/**
 * inserts element after specified element
 * @param  {Node} newNode         the node we want added after referenceNode
 * @param  {Node} referenceNode   the node after which we add newNode
 * @return {Node}                 the new node (in different context?)
 */
export function insertAfter(newNode, referenceNode) {
   return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}



export function render(string){

    const wrap = document.createElement('div');
    wrap.innerHTML = string;
    return wrap.children[0];

}

export function random(min, max){
    return (Math.random() * (max - min)) + min;
}