$(function() {
    api.authorize(function() {
        // success
        $('#auth').addClass('hide');
        $('#success').removeClass('hide');
    }, function() {
        // error
        $('#auth').addClass('hide');
        $('#error').removeClass('hide');
    });
});
