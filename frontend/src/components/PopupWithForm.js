import React from "react";

function PopupWithForm({
  name,
  isOpen,
  title,
  children,
  buttonText = "Save",
  onClose,
  onSubmit,
}) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? "popup_open" : ""}`}>
      <div className="popup__content">
        <form className="popup__form" name={name} onSubmit={onSubmit}>
          <button type="button" className="popup__close" onClick={onClose} />
          <h3 className="popup__title">{title}</h3>
          {children}
          <button type="submit" className="button popup__button">
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
