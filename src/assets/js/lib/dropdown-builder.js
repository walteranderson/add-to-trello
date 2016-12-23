var $ = require('jquery');
var storage = require('./storage');

var dropdownBuilder = {
  /**
   * loadBoardsAndLists
   * pulls data from localStorage and inserts the board and list dropdowns
   *
   */
  loadBoardsAndLists: function(callback) {
    var orgs     = storage.getOrgs();
    var defaults = storage.getDefaults();
    var self = dropdownBuilder;

    // if we don't have any data in localStorage, wait for the http request
    if (!orgs) return;

    // set the defaults to first board and first list if none present
    if (!defaults) {
      defaults = storage.resetDefaults();
    }

    $('.js-boards').html('');
    $('.js-lists').html('');

    $.each(orgs, function(key, org) {
      $('.js-boards').append(
        self.createOptionGroup(org, defaults)
      );
    });

    if (callback) callback();
  },

  /**
   * changeList
   * updates the list dropdown based on the selected board
   *
   */
  changeList: function(e) {
    var id   = $(e.target).val();
    var orgs = storage.getOrgs();
    var lists = {};
    var self = dropdownBuilder;

    // search through the organzations and find the board that was selected
    $.each(orgs, function(key, org) {
      var board = $.grep(org.boards, function(e){
        return e.id === id;
      })[0];

      if (board) {
        lists = board.lists;
      }
    });


    // clear the lists dropdown
    $('.js-lists').html('');

    $.each(lists, function(key, list) {
      var listSelected = false;
      if (key == 0) listSelected = true;

      // append the list
      $('.js-lists').append(
        self.createOption(list, listSelected)
      );
    });
  },

  /**
   * creates an optgroup for the boards dropdown
   */
  createOptionGroup: function(org, defaults) {
    var optGroup = $('<optgroup>', { label: org.name });
    var self = dropdownBuilder;

    // loop through each board
    $.each(org.boards, function(key, board) {
      var boardSelected = false;
      if (defaults.board_id == board.id) boardSelected = true;

      // create the board option
      var option = self.createOption(board, boardSelected);

      // append the board to it's option group
      optGroup.append(option);

      if (boardSelected) {
        // loop through this board's lists
        $.each(board.lists, function(key, list) {
          var listSelected = false;
          if (defaults.list_id == list.id) listSelected = true;

          // append the list
          $('.js-lists').append(
            self.createOption(list, listSelected)
          );
        });
      }
    });

    return optGroup;
  },

  /**
   * createOption
   * creates generic html <option> tag based on the parameters
   *
   */
  createOption: function(data, isSelected) {
    var option = $('<option>', { value: data.id })
        .text(data.name);

    if (isSelected) {
      option.attr('selected', 'selected');
    }

    return option;
  }
};

module.exports = dropdownBuilder;
