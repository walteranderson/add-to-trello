function showSettings() {
    chrome.tabs.create({url: chrome.extension.getURL('settings.html')});
}

function clearData() {
    localStorage.removeItem('trello_boards');
    localStorage.removeItem('select_defaults');
}

var storage = (function() {
    'use strict';

    /**
     * clear stored data
     */
    var clearData = function() {
        localStorage.removeItem('trello_boards');
        localStorage.removeItem('select_defaults');
    };

    /**
     * reset the default options to be the first board and first list
     */
    var resetDefaults = function() {
        var boards = getBoards();

        localStorage.setItem('select_defaults', JSON.stringify({
            board_id: boards[0].id,
            list_id: boards[0].lists[0].id
        }));

        return getDefaults();
    };

    /**
     * set default options
     */
    var setDefaults = function(boardId, listId) {
        localStorage.setItem('select_defaults', JSON.stringify({
            board_id: boardId,
            list_id: listId
        }));
    };

    /**
     * retrieve default options
     */
    var getDefaults = function() {
        return JSON.parse(localStorage.getItem('select_defaults'));
    };

    /**
     * retrieve boards
     */
    var getBoards = function() {
        return JSON.parse(localStorage.getItem('trello_boards'));
    };

    /**
     * set boards
     */
    var setBoards = function(boards) {
        localStorage.setItem('trello_boards', JSON.stringify(boards));
    };

    /**
     * Public API
     */
    return {
        getBoards: getBoards,
        setBoards: setBoards,
        getDefaults: getDefaults,
        setDefaults: setDefaults,
        resetDefaults: resetDefaults,
        clearData: clearData
    }
}());

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
            storage.setBoards(boards);
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
