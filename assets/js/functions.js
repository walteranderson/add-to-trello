function showSettings() {
    chrome.tabs.create({url: chrome.extension.getURL('settings.html')});
}

function authorize(success, error) {
    Trello.setKey(APP_KEY);
    Trello.authorize({
        name: 'Trello Add Cards',
        expiration: 'never',
        scope: { read: true, write: true, account: false },
        success: success,
        error: error
    });
}

function deauthorize() {
    Trello.deauthorize();
    clearData();
    showSettings();
}

function clearData() {
    localStorage.removeItem('trello_boards');
    localStorage.removeItem('select_defaults');
}
