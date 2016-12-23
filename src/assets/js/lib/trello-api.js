var $ = require('jquery');
var storage = require('./storage');
var APP_KEY = '68fc29641c38d36e500e264a5c7e9ec0';

/**
 * API module for interacting with the Trello API
 */
var TrelloApi = (function() {
  'use strict';

  Trello.setKey(APP_KEY);
  Trello.setToken(localStorage.getItem('trello_token'));

  /**
   * apiError
   * handle errors from Trello API
   *
   */
  var _apiError = function(message) {
    console.log(message);
  };

  /**
   * get organizations and boards, then index them into an object we can
   * save into localStorage
   */
  var getOrgsAndBoards = function(callback) {
    var orgList = {
      me: { name: 'Boards', boards: [] }
    };

    getOrgs(function(orgs) {
      $.each(orgs, function(key, org) {
        orgList[org.id] = {
          name: org.displayName,
          boards: []
        };
      });

      getBoards(function(boards) {
        $.each(boards, function(key, board) {
          // add board to either it's organization or the 'me' catchall
          var organization = orgList[board.idOrganization || 'me'];

          // make sure the organization we're trying to add
          // the board to exists
          if (organization !== undefined) {
            organization.boards.push(board);
          } else {
            // if the organization the board belongs to
            // wasn't added above for whatever reason,
            // add the board to the 'me' catchall
            orgList['me'].boards.push(board);
          }
        });

        storage.setOrgs(orgList);
        callback();
      });
    });
  };

  /**
   * getBoards
   * call Trello API to get the user's boards and associated lists
   *
   */
  var getBoards = function(callback) {
    Trello.rest('GET', 'members/me/boards', { filter: 'open', lists: 'open' }, function(boards) {
      callback(boards);
    }, _apiError);
  };

  var getOrgs = function(callback) {
    Trello.rest('GET', 'members/me/organizations', function(orgs) {
      callback(orgs);
    }, _apiError);
  };

  /**
   * submitCard
   * submit the form and send the new card to the Trello API
   *
   */
  var submitCard = function(data) {
    Trello.rest('POST', 'cards', {
      name: data['card-title'],
      desc: data['card-description'],
      date: null,
      idList: data['list'],
      urlSource: null
    }, function(success) {
      // close the window on success
      window.close();
    }, _apiError);
  };

  /**
   * authorize
   * authorizes the user with Trello
   *
   */
  var authorize = function(success, error) {
    Trello.authorize({
        name: 'Add to Trello',
        expiration: 'never',
        scope: { read: true, write: true, account: false },
        success: success,
        error: error
    });
  };

  /**
   * deauthorize
   * logs the user out from Trello and deletes all local storage
   *
   */
  var deauthorize = function() {
    Trello.deauthorize();
    storage.clearData();
    showSettings();
  };

  /**
   * returns true if trello_token is stored in localStorage
   * false otherwise
   */
  var isAuthorized = function() {
    return localStorage.getItem('trello_token') ? true : false;
  }

  /**
   * Public API
   */
  return {
    isAuthorized: isAuthorized,
    authorize: authorize,
    deauthorize: deauthorize,
    getOrgsAndBoards: getOrgsAndBoards,
    getBoards: getBoards,
    getOrgs: getOrgs,
    submitCard: submitCard
  }
}());

module.exports = TrelloApi;
