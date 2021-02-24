cr.api((page) => {
	const setActive = (mainElement, cardElement) => {
		const paramsElement = mainElement.querySelector(`div[data-params]`);
		const paramsData = JSON.parse(paramsElement.dataset.params);

		const button = mainElement.querySelector(`button[data-action=none]`);
		button.classList.add(`js-${paramsData.category}`);

		const buttonsCategoryElements = cardElement.querySelectorAll(`.js-${paramsData.category}`);
		buttonsCategoryElements[0].classList.add(`active`);
		buttonsCategoryElements[0].classList.add(`js-active`);
	};

	const setAtributes = (mainElement, cardElement, isStart) => {
		const dataElement = mainElement.querySelector(`div[data-params]`);
		const elementData = JSON.parse(dataElement.dataset.params);
		const buttonsCategoryElements = cardElement.querySelectorAll(`.js-${elementData.category}`);
		const paramsElement = buttonsCategoryElements[0].closest(`div[data-params]`);
		
		const cardData = JSON.parse(cardElement.dataset.item);
		const paramsData = JSON.parse(paramsElement.dataset.params);

		let nameData = {};
		let priceData = {};
		let photoData = {};

		const isNameData = !!cardElement.dataset.name;
		if (!isNameData) {
			nameData = {
				name: cardData[0].value,
				[paramsData.category]: paramsData.parameter,
			};
			priceData = {
				price: cardData[1].value.replace(/\D+/g, ``),
				code: cardData[1].value.replace(/[^A-Za-zА-Яа-я.₽$€₴]+/g, ` `).trim(),
				upprice: {
					[paramsData.category]: paramsData.price,
				},
			};
			photoData = paramsData.photo.isPhoto ? paramsData.photo.src : cardData[2].value;
		} else {
			if (isStart) {
				nameData = JSON.parse(cardElement.dataset.name);
				nameData[paramsData.category] = paramsData.parameter;

				priceData = JSON.parse(cardElement.dataset.price);
				priceData.upprice[paramsData.category] = paramsData.price;

				if (paramsData.photo.isPhoto) {
					photoData = paramsData.photo.src;
				} else {
					photoData = JSON.parse(cardElement.dataset.photo);
				}
			} else {
				nameData = JSON.parse(cardElement.dataset.name);
				nameData[elementData.category] = elementData.parameter;

				priceData = JSON.parse(cardElement.dataset.price);
				priceData.upprice[elementData.category] = elementData.price;

				if (elementData.photo.isPhoto) {
					photoData = elementData.photo.src;
				} else {
					photoData = JSON.parse(cardElement.dataset.photo);
				}
			}
		}

		cardElement.dataset.name = JSON.stringify(nameData);
		cardElement.dataset.price = JSON.stringify(priceData);
		cardElement.dataset.photo = JSON.stringify(photoData);
	};

	const setCountAtribute = cardElement => {
		const countFieldElement = cardElement.querySelector(`div[plp-field=count] input`);
		const countSliderElement = cardElement.querySelector(`div[plp-field=slider]`);

		let quantityData = null;

		if (countFieldElement && !countSliderElement) {
			countFieldElement.setAttribute(`min`, `1`);
			quantityData = countFieldElement.value;
		} else if (countSliderElement && !countFieldElement) {
			//TODO: для поля "Ползунок": div[plp-field=slider];
			throw new Error(`Поле "Ползунок" недоступно для выбора`);
		} else if (!countFieldElement && !countSliderElement) {
			quantityData = 1;
		} else {
			throw new Error(`Удалите одно из полей выбора количества`);
		}

		cardElement.dataset.count = JSON.stringify(quantityData);
	};

	const saveStartData = cardElement => {
		const nameData = JSON.parse(cardElement.dataset.name);
		const priceData = JSON.parse(cardElement.dataset.price);
		const photoData = {
			photo: JSON.parse(cardElement.dataset.photo),
		};
		const countData = {
			count: JSON.parse(cardElement.dataset.count),
		};

		const startData = [nameData, priceData, photoData, countData];
		cardElement.dataset.start = JSON.stringify(startData);
	};

	const getPriceElement = cardElement => {
		const textElement = cardElement.querySelector(`div[data-role=itemprice]`);
		let childTextElement = textElement.lastChild;
		let tagName = undefined;
		
		while (childTextElement) {
			const isTagName = typeof childTextElement.tagName === `string`;
			const isNextElementTagName = childTextElement.lastChild.tagName === undefined;

			if (isTagName && isNextElementTagName) {
				tagName = childTextElement.tagName;
				return tagName;
			}
    		childTextElement = childTextElement.lastChild;
		}
	};

	const recountItems = (cardElement, isStart) => {
		const nameData = JSON.parse(cardElement.dataset.name);
		const categoryNames = Object.keys(nameData).splice(1, Object.keys(nameData).length);
		let categoryValues = [];

		for (const category of categoryNames) {
			categoryValues.push(`${category}: ${nameData[category]}`);
		}

		const name = `${nameData.name} (${categoryValues.join(` `)})`;
		$(cardElement).data(`item`)[0].value = name;

		const priceData = JSON.parse(cardElement.dataset.price);
		const upprice = Object.values(priceData.upprice).reduce((acc, item) => {
			return acc + +item; 
		}, 0);
		const count = +JSON.parse(cardElement.dataset.count);
		const price = `${(+priceData.price + upprice) * count} ${priceData.code}`;
		$(cardElement).data(`item`)[1].value = price;

		const priceElement = cardElement.querySelector(`div[data-role=itemprice] ${getPriceElement(cardElement)}`);
		priceElement.textContent = price;

		const photo = JSON.parse(cardElement.dataset.photo);
		$(cardElement).data(`item`)[2].value = photo;

		const photoElement = cardElement.querySelector(`div[data-role=image]`);
		const isBgImage = photoElement.classList.contains(`bgimage`);
		const isBgRound = photoElement.classList.contains(`round`);
		const imgTag = photoElement.querySelector(`img`);

		const setPhoto = () => {
			if (isBgImage || isBgRound) {
				photoElement.style.backgroundImage = `url(${photo})`;
			} else {
				imgTag.src = photo;
			}
		};

		const onLoadImg = () => {
			setPhoto();
			window.removeEventListener(`load`, onLoadImg);
		};

		if (isStart) {
			window.addEventListener(`load`, onLoadImg);
		} else {
			setPhoto();
		}
	};

	const setClickOnButton = (mainElement, cardElement) => {
		const buttonElement = mainElement.querySelector(`button[data-action]`);
		const paramsElement = mainElement.querySelector(`div[data-params]`);
		const paramsData = JSON.parse(paramsElement.dataset.params);
		
		buttonElement.addEventListener(`click`, (evt) => {
			const isActiveButton = evt.currentTarget.classList.contains(`active`);
			if (!isActiveButton) {
				const buttonsElements = cardElement.querySelectorAll(`.js-${paramsData.category}`);
				for (const button of buttonsElements) {
					button.classList.remove(`active`);
				}
				buttonElement.classList.add(`active`);
				setAtributes(mainElement, cardElement, false);
				recountItems(cardElement, false);
			}
		});
	};

	const setClickOnCount = cardElement => {
		const countFieldElement = cardElement.querySelector(`div[plp-field=count] input`);
		// TODO: change для поля "Ползунок": div[plp-field=slider];
		if (countFieldElement) {
			countFieldElement.addEventListener(`change`, () => {
				setCountAtribute(cardElement);
				recountItems(cardElement);
			});			
		}
	};

	const checkCategory = mainElement => {
		const paramsElement = mainElement.querySelector(`div[data-params]`);
		const dataParams = JSON.parse(paramsElement.dataset.params);

		if (dataParams.category !== `color`) {
			dataParams.photo.isPhoto = false;
			paramsElement.dataset.params = JSON.stringify(dataParams);
		}
	};

	page.initExCard = (el) => {
		const mainElement = el;
		const cardElement = mainElement.closest(`div[data-item]`);

		checkCategory(mainElement);
		setActive(mainElement, cardElement);
		setAtributes(mainElement, cardElement, true);
		setCountAtribute(cardElement);
		recountItems(cardElement, true);
		saveStartData(cardElement);
		setClickOnButton(mainElement, cardElement);
		setClickOnCount(cardElement);
	};

	const initMessage = (title, text, imageUrl) => {
		swal({
			title,
			text,
			imageUrl,
			imageWidth: 400,
			imageHeight: 200,
			timer: 1800,
		});
	};

	const initReset = cardElement => {
		const startData = JSON.parse(cardElement.dataset.start);
		cardElement.dataset.name = JSON.stringify(startData[0]);
		cardElement.dataset.price = JSON.stringify(startData[1]);
		cardElement.dataset.photo = JSON.stringify(startData[2].photo);
		cardElement.dataset.count = JSON.stringify(startData[3].count);
		recountItems(cardElement);

		const buttonsElements = cardElement.querySelectorAll(`button[data-action=none]`);
		for (const button of buttonsElements) {
			const isStart = button.classList.contains(`js-active`);
			if (!isStart) {
				button.classList.remove(`active`);
			} else {
				button.classList.add(`active`);
			}
		}

		const countFieldElement = cardElement.querySelector(`div[plp-field=count] input`);
		// TODO: change для поля "Ползунок": div[plp-field=slider];
		if (countFieldElement) {
			countFieldElement.value = startData[3].count;
		}
	};

	page.addToCart = (buttonElement, isModal, isReset) => {
		const cardElement = buttonElement.closest(`div[data-item]`);
		
		const nameData = JSON.parse(cardElement.dataset.name);
		const categoryNames = Object.keys(nameData).splice(1, Object.keys(nameData).length);
		let categoryValues = [];

		for (const category of categoryNames) {
			categoryValues.push(`${category}: ${nameData[category]}`);
		}

		const title = `${nameData.name}\n(${categoryValues.join(` `)})`;

		const priceData = JSON.parse(cardElement.dataset.price);
		const upprice = Object.values(priceData.upprice).reduce((acc, item) => {
			return acc + +item; 
		}, 0);
		const price = `${+priceData.price + upprice} ${priceData.code}`;

		const photoData = JSON.parse(cardElement.dataset.photo);
		const countData = +JSON.parse(cardElement.dataset.count);

		page.cart.addItem({
			title,
			price,
			image: photoData,
			quantity: countData,
		});

		isModal ? initMessage('Добавлено в корзину!', title,  photoData) : ``;
		isReset ? initReset(cardElement) : ``;
	};
});