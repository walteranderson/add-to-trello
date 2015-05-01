$(function() {

// ---------- Initialization ---------- //

    // handle authorization
    api.authorize(onSuccess, onError);

    if ($('.js-board-list').val() == 'choose') {
        showBoardsAndLists();
    }


// ---------- Events ---------- //

    $('.js-settings-form').change(function() {
        var form = serialize($(this));

        storage.setSettings(form);
    });


    $('.js-board-list').change(function() {
        var selected = $(this).val();

        if (selected == 'choose') {
            showBoardsAndLists();
        } else {
            hideBoardsAndLists();
        }
    });

    // Change list dropdown when the user changes the board
    $('.js-boards').change(changeList);

});

/**
 * on authorization success
 */
function onSuccess() {
    $('#auth').addClass('hidden');
    $('#success').removeClass('hidden');
    $('#settings').removeClass('hidden');
    initSettings();
}

/**
 * on authorization failure
 */
function onError() {
    $('#auth').addClass('hidden');
    $('#error').removeClass('hidden');
    $('#settings').addClass('hidden');
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

function showBoardsAndLists() {
    $('.board-dropdown').removeClass('hidden');
    $('.list-dropdown').removeClass('hidden');
    loadBoardsAndLists();
}

function hideBoardsAndLists() {
    $('.board-dropdown').addClass('hidden');
    $('.list-dropdown').addClass('hidden');
}
