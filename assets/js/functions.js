function showSettings() {
    chrome.tabs.create({url: chrome.extension.getURL('settings.html')});
}

function openTrello() {
    chrome.tabs.create({ url: 'https://trello.com' });
}

function serialize(form) {
    var formData = form.serializeArray();
    var formObj  = {};

    $.each(formData, function (index, value) {
        if (value.value !== '') {
            formObj[value.name] = value.value;
        }
    });

    return formObj;
}

/**
 * local storage module for caching trello data
 */
var storage = (function() {
    'use strict';

    var defaultSettings = {
        title: 'page',
        description: 'url',
        boardList: 'last-used'
    };

    /**
     * clear stored data
     */
    var clearData = function() {
        localStorage.removeItem('trello_orgs');
        localStorage.removeItem('select_defaults');
        localStorage.removeItem('settings');
    };

    /**
     * reset the default options to be the first board and first list
     */
    var resetDefaults = function() {
        var orgs  = getOrgs();
        var board = orgs.me.boards[0];
        var list  = board.lists[0];

        localStorage.setItem('select_defaults', JSON.stringify({
            board_id: board.id,
            list_id: list.id
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
     * retrieve organizations and boards and lists
     */
    var getOrgs = function() {
        return JSON.parse(localStorage.getItem('trello_orgs'));
    };

    /**
     * set organizations and boards and lists
     */
    var setOrgs = function(orgs) {
        localStorage.setItem('trello_orgs', JSON.stringify(orgs));
    };

    /**
     * get settings
     */
    var getSettings = function() {
        var settings = JSON.parse(localStorage.getItem('settings'));
        if (!settings) {
            // set and return the default configuration if not set
            setSettings(defaultSettings);
            return defaultSettings;
        }

        return settings;
    };

    /**
     * set settings
     */
    var setSettings = function(settings) {
        localStorage.setItem('settings', JSON.stringify(settings));
    };

    /**
     * Public API
     */
    return {
        getOrgs: getOrgs,
        setOrgs: setOrgs,

        getDefaults: getDefaults,
        setDefaults: setDefaults,

        getSettings: getSettings,
        setSettings: setSettings,

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
                    orgList[board.idOrganization || 'me'].boards.push(board);
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
        isAuthorized: isAuthorized,
        authorize: authorize,
        deauthorize: deauthorize,
        getOrgsAndBoards: getOrgsAndBoards,
        getBoards: getBoards,
        getOrgs: getOrgs,
        submitCard: submitCard
    }
}());

api.ready();
