$(function() {
    // if not logged in, redirect to settings page
    if (!api.isAuthorized()) {
        showSettings();
        return;
    }

    // initially load the boards from memory
    loadBoardsAndLists();

    // get the current tab info and insert into the form
    getCurrentTab(function(tab) {
        $('.js-card-title').val(tab.title);
        $('.js-card-description').text(tab.url);
    });

    // hit API to get boards and insert into the add form
    api.getBoards(loadBoardsAndLists);


    // ------------------------------
    // Click Events
    // ------------------------------

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
        var data = [];
        $(".add-card-form").serializeArray().map(function(x){data[x.name] = x.value;});

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
    var boards   = storage.getBoards();
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
    });
}

/**
 * changeList
 * updates the list dropdown based on the selected board
 *
 */
function changeList() {
    var id     = $(this).val();
    var boards = storage.getBoards();
    var lists  = $.grep(boards, function(e){ return e.id === id; })[0].lists;

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
