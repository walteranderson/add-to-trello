$(function() {

// ---------- Initialization ---------- //

    // handle authorization
    api.authorize(onSuccess, onError);

    if ($('.js-board-list').val() == 'choose') {
        showBoardsAndLists();
    }


// ---------- Events ---------- //

    // save the settings
    $('.js-settings-form').submit(function(e) {
        e.preventDefault();

        var form = serialize($(this));
        var data = {
            title: form.title,
            description: form.description,
            boardList: form.boardList,
            titleValue: '',
            descriptionValue: ''
        };

        // add defined title value if necessary
        if (form.title == 'defined') {
            data.titleValue = form.titleValue;
        }

        // add defined description value if necessary
        if (form.description == 'defined') {
            data.descriptionValue = form.descriptionValue;
        }

        // save main settings data
        storage.setSettings(data);

        // save board/list overrides
        if (form.boardList == 'choose') {
            storage.setDefaults(form.board, form.list);
        }

        // notify the user
        noty({
            text: 'Save successful!',
            layout: 'topLeft',
            theme: 'bootstrapTheme',
            type: 'success',
            timeout: 2000
        });
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
        var option = form.find('[name="'+ key +'"]');

        // set the option's value
        option.val(value);

        // unhide the as-defined inputs
        if (value == 'defined') {
            option.siblings('input').removeClass('hidden');
        }
    });
}

function showBoardsAndLists() {
    $('.board-dropdown').removeClass('hidden');
    $('.list-dropdown').removeClass('hidden');

    // load from storage immediately if we have it
    loadBoardsAndLists();

    // call the API to update our local storage
    api.getOrgsAndBoards(loadBoardsAndLists);
}

function hideBoardsAndLists() {
    $('.board-dropdown').addClass('hidden');
    $('.list-dropdown').addClass('hidden');
}
