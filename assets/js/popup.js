$(document).ready(function() {
    if (!localStorage.trello_token) {
        showSettings();
        return;
    }

    $('#logout').click(function() {
        deauthorize();
    });
});
