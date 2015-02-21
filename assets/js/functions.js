function showSettings() {
    chrome.tabs.create({url: chrome.extension.getURL('settings.html')});
}

function clearData() {
    localStorage.removeItem('trello_boards');
    localStorage.removeItem('select_defaults');
}

/**
 * api module for interacting with the Trello API
 *
 */
var api = (function() {
    'use strict';

    /**
     * apiError
     * handle errors from Trello API
     *
     */
    var _apiError = function(message) {
        console.log(message);
    };

    /**
     * getBoards
     * call Trello API to get the user's boards and associated lists
     *
     */
    var getBoards = function(callback) {
        Trello.rest('GET', 'members/me/boards', { filter: 'open', lists: 'open' }, function(boards) {
            localStorage.setItem('trello_boards', JSON.stringify(boards));
            callback();
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
            idList: data['lists'],
            urlSource: null
        }, function(success) {
            console.log(success);
            window.close();
        }, _apiError);
    };

    /**
     * authorize
     * authorizes the user with Trello
     *
     */
    var authorize = function(success, error) {
        Trello.setKey(APP_KEY);
        Trello.authorize({
            name: 'Trello Add Cards',
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
        clearData();
        showSettings();
    };

    /**
     * ready
     * initalization method
     * Sets the Trello app key and token
     *
     */
    var ready = function() {
        Trello.setKey(APP_KEY);
        Trello.setToken(localStorage.getItem('trello_token'));
    };

    /**
     * Public API
     *
     */
    return {
        ready: ready,
        authorize: authorize,
        deauthorize: deauthorize,
        getBoards: getBoards,
        submitCard: submitCard
    }
}());

api.ready();
