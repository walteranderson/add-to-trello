$(function() {

// ---------- Initialization ---------- //

    // if not logged in, redirect to settings page
    if (!api.isAuthorized()) {
        showSettings();
        return;
    }

    // initially load the boards from memory
    loadBoardsAndLists();

    // add default form values based on settings
    initForms();

    // hit API to get boards and insert into the add form
    api.getOrgsAndBoards(loadBoardsAndLists);


// ---------- Events ---------- //

    // open up Trello.com
    $('.js-trello-link').click(openTrello);

    // open settings page
    $('.js-open-settings').click(showSettings);

    // Deauthorize Trello
    $('.js-logout').click(api.deauthorize);

    // Change list dropdown when the user changes the board
    $('.js-boards').change(changeList);

    // Add the new card
    $('.js-submit').click(function() {
        var form = $(".add-card-form");
        var data = serialize(form);

        // set the default dropdowns to what was selected
        storage.setDefaults(data['board'], data['list']);

        api.submitCard(data);
    });
});


/**
 * loadBoardsAndLists
 * pulls data from localStorage and inserts the board and list dropdowns
 *
 */
function loadBoardsAndLists() {
    var orgs     = storage.getOrgs();
    var defaults = storage.getDefaults();

    // if we don't have any data in localStorage, wait for the http request
    if (!orgs) return;

    // set the defaults to first board and first list if none present
    if (!defaults) {
        defaults = storage.resetDefaults();
    }

    $('.js-boards').html('');
    $('.js-lists').html('');

    $.each(orgs, function(key, org) {
        // append the option group
        $('.js-boards').append(createOptionGroup(org, defaults));
    });






/*    var boards   = storage.getBoards();
    var defaults = storage.getDefaults();

    // if we don't have any boards in localStorage, wait for the http request
    if (!boards) return;

    // set the defaults to first board and first list if none present
    if (!defaults) {
        defaults = storage.resetDefaults();
    }

    $('.js-boards').html('');
    $('.js-lists').html('');

    $.each(boards, function(key, board) {
        var boardSelected = false;
        if (defaults.board_id == board.id) boardSelected = true;

        // append the board
        $('.js-boards').append(createOption(board, boardSelected));

        if (boardSelected) {
            $.each(board.lists, function(key, list) {
                var listSelected = false;
                if (defaults.list_id == list.id) listSelected = true;

                // append the list
                $('.js-lists').append(createOption(list, listSelected));
            });
        }
    });*/
}

/**
 * changeList
 * updates the list dropdown based on the selected board
 *
 */
function changeList() {
    var id   = $(this).val();
    var orgs = storage.getOrgs();
    var lists = {};

    // search through the organzations and find the board that was selected
    $.each(orgs, function(key, org) {
        var board = $.grep(org.boards, function(e){ return e.id === id; })[0];
        if (board) { lists = board.lists; }
    });


    // clear the lists dropdown
    $('.js-lists').html('');

    $.each(lists, function(key, list) {
        var listSelected = false;
        if (key == 0) listSelected = true;

        // append the list
        $('.js-lists').append(createOption(list, listSelected));
    });
}

/**
 * getCurrentTab
 * retrieves the current tab information from chrome
 *
 */
function getCurrentTab(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];

        callback(tab);
    });
}

/**
 * creates an optgroup for the boards dropdown
 */
function createOptionGroup(org, defaults) {
    var optGroup = $('<optgroup>', { label: org.name });

    // loop through each board
    $.each(org.boards, function(key, board) {
        var boardSelected = false;
        if (defaults.board_id == board.id) boardSelected = true;

        // create the board option
        var option = createOption(board, boardSelected);

        // append the board to it's option group
        optGroup.append(option);


        if (boardSelected) {
            // loop through this board's lists
            $.each(board.lists, function(key, list) {
                var listSelected = false;
                if (defaults.list_id == list.id) listSelected = true;

                // append the list
                $('.js-lists').append(createOption(list, listSelected));
            });
        }
    });

    return optGroup;
}

/**
 * createOption
 * creates generic html <option> tag based on the parameters
 *
 */
function createOption(data, isSelected) {
    var option = $('<option>', { value: data.id })
        .text(data.name);

    if (isSelected) {
        option.attr('selected', 'selected');
    }

    return option;
}

/**
 * initialize selected form inputs based on settings
 */
function initForms() {
    var settings = storage.getSettings();

    // get the current tab info and insert into the form
    getCurrentTab(function(tab) {
        if (settings.title == 'page') {
            $('.js-card-title').val(tab.title);
        }

        if (settings.description == 'url') {
            $('.js-card-description').text(tab.url);
        }
    });
}
