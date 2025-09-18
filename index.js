const context = SillyTavern.getContext();
const isMobile = context.isMobile();
const eventSource = context.eventSource;
const eventTypes = context.eventTypes;

async function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

eventSource.on(eventTypes.APP_READY, async () => {

    // Prevent iOS longpress menu and zoom on character/group selects
    $('head').append('<style>.character_select, .group_select, #rightNavDrawerIcon { -webkit-touch-callout: none; -webkit-user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; user-select: none; user-drag: none; }</style>');

    //add a longpress event to switch to the character and close the panel
    let pressTimer;
    let longpressTriggered = false;
    $(document).on('touchstart', '.character_select, .group_select', function (e) {
        const target = $(e.target);
        e.preventDefault();
        e.stopPropagation();

        pressTimer = window.setTimeout(async () => {
            longpressTriggered = true;
            target.trigger('click'); // Trigger selection
            if (isMobile && $('#rightNavDrawerIcon').hasClass('openIcon')) {
                await delay(300);
                $('#rightNavDrawerIcon').trigger('click');
            }
        }, 500); // 500ms for long press
    }).on('touchend touchmove touchcancel', '.character_select, .group_select', function (e) {
        clearTimeout(pressTimer); // Clear the timer if touch ends or moves
    }).on('dragstart', '.character_select, .group_select', function (e) {
        e.preventDefault(); // Prevent iOS Safari's image-dragDrop
    });

    //longpress handler for #rightNavDrawerIcon
    //opens char panel to the char list view
    $(document).on('touchstart', '#rightNavDrawerIcon', function (e) {
        e.preventDefault();
        e.stopPropagation();

        pressTimer = window.setTimeout(async () => {
            longpressTriggered = true;
            if (!$('#rightNavDrawerIcon').hasClass('openIcon')) {
                $('#rm_button_characters').trigger('click'); // focus character list view (not individual character)
                await delay(300);
                $('#rightNavDrawerIcon').trigger('click'); // open character panel
            }
        }, 500); // 500ms for long press
    }).on('touchend touchmove touchcancel', '#rightNavDrawerIcon', function (e) {
        clearTimeout(pressTimer); // Clear the timer if touch ends or moves
    }).on('dragstart', '#rightNavDrawerIcon', function (e) {
        e.preventDefault(); // Prevent iOS Safari's image-dragDrop
    });

    // Prevent carry-over clicks after longpress
    $(document).on('touchend', function(e) {
        if (longpressTriggered) {
            e.preventDefault();
            e.stopPropagation();
            longpressTriggered = false;
        }
    });
});


jQuery(async () => {
    console.log('ST-AutoCloseCharPanelOnSelect: Initialized');
});
