import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

export default function EditProfilePopup({
  isOpen,
  onClose,
  onUpdateUser,
  isLoading,
}) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isNameInputValid, setIsNameInputValid] = React.useState(false);
  const [isAboutInputValid, setIsAboutInputValid] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [aboutErrorMessage, setAboutErrorMessage] = React.useState("");

  function handleChange(evt, stateUpdater, validityUpdater) {
    stateUpdater(evt.target.value);
    validityUpdater(evt);
  }

  function handleSubmit(evt) {
    // Prevent the browser from navigating to the form address
    evt.preventDefault();

    // Pass the values of the managed components to the external handler
    onUpdateUser({
      name,
      about: description,
    });
  }

  function checkNameInputValidity(evt) {
    if (!evt.target.validity.valid) {
      setIsNameInputValid(false);
      setNameErrorMessage(evt.target.validationMessage);
    } else {
      setIsNameInputValid(true);
      setNameErrorMessage("");
    }
  }

  function checkAboutInputValidity(evt) {
    if (!evt.target.validity.valid) {
      setIsAboutInputValid(false);
      setAboutErrorMessage(evt.target.validationMessage);
    } else {
      setIsAboutInputValid(true);
      setAboutErrorMessage("");
    }
  }

  // After loading the current user from the API their data will be used in managed components.
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      title="Edit Profile"
      name="profile-form"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={`${isLoading ? "Saving" : "Save"}`}
      isInvalid={!(isNameInputValid && isAboutInputValid)}
    >
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_name"
          id="name-input"
          type="text"
          minLength="2"
          maxLength="40"
          name="user"
          value={name || ""}
          placeholder="Name"
          required
          onChange={(evt) => handleChange(evt, setName, checkNameInputValidity)}
        />
        <span
          id="avatar-input-error"
          className={`popup__input-error ${
            !isNameInputValid && "popup__error_visible"
          }`}
        >
          {nameErrorMessage}
        </span>
      </label>
      <label className="popup__label">
        <input
          className="popup__input popup__input_type_occupation"
          id="occupation-input"
          type="text"
          minLength="2"
          maxLength="200"
          name="occupation"
          value={description || ""}
          placeholder="About me"
          required
          onChange={(evt) =>
            handleChange(evt, setDescription, checkAboutInputValidity)
          }
        />
        <span
          id="avatar-input-error"
          className={`popup__input-error ${
            !isAboutInputValid && "popup__error_visible"
          }`}
        >
          {aboutErrorMessage}
        </span>
      </label>
    </PopupWithForm>
  );
}
