import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({
  isOpen,
  onClose,
  onUpdateAvatar,
  isLoading,
}) {
  const [isAvatar, setIsAvatar] = React.useState("");
  const [isUrlInputValid, setIsUrlInputValid] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleChange(evt, stateUpdater, validityUpdater) {
    stateUpdater(evt.target.value);
    validityUpdater(evt);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    onUpdateAvatar({
      avatar: isAvatar,
    });
  }

  // Reset Form
  React.useEffect(() => {
    setIsAvatar("");
    setErrorMessage("");
  }, [isOpen]);

  function checkInputValidity(evt) {
    if (!evt.target.validity.valid) {
      setIsUrlInputValid(false);
      setErrorMessage(evt.target.validationMessage);
    } else {
      setIsUrlInputValid(true);
      setErrorMessage("");
    }
  }

  return (
    <PopupWithForm
      title="Change profile picture"
      name="new-avatar"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isInvalid={!isUrlInputValid}
      buttonText={`${isLoading ? "Saving" : "Save"}`}
    >
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_link"
          id="avatar-input"
          type="url"
          name="avatar"
          placeholder="Picture link"
          required
          value={isAvatar}
          onChange={(evt) => handleChange(evt, setIsAvatar, checkInputValidity)}
        />
        <span
          id="avatar-input-error"
          className={`popup__input-error ${
            !isUrlInputValid && "popup__error_visible"
          }`}
        >
          {errorMessage}
        </span>
      </label>
    </PopupWithForm>
  );
}
