$(function() {

// ---------- Initialization ---------- //

    // handle authorization
    api.authorize(onSuccess, onError);


// ---------- Events ---------- //

    $('.js-settings-form').change(function() {
        var form = serialize($(this));

        storage.setSettings(form);
    });

});

/**
 * on authorization success
 */
function onSuccess() {
    $('#auth').addClass('hide');
    $('#success').removeClass('hide');
    $('#settings').removeClass('hide');
    initSettings();
}

/**
 * on authorization failure
 */
function onError() {
    $('#auth').addClass('hide');
    $('#error').removeClass('hide');
    $('#settings').addClass('hide');
}

/**
 * initialize the settings form from data stored in localStorage
 */
function initSettings() {
    var settings = storage.getSettings();
    var form     = $('.js-settings-form');

    $.each(settings, function(key, value) {
        form.find('[name="'+ key +'"]').val(value);
    });
}
