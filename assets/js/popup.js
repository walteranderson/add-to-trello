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
