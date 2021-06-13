const saveItem = function () {
  const $itemCards = $('[data-item]');
  $itemCards.each(function (index, itemCard) {
    const $itemCard = $(itemCard);
    const itemName = $itemCard.data().item[0].value;
    const itemPhoto = $itemCard.data().item[2].value;
    $itemCard.attr('data-name', itemName);
    $itemCard.attr('data-photo', itemPhoto);
  });
};

const setNewItem = function ($itemCard, itemName, $button) {
  const newName = $button.find('.name').text().trim();
  const newPrice = $button.find('.cost').text().trim();
  const newPhoto = $button.find('.pht').text().trim();
  
  const isFullName = true;
  $itemCard.data().item[0].value = isFullName ? `${itemName}<br/>${newName}` : newName;
  $itemCard.data().item[1].value = newPrice;
  $itemCard.data().item[2].value = newPhoto ? newPhoto : $itemCard.data('photo');
};

const getPriceElement = function ($itemCard) {
    const $itemPrice = $($itemCard.find('[data-role="itemprice"]')[0]).find('p');
    let $lastChild = $itemPrice.children().last();
    
    while ($lastChild) {
      const isPrice = typeof $lastChild.prop('tagName') === 'string';
      const isLastElement = $lastChild.children().last().prop('tagName') === undefined;

      if (isPrice && isLastElement) {
        return $lastChild.prop('tagName').toLowerCase();
      }
        $lastChild = $lastChild.children().last();
    }
};

const setPhoto = function ($itemCard, itemPhoto) {
  const $photoElement = $itemCard.find('[data-role="image"]');
  const isNormal = $photoElement.hasClass('bgnormal');
  const isImage = $photoElement.hasClass('bgimage');
  const isRound = $photoElement.hasClass('round');
  const isStack = $photoElement.hasClass('stack-image');
  const isFancybox = $photoElement.find('a') || $photoElement.prop('tagName') === 'A' ? true : false;

  if (isNormal || isStack) {
    if (isFancybox) {
      if (isStack) {
        $photoElement.attr('href', itemPhoto);
      } else {
        $photoElement.find('a').attr('href', itemPhoto);
      }
      $photoElement.find('img').attr('src', itemPhoto);
    } else {
      $photoElement.find('img').attr('src', itemPhoto);
    }
  } else if (isImage || isRound) {
    if (isFancybox) {
      $photoElement.attr('href', itemPhoto);
      $photoElement.css('background-image', `url(${itemPhoto})`);
    } else {
      $photoElement.css('background-image', `url(${itemPhoto})`);
    }
  }
};

const showNewItem = function ($itemCard) {
  const itemPrice = $itemCard.data().item[1].value;
  const itemPhoto = $itemCard.data().item[2].value;

  const $itemPrice = $itemCard.find(`[data-role="itemprice"] ${getPriceElement($itemCard)}`);
  $itemPrice.text(itemPrice);

  setPhoto($itemCard, itemPhoto);
};

const setActiveButton = function ($button) {
  const $color = $button.closest('.color');
  $color.find('button').removeClass('active');
  $button.addClass('active');
};

const initChangeItem = function () {
  saveItem();

  const $buttons = $('.color button');
  $buttons.on('click', function (evt) {
    const $button = $(evt.currentTarget);
    const $itemCard = $button.closest('[data-item]');
    const itemName = $itemCard.data('name');
    
    setNewItem($itemCard, itemName, $button);
    showNewItem($itemCard);
    setActiveButton($button);
  });
};

$(document).ready(initChangeItem);