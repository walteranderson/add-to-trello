var $ = require('jquery');
var TrelloApi = require('./lib/trello-api');
var dropdownBuilder = require('./lib/dropdown-builder');
var storage = require('./lib/storage');

var serialize = function serialize(form) {
  var formData = form.serializeArray();
  var formObj  = {};

  $.each(formData, function (index, value) {
    if (value.value !== '') formObj[value.name] = value.value;
  });

  return formObj;
}

var Popup = {
  /**
   * Initialize the module.
   * Confirm we're authorized with Trello, redirect to settings if not.
   */
  init: function() {
    if (!TrelloApi.isAuthorized()) {
      return this.openSettings();
    }

    this.initForms();

    dropdownBuilder.loadBoardsAndLists();
    TrelloApi.getOrgsAndBoards(dropdownBuilder.loadBoardsAndLists);


    $('.js-open-settings').click(this.openSettings);
    $('.js-open-trello').click(this.openTrello);
    $('.js-logout').click(TrelloApi.deauthorize);
    $('.js-boards').change(dropdownBuilder.changeList);
    $('.add-card-form').submit(this.submitCard);
  },

  submitCard: function(e) {
    e.preventDefault();

    var settings = storage.getSettings();
    var form = $(".add-card-form");
    var data = serialize(form);

    if (settings.boardList != 'choose') {
      // set the default dropdowns to what was selected
      storage.setDefaults(data['board'], data['list']);
    }

    TrelloApi.submitCard(data);
  },

  initForms: function() {
    var self = Popup;
    var settings = storage.getSettings();
    var title = $('.js-card-title');
    var description = $('.js-card-description');
    var board = $('.js-lists option[value="'+ settings.list +'"]');
    var list = $('.js-boards option[value="'+ settings.board +'"]');

    if (settings.boardList == 'choose') {
        board.prop('selected', true);
        list.prop('selected', true);
    }

    // use as-defined if set
    if (settings.title == 'defined') {
      title.val(settings.titleValue);
    }

    if (settings.description == 'defined') {
      description.val(settings.descriptionValue);
    }

    // get the current tab info and insert into the form, if necessary
    if (settings.title == 'page' || settings.description == 'url') {
      self.getCurrentTab(function(tab) {
        if (settings.title == 'page') {
          title.val(tab.title);
        }

        if (settings.description == 'url') {
          description.text(tab.url);
        }
      });
    }
  },

  openSettings: function() {
    chrome.tabs.create({
      url: chrome.extension.getURL('settings.html')
    });
  },

  openTrello: function() {
    chrome.tabs.create({ url: 'https://trello.com' });
  },

  getCurrentTab: function(callback) {
    var queryInfo = {
      active: true,
      currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
      // send the first tab through the callback
      callback(tabs[0]);
    });
  }
};

module.exports = Popup;
