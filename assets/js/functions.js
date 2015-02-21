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

function showSettings() {
    chrome.tabs.create({url: chrome.extension.getURL('settings.html')});
}

function authorize(success, error) {
    Trello.setKey(APP_KEY);
    Trello.authorize({
        name: 'Trello Add Cards',
        expiration: 'never',
        success: success,
        error: error
    });
}

function deauthorize() {
    Trello.deauthorize();
    showSettings();
}
