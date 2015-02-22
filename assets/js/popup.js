$(function() {
    if (!localStorage.trello_token) {
        showSettings();
        return;
    }

    // open up Trello.com
    $('.js-trello-link').click(function() {
        chrome.tabs.create({ url: 'https://trello.com' });
    });

    $('.js-open-settings').click(function() {
        showSettings();
    });

    // Deauthorize Trello
    $('.js-logout').click(function() {
        api.deauthorize();
    });

    // Change list dropdown when the user changes the board
    $('.js-boards').change(changeList);

    // Add the new card
    $('.js-submit').click(function() {
        var data = [];
        $(".add-card-form").serializeArray().map(function(x){data[x.name] = x.value;});

        storage.setDefaults(data['board'], data['list']);

        api.submitCard(data);
    });

    // get the current tab info and insert into the form
    getCurrentTab(function(tab) {
        $('.js-card-title').val(tab.title);
        $('.js-card-description').text(tab.url);
    });

    // hit API to get boards and insert into the add form
    api.getBoards(loadBoardsAndLists);
});

function loadBoardsAndLists() {
    var boards   = storage.getBoards();
    var defaults = storage.getDefaults();

    // set the defaults to first board and first list if none present
    if (!defaults) {
        defaults = storage.resetDefaults();
    }

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

function getCurrentTab(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];

        callback(tab);
    });
}

function createOption(data, isSelected) {
    var option = $('<option>', { value: data.id })
        .text(data.name);

    if (isSelected) {
        option.attr('selected', 'selected');
    }

    return option;
}
