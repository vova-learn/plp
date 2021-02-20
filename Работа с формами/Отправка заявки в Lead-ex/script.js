var onFormSubmit = function (evt) {
	var nameForm = JSON.parse(evt.currentTarget.dataset.form).name;
    
	var name = evt.currentTarget.querySelector('[plp-field="name"] input').value;
	var phone = evt.currentTarget.querySelector('[plp-field="phone"] input').value;
	var email = evt.currentTarget.querySelector('[plp-field="email"] input').value;

	var data = {
		name: name,
		phone: phone,
		email: email,
	};

	p_click.fireSend(data, nameForm);
}

var initFormSubmit = function () {
	$('.widget-form2').submit(onFormSubmit);
};

document.addEventListener('DOMContentLoaded', initFormSubmit);