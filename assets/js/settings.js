$(function() {

// ---------- Initialization ---------- //

    // handle authorization
    api.authorize(onSuccess, onError);

    if ($('.js-board-list').val() == 'choose') {
        showBoardsAndLists();
    }


// ---------- Events ---------- //

    // save the settings
    $('.js-settings-form').change(function() {
        var form = serialize($(this));

        storage.setSettings({
            title: form.title,
            description: form.description,
            boardList: form.boardList,
            titleValue: form.titleValue,
            descriptionValue: form.descriptionValue
        });

        if (form.boardList == 'choose') {
            storage.setDefaults(form.board, form.list);
        }
    });


    // toggle the board/list override dropdowns
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

    // toggle the as-defined input box when we select it/unselect it
    $('.js-defined-control').change(function() {
        var input  = $(this).siblings('input');
        var option = $(this).val();

        if (option == 'defined') {
            input.removeClass('hidden');
        } else {
            input.addClass('hidden');
        }
    });

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
