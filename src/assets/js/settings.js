var $ = require('jquery');
var noty = require('noty');
var storage = require('./lib/storage');
var TrelloApi = require('./lib/trello-api');
var dropdownBuilder = require('./lib/dropdown-builder');

var serialize = function serialize(form) {
  var formData = form.serializeArray();
  var formObj  = {};

  $.each(formData, function (index, value) {
    if (value.value !== '') formObj[value.name] = value.value;
  });

  return formObj;
}

var Settings = {
  init: function() {
    // authorize with trello
    TrelloApi.authorize(
      this.onAuthSuccess.bind(this),
      this.onAuthError.bind(this)
    );

    if ($('.js-board-list').val() == 'choose') {
        this.showBoardsAndLists();
    }

    $('.js-settings-form').submit(this.submitForm);
    $('.js-boards').change(dropdownBuilder.changeList);
    $('.js-board-list').change(this.changeBoardsAndLists);
    $('.js-defined-control').change(this.toggleAsDefinedInput);
  },

  onAuthSuccess: function() {
    $('#auth').addClass('hidden');
    $('#success').removeClass('hidden');
    $('#settings-form').removeClass('hidden');
    this.initSettings();
  },

  onAuthError: function() {
    $('#auth').addClass('hidden');
    $('#error').removeClass('hidden');
    $('#settings-form').addClass('hidden');
  },

  submitForm: function(e) {
      e.preventDefault();

      var form = serialize($(e.target));
      var data = {
        title: form.title,
        description: form.description,
        boardList: form.boardList,
        titleValue: '',
        descriptionValue: ''
      };

      // add defined title value if necessary
      if (form.title == 'defined') {
        data.titleValue = form.titleValue;
      }

      // add defined description value if necessary
      if (form.description == 'defined') {
        data.descriptionValue = form.descriptionValue;
      }

      // save main settings data
      storage.setSettings(data);

      // save board/list overrides
      if (form.boardList == 'choose') {
        storage.setDefaults(form.board, form.list);
      }

      // notify the user
      noty({
        text: 'Save successful!',
        layout: 'topLeft',
        theme: 'bootstrapTheme',
        type: 'success',
        timeout: 2000
      });
  },

  initSettings: function() {
    var settings = storage.getSettings();
    var form = $('.js-settings-form');

    $.each(settings, function(key, value) {
      var option = form.find('[name="'+ key +'"]');

      // set the option's value
      option.val(value);

      // unhide the as-defined inputs
      if (value == 'defined') {
        option.siblings('input').removeClass('hidden');
      }
    });
  },

  showBoardsAndLists: function() {
    $('.board-dropdown').removeClass('hidden');
    $('.list-dropdown').removeClass('hidden');

    // load from storage immediately if we have it
    dropdownBuilder.loadBoardsAndLists();

    // call the API to update our local storage
    TrelloApi.getOrgsAndBoards(dropdownBuilder.loadBoardsAndLists);
  },

  hideBoardsAndLists: function() {
    $('.board-dropdown').addClass('hidden');
    $('.list-dropdown').addClass('hidden');
  },

  changeBoardsAndLists: function(e) {
    var selected = $(e.target).val();
    var self = Settings;

    if (selected == 'choose') {
      self.showBoardsAndLists();
    } else {
      self.hideBoardsAndLists();
    }
  },

  toggleAsDefinedInput: function(e) {
    var input  = $(e.target).siblings('input');
    var option = $(e.target).val();

    if (option == 'defined') {
      input.removeClass('hidden');
    } else {
      input.addClass('hidden');
    }
  }
};

module.exports = Settings;
