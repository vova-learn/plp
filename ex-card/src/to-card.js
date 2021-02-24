const isModal = true; // без сообщения - false;
const isReset = true; // не сбрасывать - false;

const buttonElement = this;
cr.api((page) => {
  page.addToCart(buttonElement, isModal, isReset);
});