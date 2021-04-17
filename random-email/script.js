const domain = `random-email.ru`;
const getRandomEmail = max => (Math.random() * 10000).toFixed(4) + `@${domain}`;

const setEmail = () => {
    $(`form`).each(function (index, form) {
        const emailValue = getRandomEmail();

        $(form).find(`[data-type="email"]`).remove();
        $(form).find(`.fields`).append(`<div class="field" data-type="email" style="display: none;"><div class="input"><input class="form-control text""></div></div>`);
        $(form).find(`[data-type="email"] input`).val(emailValue);
        // TODO: console.log(emailValue, $(form).find(`[data-type="email"] input`));
    });
};

document.addEventListener(`DOMContentLoaded`, setEmail);