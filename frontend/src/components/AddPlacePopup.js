import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({
  isOpen,
  onClose,
  onAddPlaceSubmit,
  isLoading,
}) {
  const [cardName, setCardName] = React.useState("");
  const [link, setLink] = React.useState("");
  const [isTitleInputValid, setIsTitleInputValid] = React.useState(false);
  const [isLinkInputValid, setIsLinkInputValid] = React.useState(false);
  const [titleErrorMessage, setTitleErrorMessage] = React.useState("");
  const [linkErrorMessage, setLinkErrorMessage] = React.useState("");

  function handleChange(evt, stateUpdater, validityUpdater) {
    stateUpdater(evt.target.value);
    validityUpdater(evt);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    onAddPlaceSubmit({
      name: cardName,
      link: link,
    });
  }

  // Reset Form
  React.useEffect(() => {
    setCardName("");
    setLink("");
    setTitleErrorMessage("");
    setLinkErrorMessage("");
  }, [isOpen]);

  function checkTitleInputValidity(evt) {
    if (!evt.target.validity.valid) {
      setIsTitleInputValid(false);
      setTitleErrorMessage(evt.target.validationMessage);
    } else {
      setIsTitleInputValid(true);
      setTitleErrorMessage("");
    }
  }

  function checkLinkInputValidity(evt) {
    if (!evt.target.validity.valid) {
      setIsLinkInputValid(false);
      setLinkErrorMessage(evt.target.validationMessage);
    } else {
      setIsLinkInputValid(true);
      setLinkErrorMessage("");
    }
  }

  return (
    <PopupWithForm
      title="New Place"
      name="new-place"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={`${isLoading ? "Saving..." : "Save"}`}
      isInvalid={!(isTitleInputValid && isLinkInputValid)}
    >
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_title"
          id="title-input"
          type="text"
          minLength="1"
          maxLength="30"
          name="name"
          value={cardName}
          placeholder="Title"
          required
          onChange={(evt) =>
            handleChange(evt, setCardName, checkTitleInputValidity)
          }
        />
        <span
          className={`popup__input-error ${
            !isTitleInputValid && "popup__error_visible"
          }`}
        >
          {titleErrorMessage}
        </span>
      </label>
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_link"
          id="link-input"
          type="url"
          value={link}
          name="link"
          placeholder="Image link"
          required
          onChange={(evt) => handleChange(evt, setLink, checkLinkInputValidity)}
        />
        <span
          className={`popup__input-error ${
            !isLinkInputValid && "popup__error_visible"
          }`}
        >
          {linkErrorMessage}
        </span>{" "}
      </label>
    </PopupWithForm>
  );
}
