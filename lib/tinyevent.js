function EventObject(type, detail, target, cancelable) {
  this.type = type;
  this.detail = detail || {};
  this.target = this.currentTarget = target;
  this.cancelable = cancelable === true ? true : false;
  this.defaultPrevented = false;
  this.stopped = false;
  this.stoppedImmediate = false;
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
  
  var fire = function(type, detail, cancellable) {
    if( paused ) return false;
    
    var event;
    if( typeof type === 'string' ) {
      event = EventObject.createEvent(type, detail, scope, cancellable);
    } else if( type instanceof window.Event ) {
      event = type;
    } else if( type.type && typeof type.preventDefault == 'function' ) {
      event = type;
    } else {
      return console.error('type must be a string or Event but,', type);
    }
    event.currentTarget = scope;
    
    var stopped = false;
    var action = function(listener) {
      if( stopped || event.stoppedImmediate ) return stopped = true;
      if( listener.call(scope, event) === false ) event.preventDefault();
    };
    
    (listeners['*'] || []).slice().reverse().forEach(action);
    (listeners[event.type] || []).slice().reverse().forEach(action);
    
    return !event.defaultPrevented;
  };
  
  return {
    handleEvent: function(e) {
      return fire(e);
    },
    scope: function(o) {
      if( !arguments.length ) return scope;
      scope = o;
    },
    on: on,
    once: once,
    off: off,
    fire: fire,
    has: has,
    destroy: function() {
      listeners = null;
      return this;
    },
    pause: function() {
      paused = true;
      return this;
    },
    resume: function() {
      paused = false;
      return this;
    }
  };
};