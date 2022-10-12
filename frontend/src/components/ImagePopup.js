import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <div className={`popup popup_type_preview ${card ? "popup_open" : ""}`}>
      <div className="popup__content popup__content_content_preview">
        <img
          src={`${card ? card.link : ""}`}
          alt={`${card ? card.name : ""}`}
          className="popup__image"
        />
        <p className="popup__caption">{`${card ? card.name : ""}`}</p>
        <button
          type="button"
          aria-label="Close"
          className="popup__close popup__close_preview"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default ImagePopup;
