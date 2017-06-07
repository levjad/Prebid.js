import { loadScript } from 'src/adloader';
import * as utils from 'src/utils';

export function Renderer(options) {
  const { url, config, id, callback, loaded } = options;
  this.url = url;
  this.config = config;
  this.callback = callback;
  this.handlers = {};
  this.id = id;
  this.loaded = loaded;
  this.cmd = [];

  // we expect to load a renderer url once only so cache the request to load script
  loadScript(url, callback, true);
}

Renderer.install = function({ url, config, id, callback, loaded }) {
  return new Renderer({ url, config, id, callback, loaded });
};

Renderer.prototype.getConfig = function() {
  return this.config;
};

Renderer.prototype.setRender = function(fn) {
  this.render = fn;
};

Renderer.prototype.setEventHandlers = function(handlers) {
  this.handlers = handlers;
};

Renderer.prototype.handleVideoEvent = function({ id, eventName }) {
  if (typeof this.handlers[eventName] === 'function') {
    this.handlers[eventName]();
  }

  utils.logMessage(`Prebid Renderer event for id ${id} type ${eventName}`);
};

Renderer.prototype.process = function() {
  this.cmd.forEach(command => {
    if (typeof command.called === 'undefined') {
      try {
        command.call();
        command.called = true;
      } catch (error) {
        utils.logError(error);
      }
    }
  });
};
