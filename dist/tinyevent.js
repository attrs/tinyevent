/*!
* tinyevent
* https://github.com/attrs/tinyevent
*
* Copyright attrs and others
* Released under the MIT license
* https://github.com/attrs/tinyevent/blob/master/LICENSE
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("tinyevent", [], factory);
	else if(typeof exports === 'object')
		exports["tinyevent"] = factory();
	else
		root["tinyevent"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	if( !Array.prototype.every ) {
	  Array.prototype.every = function(callbackfn, thisArg) {
	    var T, k;
	    
	    if (this == null) {
	      throw new TypeError('this is null or not defined');
	    }
	    
	    var O = Object(this);
	    var len = O.length >>> 0;
	    if (typeof callbackfn !== 'function') {
	      throw new TypeError();
	    }
	    if (arguments.length > 1) {
	      T = thisArg;
	    }
	    k = 0;
	    while (k < len) {
	      var kValue;
	      if (k in O) {
	        kValue = O[k];
	        var testResult = callbackfn.call(T, kValue, k, O);
	        if (!testResult) {
	          return false;
	        }
	      }
	      k++;
	    }
	    return true;
	  };
	}
	
	if( !Array.isArray ) {
	  Array.isArray = function(arg) {
	    return Object.prototype.toString.call(arg) === '[object Array]';
	  };
	}
	
	function EventObject(type, detail, target, cancelable) {
	  this.type = type;
	  this.detail = detail || {};
	  this.target = this.currentTarget = target;
	  this.cancelable = cancelable === true ? true : false;
	  this.defaultPrevented = false;
	  this.stopped = false;
	  this.timeStamp = new Date().getTime();
	}
	
	EventObject.prototype = {
	  preventDefault: function() {
	    if( this.cancelable ) this.defaultPrevented = true;
	  },
	  stopPropagation: function() {
	    this.stopped = true;
	  },
	  stopImmediatePropagation: function() {
	    this.stoppedImmediate = true;
	    this.stopped = true;
	  }
	};
	
	EventObject.createEvent = function(type, detail, target, cancelable) {
	  return new EventObject(type, detail, target, cancelable);
	};
	
	
	module.exports = function(scope) {
	  var listeners = {}, paused = false;
	  
	  var on = function(type, fn) {
	    if( !type || typeof type !== 'string' ) return console.error('type must be a string');
	    if( typeof fn !== 'function' ) return console.error('listener must be a function');
	    
	    var types = type.split(' ');
	    types.forEach(function(type) {
	      listeners[type] = listeners[type] || [];
	      listeners[type].push(fn);
	    });
	    
	    return this;
	  };
	  
	  var once = function(type, fn) {
	    if( !type || typeof type !== 'string' ) return console.error('type must be a string');
	    if( typeof fn !== 'function' ) return console.error('listener must be a function');
	    
	    var types = type.split(' ');
	    types.forEach(function(type) {
	      if( !type ) return;
	      
	      var wrap = function(e) {
	        off(type, wrap);
	        return fn.call(this, e);
	      };
	      on(type, wrap);
	    });
	    
	    return this;
	  };
	  
	  var off = function(type, fn) {
	    if( !type || typeof type !== 'string' ) return console.error('type must be a string');
	    if( typeof fn !== 'function' ) return console.error('listener must be a function');
	    
	    var types = type.split(' ');
	    types.forEach(function(type) {
	      var fns = listeners[type];
	      if( fns ) for(var i;~(i = fns.indexOf(fn));) fns.splice(i, 1);
	    });
	    
	    return this;
	  };
	  
	  var has = function(type) {
	    if( typeof type === 'function' ) {
	      var found = false;
	      listeners.forEach(function(fn) {
	        if( found ) return;
	        if( fn === type ) found = true;
	      });
	      return found;
	    }
	    return listeners[type] && listeners[type].length ? true : false;
	  };
	  
	  var fire = function(type, detail, direction, includeself) {
	    if( paused ) return;
	    
	    var typename = (type && type.type) || type;
	    
	    var event;
	    if( typeof type === 'string' ) {
	      event = EventObject.createEvent(type, detail, scope);
	    } else if( type instanceof EventObject ) {
	      event = type;
	    } else {
	      return console.error('illegal arguments, type is must be a string or event', type);
	    }
	    event.currentTarget = scope;
	    
	    var action = function(listener) {
	      if( event.stoppedImmediate ) return;
	      listener.call(scope, event);
	    };
	    
	    if( !direction || includeself !== false ) {
	      (listeners['*'] || []).slice().reverse().forEach(action);
	      (listeners[event.type] || []).slice().reverse().forEach(action);
	    }
	    
	    if( direction && !event.stopped ) {
	      if( direction === 'up' ) {
	        upstream.every(function(target) {
	          target.fire && target.fire(event, null, direction);
	          return !event.stopped;
	        });
	      } else if( direction === 'down' ) {
	        downstream.every(function(target) {
	          target.fire && target.fire(event, null, direction);
	          return !event.stopped;
	        });
	      } else if(Array.isArray(direction)) {
	        direction.every(function(target) {
	          //console.log('fire', event.type, target.id);
	          target.fire && target.fire(event);
	          return !event.stopped;
	        });
	      } else {
	        console.warn('invalid type of direction', direction);
	      }
	    }
	    
	    return !event.defaultPrevented;
	  };
	  
	  var destroy = function() {
	    listeners = null;
	    return this;
	  };
	  
	  var pause = function() {
	    paused = true;
	    return this;
	  };
	  
	  var resume = function() {
	    paused = false;
	    return this;
	  };
	  
	  var upstream = [];
	  var downstream = [];
	  
	  var connect = function(target, direction) {
	    if( !target ) return console.warn('illegal argument: target cannot be null', target);
	    if( typeof target.fire !== 'function' ) return console.warn('illegal argument: target must have fire method', target);
	    
	    if( direction === 'up' && ~upstream.indexOf(target) ) return;
	    else if( direction === 'down' && ~downstream.indexOf(target) ) return;
	    else if( direction === 'up' ) upstream.push(target);
	    else if( direction === 'down' ) downstream.push(target);
	    else return console.warn('illegal argument: direction must be "up" or "down" but ', direction);
	    
	    return this;
	  };
	  
	  var disconnect = function(target, direction) {
	    if( !target ) return this;
	    
	    if( (!direction || direction === 'up') && ~upstream.indexOf(target) ) upstream.splice(upstream.indexOf(fn), 1);
	    if( (!direction || direction === 'down') && ~downstream.indexOf(target) ) downstream.splice(downstream.indexOf(fn), 1);
	    
	    return this;
	  };
	  
	  return {
	    on: on,
	    once: once,
	    off: off,
	    fire: fire,
	    has: has,
	    destroy: destroy,
	    pause: pause,
	    resume: resume,
	    connect: connect,
	    disconnect: disconnect
	  };
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tinyevent.js.map