var $ = require('jquery');
window.jQuery = $;

require('./lib/trello-client');

var Popup = require('./popup');
var Settings = require('./settings');

var page = $('body').attr('id');

/**
 * VERY simple routing to determine what page we're on.
 * Execute the corresponding javascript.
 *
 * @param {String} page
 */
(function loadPage(page) {
  switch(page) {
    case 'popup':
      return Popup.init();
    case 'settings':
      return Settings.init();
    default:
      throw new Error('Could not load javascript');
  }
})(page);
