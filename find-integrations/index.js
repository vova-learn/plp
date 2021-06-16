let INTEGRATION = 'ID';

let isBacklight = false; // подсветить форму
let Color = {
    CONNECT: '#5fab44',
    NO_CONNECT: '#e95123',
};
let FormCounter = {
    all: 0,  
    connect: 0,  
    noConnect: 0,  
    noConnectInModal: 0,  
};

let MessageStyle = {
    connect: `padding: 10px; background: ${Color.CONNECT}; font: 16px Arial; color: white;`,
    noConnect: `padding: 10px; background: ${Color.NO_CONNECT}; font: 16px Arial; color: white;`,
};

let setFormColor = function ($form, color) {
    if (isBacklight) {
        $form.css('background', color);
        $form.find('input').css('background', color);
    }
};

let initMessage = function () {
    clear();
    console.log('%c' + `Подключено форм: ${FormCounter.connect} из ${FormCounter.all}`,  MessageStyle.connect);
    if (FormCounter.all !== FormCounter.connect) {
        console.log('%c' + `Не подключено форм: ${FormCounter.noConnect} (${FormCounter.noConnectInModal} в модальном окне)`,  MessageStyle.noConnect);
    }
};

let initNoConnectAction = function ($form) {
    const isModal = $form.closest('.modal-body').length;
    if (isModal) {
        FormCounter.noConnect += 1;
        FormCounter.noConnectInModal += 1;
    } else {
        FormCounter.noConnect += 1;
    }
    setFormColor($form, Color.NO_CONNECT);
}

let findIntegration = function () {
    const $forms = $('.cr-form[data-form], form[data-form]');
    $forms.each(function (index, form) {
        const $form = $(form);
        
        const integrations = $(form).data('form').integrations;
        if (integrations.includes(INTEGRATION)) {
            FormCounter.connect += 1;
            setFormColor($form, Color.CONNECT);
        } else {
            initNoConnectAction($form);
        }
        FormCounter.all += 1;
    });
    initMessage();
};

$(document).ready(findIntegration);