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
        var board = {};
        var list  = {};

        if (orgs.me.boards.length) {
            board = orgs.me.boards[0];

            if (board.lists.length) {
                list = board.lists[0];
            } else {
                list.id = 0;
            }
        } else {
            board.id = 0;
            list.id  = 0;
        }

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

module.exports = storage;
