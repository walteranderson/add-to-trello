$(function() {

// ---------- Initialization ---------- //

    // if not logged in, redirect to settings page
    if (!api.isAuthorized()) return showSettings();

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
        var settings = storage.getSettings();
        var form     = $(".add-card-form");
        var data     = serialize(form);

        if (settings.boardList != 'choose') {
            // set the default dropdowns to what was selected
            storage.setDefaults(data['board'], data['list']);
        }

        api.submitCard(data);
    });
});

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
        // send the first tab through the callback
        callback(tabs[0]);
    });
}

/**
 * initialize selected form inputs based on settings
 */
function initForms() {
    var settings    = storage.getSettings();
    var title       = $('.js-card-title');
    var description = $('.js-card-description');
    var board       = $('.js-lists option[value="'+ settings.list +'"]');
    var list        = $('.js-boards option[value="'+ settings.board +'"]');

    if (settings.boardList == 'choose') {
        board.prop('selected', true);
        list.prop('selected', true);
    }

    // use as-defined if set
    if (settings.title == 'defined') title.val(settings.titleValue);
    if (settings.description == 'defined') description.val(settings.descriptionValue);


    // get the current tab info and insert into the form, if necessary
    if (settings.title == 'page' || settings.description == 'url') {
        getCurrentTab(function(tab) {
            if (settings.title == 'page') title.val(tab.title);
            if (settings.description == 'url') description.text(tab.url);
        });
    }
}
